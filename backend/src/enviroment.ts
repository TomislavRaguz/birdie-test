import * as dotenv from 'dotenv';
const result = dotenv.config();
if (result.error) {
  throw result.error;
}

const logLevels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'] as const;
function getLogLevel(): typeof logLevels[number] {
  const { LOG_LEVEL } = process.env;
  if (LOG_LEVEL) {
    for (let i = 0; i < logLevels.length; i++) {
      if (logLevels[i] === LOG_LEVEL) return logLevels[i];
    }
    throw Error(`Unknown LOG_LEVEL value: ${LOG_LEVEL}`);
  }
  return 'info';
}
function getNodeEnv(): 'development' | 'production' | 'test' {
  const { NODE_ENV } = process.env;
  if (
    NODE_ENV !== 'development' &&
    NODE_ENV !== 'production' &&
    NODE_ENV !== 'test'
  ) {
    throw Error('invalid NODE_ENV value: ' + NODE_ENV);
  }
  return NODE_ENV;
}
function getPort(): number {
  const { PORT } = process.env;
  if (!PORT) throw Error('Please define a env port value');
  const portNum = parseInt(PORT);
  if (isNaN(portNum) || portNum < 1025 || portNum > 65535) {
    throw Error('PORT env value must be a number between 1025 and 65535.');
  }
  return portNum;
}
function getDbParams() {
  const {
    DATABASE_HOST,
    DATABASE_PORT,
    DATABASE_USER,
    DATABASE_PASSWORD,
    DATABASE_NAME,
  } = process.env;

  if (!DATABASE_HOST) throw Error('Missing env variable: DATABASE_HOST');
  if (!DATABASE_PORT) throw Error('Missing env variable: DATABASE_HOST');
  if (!DATABASE_USER) throw Error('Missing env variable: DATABASE_HOST');
  if (!DATABASE_PASSWORD) throw Error('Missing env variable: DATABASE_HOST');
  if (!DATABASE_NAME) throw Error('Missing env variable: DATABASE_HOST');

  const portNum = parseInt(DATABASE_PORT);
  if (isNaN(portNum) || portNum < 1025 || portNum > 65535) {
    throw Error(
      'DATABASE_PORT env value must be a number between 1025 and 65535.'
    );
  }

  return {
    DATABASE_HOST,
    DATABASE_PORT: portNum,
    DATABASE_USER,
    DATABASE_PASSWORD,
    DATABASE_NAME,
  };
}

export const env = {
  NODE_ENV: getNodeEnv(),
  PORT: getPort(),
  DATABASE_CONNECTION_PARAMS: getDbParams(),
  LOG_LEVEL: getLogLevel(),
};
