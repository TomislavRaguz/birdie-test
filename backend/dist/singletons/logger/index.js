"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const enviroment_1 = require("../../enviroment");
const pino_1 = require("pino");
const dest = pino_1.default.destination({ sync: false });
exports.logger = (0, pino_1.default)({
    enabled: enviroment_1.env.NODE_ENV !== 'test',
    level: enviroment_1.env.LOG_LEVEL,
    transport: enviroment_1.env.NODE_ENV === 'development'
        ? {
            target: 'pino-pretty',
            options: {
                colorize: true,
            },
        }
        : undefined,
}, dest);
setInterval(function () {
    exports.logger.flush();
}, 10000).unref();
