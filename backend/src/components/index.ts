import * as express from 'express';
import { RESTError } from '../lib';

import eventController from './events/events.controller';

export const apiController = express.Router();

apiController.use(eventController);
apiController.use(() => {
  throw new RESTError({
    HTTPStatusCode: 404,
    code: "API ROUTE 404"
  })
})