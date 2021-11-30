import * as appRoot from 'app-root-path';
import { createConnection } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { env } from '../../enviroment';
console.log(appRoot)
export async function typeORMConnectionLoader() {
  const connection = await createConnection({
    type: 'mysql',
    entities:
      env.NODE_ENV !== 'production'
        ? [`${appRoot}/src/components/**/*.model.ts`]
        : [`${appRoot}/dist/components/**/*.model.js`],
    synchronize: false,
    logging: env.NODE_ENV === 'development',
    namingStrategy: new SnakeNamingStrategy(),

    database: env.DATABASE_CONNECTION_PARAMS.DATABASE_NAME,
    username: env.DATABASE_CONNECTION_PARAMS.DATABASE_USER,
    password: env.DATABASE_CONNECTION_PARAMS.DATABASE_PASSWORD,
    host: env.DATABASE_CONNECTION_PARAMS.DATABASE_HOST,
    port: env.DATABASE_CONNECTION_PARAMS.DATABASE_PORT,
  });
  return () => {
    return connection.close();
  };
}
