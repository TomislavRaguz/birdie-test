import knex from 'knex';
import { env } from '../../enviroment';
import knexfile from './knexfile';

const knexConfig = knexfile[env.NODE_ENV];

export const db = knex(knexConfig);
