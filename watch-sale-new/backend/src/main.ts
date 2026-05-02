import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';

let cachedApp: any;

async function bootstrap() {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ limit: '50mb', extended: true }));

    // Manual CORS Middleware for Vercel
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
      res.header('Access-Control-Allow-Credentials', 'true');
      
      // Handle Preflight
      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
      } else {
        next();
      }
    });

    app.enableCors({
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

    await app.init();
    cachedApp = app.getHttpAdapter().getInstance();
  }
  return cachedApp;
}

export default async (req: any, res: any) => {
  const app = await bootstrap();
  app(req, res);
};

// For local development
if (process.env.NODE_ENV !== 'production') {
  const startLocal = async () => {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ limit: '50mb', extended: true }));
    app.enableCors({ origin: true, methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', credentials: true });
    await app.listen(8080);
  };
  // startLocal(); // Commented out to prevent double-boot in dev watch mode if necessary
}
