"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeORMConnectionLoader = void 0;
const appRoot = require("app-root-path");
const typeorm_1 = require("typeorm");
const typeorm_naming_strategies_1 = require("typeorm-naming-strategies");
const enviroment_1 = require("../../enviroment");
console.log(appRoot);
async function typeORMConnectionLoader() {
    const connection = await (0, typeorm_1.createConnection)({
        type: 'mysql',
        entities: enviroment_1.env.NODE_ENV !== 'production'
            ? [`${appRoot}/src/components/**/*.model.ts`]
            : [`${appRoot}/dist/components/**/*.model.js`],
        synchronize: false,
        logging: enviroment_1.env.NODE_ENV === 'development',
        namingStrategy: new typeorm_naming_strategies_1.SnakeNamingStrategy(),
        database: enviroment_1.env.DATABASE_CONNECTION_PARAMS.DATABASE_NAME,
        username: enviroment_1.env.DATABASE_CONNECTION_PARAMS.DATABASE_USER,
        password: enviroment_1.env.DATABASE_CONNECTION_PARAMS.DATABASE_PASSWORD,
        host: enviroment_1.env.DATABASE_CONNECTION_PARAMS.DATABASE_HOST,
        port: enviroment_1.env.DATABASE_CONNECTION_PARAMS.DATABASE_PORT,
    });
    return () => {
        return connection.close();
    };
}
exports.typeORMConnectionLoader = typeORMConnectionLoader;
