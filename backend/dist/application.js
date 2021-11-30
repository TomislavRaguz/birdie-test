"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enviroment_1 = require("./enviroment");
const express = require("express");
const helmet = require("helmet");
const pinoHTTP = require("pino-http");
const lib_1 = require("./lib");
const logger_1 = require("./singletons/logger");
const auth_1 = require("./singletons/auth");
const components_1 = require("./components");
const app = express();
app.use(pinoHTTP({
    logger: logger_1.logger,
}));
app.use(helmet({
    contentSecurityPolicy: enviroment_1.env.NODE_ENV === 'production' ? {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "script-src": ["'self'", "'unsafe-inline'"]
        },
    } : false,
}));
app.use(express.json());
app.use(auth_1.authMiddleware);
app.use('/api', components_1.apiController);
const PUBLIC_FOLDER = 'public';
app.use(express.static(PUBLIC_FOLDER));
app.get('*', (_req, res) => {
    res.sendFile('index.html', { root: PUBLIC_FOLDER });
});
app.use(lib_1.RESTErrorRequestHandler);
exports.default = app;
