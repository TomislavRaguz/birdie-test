"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const enviroment_1 = require("../../enviroment");
const generalConfig = {
    client: 'mysql',
    connection: {
        database: enviroment_1.env.DATABASE_CONNECTION_PARAMS.DATABASE_NAME,
        user: enviroment_1.env.DATABASE_CONNECTION_PARAMS.DATABASE_USER,
        password: enviroment_1.env.DATABASE_CONNECTION_PARAMS.DATABASE_PASSWORD,
        host: enviroment_1.env.DATABASE_CONNECTION_PARAMS.DATABASE_HOST,
        port: enviroment_1.env.DATABASE_CONNECTION_PARAMS.DATABASE_PORT,
    },
    wrapIdentifier: (value, origImpl) => origImpl((0, lodash_1.snakeCase)(value)),
};
exports.default = {
    development: {
        ...generalConfig,
    },
    test: {
        ...generalConfig,
    },
    production: {
        ...generalConfig,
    },
};
