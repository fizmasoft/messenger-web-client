import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from './status-codes';
export declare const addMethodToResponse: (request: Request, response: Response, next: NextFunction) => void;
declare module 'express' {
    interface Response {
        success: (data: any, meta?: MetaData, options?: {
            httpCode?: StatusCodes;
            code?: number;
        }) => void;
    }
    interface Request {
        rateLimit: {
            limit: number;
            used: number;
            remaining: number;
            resetTime: Date;
        };
    }
}
