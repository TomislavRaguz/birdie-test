import { env } from './enviroment';
import * as express from 'express';
import * as helmet from 'helmet';
import * as pinoHTTP from 'pino-http';
//import cookieParser from 'cookie-parser'

import { RESTErrorRequestHandler } from './lib';
import { logger } from './singletons/logger';
import { authMiddleware } from './singletons/auth';
import { apiController } from './components';

const app = express();

app.use(
  pinoHTTP({
    //@ts-ignore there is an error in pino typings
    logger,
  })
);

app.use(
  helmet({
    contentSecurityPolicy: env.NODE_ENV === 'production' ? {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": ["'self'","'unsafe-inline'"]//we need this beacuse of the react inline chunk
      },
    } : false,
  })
);

app.use(express.json());
//app.use(cookieParser());

app.use(authMiddleware);

app.use('/api', apiController);

const PUBLIC_FOLDER = 'public'
app.use(express.static(PUBLIC_FOLDER));

app.get('*', (_req, res) => {
  res.sendFile('index.html', { root: PUBLIC_FOLDER });
});

app.use(RESTErrorRequestHandler);

export default app;
