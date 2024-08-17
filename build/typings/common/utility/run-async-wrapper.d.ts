import { NextFunction, Request, Response } from 'express';
export declare function runAsyncWrapper(callback: (req: Request, res: Response, next: NextFunction) => Promise<void>): (req: Request, res: Response, next: NextFunction) => Promise<void>;
