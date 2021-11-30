import { snakeCase } from 'lodash';
import { env } from '../../enviroment';

const generalConfig = {
  client: 'mysql',
  connection: {
    database: env.DATABASE_CONNECTION_PARAMS.DATABASE_NAME,
    user: env.DATABASE_CONNECTION_PARAMS.DATABASE_USER,
    password: env.DATABASE_CONNECTION_PARAMS.DATABASE_PASSWORD,
    host: env.DATABASE_CONNECTION_PARAMS.DATABASE_HOST,
    port: env.DATABASE_CONNECTION_PARAMS.DATABASE_PORT,
  },
  wrapIdentifier: (value: string, origImpl: (identifier: string) => string) =>
    origImpl(snakeCase(value)),
} as const;

export default {
  development: {
    ...generalConfig,
  },

  test: {
    ...generalConfig,
  },

  production: {
    ...generalConfig,
  },
} as const;
