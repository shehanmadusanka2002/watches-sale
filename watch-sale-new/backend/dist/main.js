"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const express_1 = require("express");
let cachedApp;
async function bootstrap() {
    if (!cachedApp) {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        app.setGlobalPrefix('api');
        app.use((0, express_1.json)({ limit: '50mb' }));
        app.use((0, express_1.urlencoded)({ limit: '50mb', extended: true }));
        app.use((req, res, next) => {
            const allowedOrigins = [
                'https://watches-sale-63lj.vercel.app',
                'https://watches-sale.vercel.app',
                'http://localhost:3000'
            ];
            const origin = req.headers.origin;
            if (origin && allowedOrigins.includes(origin)) {
                res.header('Access-Control-Allow-Origin', origin);
            }
            else {
                res.header('Access-Control-Allow-Origin', 'https://watches-sale.vercel.app');
            }
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
            res.header('Access-Control-Allow-Credentials', 'true');
            if (req.method === 'OPTIONS') {
                res.sendStatus(200);
            }
            else {
                next();
            }
        });
        app.enableCors({
            origin: (origin, callback) => {
                const allowedOrigins = [
                    'https://watches-sale-63lj.vercel.app',
                    'https://watches-sale.vercel.app',
                    'http://localhost:3000'
                ];
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                }
                else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            credentials: true,
        });
        await app.init();
        cachedApp = app.getHttpAdapter().getInstance();
    }
    return cachedApp;
}
exports.default = async (req, res) => {
    const app = await bootstrap();
    app(req, res);
};
if (process.env.NODE_ENV !== 'production') {
    const startLocal = async () => {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        app.setGlobalPrefix('api');
        app.use((0, express_1.json)({ limit: '50mb' }));
        app.use((0, express_1.urlencoded)({ limit: '50mb', extended: true }));
        app.enableCors({ origin: true, methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', credentials: true });
        await app.listen(8080);
    };
}
//# sourceMappingURL=main.js.map