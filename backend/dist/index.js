"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const enviroment_1 = require("./enviroment");
const application_1 = require("./application");
const typeORM_1 = require("./singletons/typeORM");
const logger_1 = require("./singletons/logger");
(async () => {
    const typeORMDisconnect = await (0, typeORM_1.typeORMConnectionLoader)();
    const server = application_1.default.listen(enviroment_1.env.PORT, () => {
        logger_1.logger.info(`API started`);
        logger_1.logger.info(`PORT: ${enviroment_1.env.PORT}`);
        logger_1.logger.info(`NODE_ENV: ${enviroment_1.env.NODE_ENV}`);
        if (process.send)
            process.send('ready');
    });
    const gracefullShutdown = () => {
        logger_1.logger.info('');
        logger_1.logger.info('Gracefull shutdown initiated');
        server.close(() => {
            logger_1.logger.info('HTTP server closed');
            typeORMDisconnect();
            process.exit(0);
        });
    };
    process.on('SIGINT', gracefullShutdown);
    process.on('SIGTERM', gracefullShutdown);
    process.on('SIGQUIT', gracefullShutdown);
})();
