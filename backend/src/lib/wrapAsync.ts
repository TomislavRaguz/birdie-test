import * as express from 'express';

export function wrapAsync(fn: express.RequestHandler) {
  return function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    //@ts-ignore
    fn(req, res, next).catch(next);
  };
}
