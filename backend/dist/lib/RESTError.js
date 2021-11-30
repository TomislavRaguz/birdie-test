"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESTErrorRequestHandler = exports.RESTError = void 0;
const enviroment_1 = require("../enviroment");
const logger_1 = require("../singletons/logger");
const { NODE_ENV } = process.env;
class RESTError extends Error {
    constructor(params) {
        super(params.code);
        this.HTTPStatusCode = params.HTTPStatusCode;
        this.extensions = {
            errType: params.errType || 'operational',
        };
        if (params.userMessage)
            this.extensions.userMessage = params.userMessage;
        if (params.devMessage)
            this.extensions.devMessage = params.devMessage;
        if (params.noLog)
            this.extensions.noLog = params.noLog;
        if (params.data)
            this.extensions.data = params.data;
    }
}
exports.RESTError = RESTError;
const RESTErrorRequestHandler = (err, _req, res, _next) => {
    if (!(err instanceof RESTError)) {
        logger_1.logger.error(err);
        if (enviroment_1.env.NODE_ENV !== 'development') {
            res.status(500).json({ message: err.message, ...err });
        }
        const errorResponsePayload = {
            HTTPStatusCode: 500,
            code: 'GENERIC',
            extensions: {
                userMessage: 'Something went wrong.',
            },
        };
        res.status(500).json(errorResponsePayload);
        return;
    }
    if (!err.extensions?.noLog)
        logger_1.logger.error(err);
    if (NODE_ENV === 'development') {
        res.status(err.HTTPStatusCode).json({ message: err.message, ...err });
    }
    else {
        const errorResponsePayload = {
            code: err.message,
            HTTPStatusCode: err.HTTPStatusCode,
            extensions: {
                userMessage: err.extensions.userMessage,
                data: err.extensions.data,
            },
        };
        res.status(err.HTTPStatusCode).json(errorResponsePayload);
    }
};
exports.RESTErrorRequestHandler = RESTErrorRequestHandler;
