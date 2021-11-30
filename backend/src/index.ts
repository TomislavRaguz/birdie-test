import 'reflect-metadata';
import { env } from './enviroment';
import app from './application';
//import { dbLoader } from './singletons/knex/loader';
import { typeORMConnectionLoader } from './singletons/typeORM';
import { logger } from './singletons/logger';

(async () => {
  //const dbDisconnect = await dbLoader()
  const typeORMDisconnect = await typeORMConnectionLoader();
  const server = app.listen(env.PORT, () => {
    logger.info(`API started`);
    logger.info(`PORT: ${env.PORT}`);
    logger.info(`NODE_ENV: ${env.NODE_ENV}`);
    //server ready signals
    //this line tells the pm2 that server is ready
    if (process.send) process.send('ready');
  });

  const gracefullShutdown = () => {
    logger.info('');
    logger.info('Gracefull shutdown initiated');
    server.close(() => {
      logger.info('HTTP server closed');
      //dbDisconnect()
      typeORMDisconnect();
      process.exit(0);
    });
  };

  process.on('SIGINT', gracefullShutdown);
  process.on('SIGTERM', gracefullShutdown);
  process.on('SIGQUIT', gracefullShutdown);
})();

/*
for this project its good enough to just let pm2 log and restart
process.on('unhandledRejection', (reason: string, p: Promise<any>) => {
  throw reason;
});

process.on('uncaughtException', (error: Error) => {
  //errorManagement.handler.handleError(error);
  //if (!errorManagement.handler.isTrustedError(error))
  //  process.exit(1);
});
*/
