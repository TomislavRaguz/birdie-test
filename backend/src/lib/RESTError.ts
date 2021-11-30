import type { ErrorRequestHandler } from 'express';
import { env } from '../enviroment';
import { logger } from '../singletons/logger';

const { NODE_ENV } = process.env;

export class RESTError extends Error {
  extensions: Extensions;
  HTTPStatusCode: HTTPStatusCode;
  constructor(params: {
    code: string;
    HTTPStatusCode: HTTPStatusCode;
    errType?: 'operational' | 'programmer';
    userMessage?: string;
    devMessage?: any;
    noLog?: boolean;
    data?: string;
  }) {
    super(params.code);
    this.HTTPStatusCode = params.HTTPStatusCode;
    this.extensions = {
      errType: params.errType || 'operational',
    };
    if (params.userMessage) this.extensions.userMessage = params.userMessage;
    if (params.devMessage) this.extensions.devMessage = params.devMessage;
    if (params.noLog) this.extensions.noLog = params.noLog;
    if (params.data) this.extensions.data = params.data;
  }
}

export const RESTErrorRequestHandler: ErrorRequestHandler = (
  err: Error | RESTError,
  _req,
  res,
  _next
) => {
  if (!(err instanceof RESTError)) {
    logger.error(err);
    if (env.NODE_ENV !== 'development') {
      //@ts-ignore ts doesnt handle erorr message enumerability
      res.status(500).json({ message: err.message, ...err });
    }
    const errorResponsePayload: ErrorResponsePayload = {
      HTTPStatusCode: 500,
      code: 'GENERIC',
      extensions: {
        userMessage: 'Something went wrong.',
      },
    };
    res.status(500).json(errorResponsePayload);
    return;
  }
  if (!err.extensions?.noLog) logger.error(err);

  if (NODE_ENV === 'development') {
    //@ts-ignore ts doesnt handle erorr message enumerability
    res.status(err.HTTPStatusCode).json({ message: err.message, ...err });
  } else {
    //strip off revealing implementation details in production
    const errorResponsePayload: ErrorResponsePayload = {
      code: err.message,
      HTTPStatusCode: err.HTTPStatusCode,
      extensions: {
        userMessage: err.extensions.userMessage,
        data: err.extensions.data,
      },
    };
    res.status(err.HTTPStatusCode).json(errorResponsePayload);
  }
};
//TODO: 404 last route to customize the err?
type Extensions = {
  userMessage?: string;
  devMessage?: string;
  noLog?: boolean;
  data?: string;
  errType?: 'operational' | 'programmer';
};

type ErrorResponsePayload = {
  code: string;
  HTTPStatusCode: HTTPStatusCode;
  extensions: {
    userMessage?: string;
    data?: string;
  };
};

type HTTPStatusCode = 400 | 401 | 403 | 404 | 500;
