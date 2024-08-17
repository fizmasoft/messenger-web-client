import { NextFunction, Request, Response } from 'express';
export declare function globalErrorHandler(err: any, request: Request, response: Response, next: NextFunction): Response<any, Record<string, any>>;
