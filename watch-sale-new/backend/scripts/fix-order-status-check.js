const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

function loadEnvFromFile(envPath) {
  const env = {};
  if (!fs.existsSync(envPath)) return env;

  const content = fs.readFileSync(envPath, 'utf8');
  const lines = content.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const eqIndex = line.indexOf('=');
    if (eqIndex === -1) continue;

    const key = line.slice(0, eqIndex).trim();
    let value = line.slice(eqIndex + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

async function main() {
  const envPath = path.resolve(__dirname, '..', '.env');
  const fileEnv = loadEnvFromFile(envPath);

  const dbConfig = {
    host: process.env.DB_HOST || fileEnv.DB_HOST,
    port: Number(process.env.DB_PORT || fileEnv.DB_PORT || 3306),
    user: process.env.DB_USERNAME || fileEnv.DB_USERNAME,
    password: process.env.DB_PASSWORD || fileEnv.DB_PASSWORD,
    database: process.env.DB_DATABASE || fileEnv.DB_DATABASE,
    ssl: { rejectUnauthorized: false },
  };

  if (!dbConfig.host || !dbConfig.user || !dbConfig.password || !dbConfig.database) {
    throw new Error('Missing DB configuration. Ensure DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE are set.');
  }

  const conn = await mysql.createConnection(dbConfig);

  try {
    const [rows] = await conn.query(
      `SELECT tc.CONSTRAINT_NAME AS constraintName, cc.CHECK_CLAUSE AS checkClause
       FROM information_schema.table_constraints tc
       JOIN information_schema.check_constraints cc
         ON tc.CONSTRAINT_SCHEMA = cc.CONSTRAINT_SCHEMA
        AND tc.CONSTRAINT_NAME = cc.CONSTRAINT_NAME
      WHERE tc.CONSTRAINT_SCHEMA = DATABASE()
        AND tc.TABLE_NAME = 'orders'
        AND tc.CONSTRAINT_TYPE = 'CHECK'`
    );

    const checks = Array.isArray(rows) ? rows : [];
    const statusChecks = checks.filter((r) => {
      const clause = String(r.checkClause || '').toLowerCase();
      return clause.includes('status');
    });

    const alreadySupportsConfirmed = statusChecks.some((r) => {
      const clause = String(r.checkClause || '').replace(/\s+/g, '');
      return clause.includes('statusin(0,1,2,3,4)') || clause.includes('`status`in(0,1,2,3,4)');
    });

    if (alreadySupportsConfirmed) {
      console.log('orders.status check already allows CONFIRMED (4). No changes needed.');
      return;
    }

    for (const check of statusChecks) {
      await conn.query(`ALTER TABLE orders DROP CHECK \`${check.constraintName}\``);
      console.log(`Dropped check constraint: ${check.constraintName}`);
    }

    await conn.query('ALTER TABLE orders ADD CONSTRAINT `orders_chk_status` CHECK (`status` IN (0,1,2,3,4))');
    console.log('Added check constraint orders_chk_status allowing statuses 0,1,2,3,4.');
  } finally {
    await conn.end();
  }
}

main().catch((error) => {
  console.error('Failed to fix orders status check:', error.message);
  process.exit(1);
});
