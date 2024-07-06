import { NextFunction, Request, Response } from 'express';
import { BaseException } from '../errors/common.error';
import { StatusCodes } from './status-codes';
import { CODES } from '../constant';

export const addMethodToResponse = (request: Request, response: Response, next: NextFunction) => {
  response.success = function (
    data,
    meta: MetaData = null,
    {
      code = CODES.BASE,
      httpCode = StatusCodes.OK,
    }: { httpCode?: StatusCodes; code?: number } = {},
  ) {
    // if (data && Array.isArray(data.data) && data.total >= 0) {
    //   data = data.data;
    //   meta.total = data.total;
    // }
    // const success = BaseException.Success(data, meta);
    const json = BaseException.Success(data, meta, code);

    return response.status(httpCode).json({
      ...json,
      message: request.t(json.message.text, json.message.replace),
    });
  };
  next();
};

declare module 'express' {
  export interface Response {
    success: (
      data: any,
      meta?: MetaData,
      options?: { httpCode?: StatusCodes; code?: number },
    ) => void;
  }

  export interface Request {
    rateLimit: {
      limit: number;
      used: number;
      remaining: number;
      resetTime: Date;
    };
  }
}
