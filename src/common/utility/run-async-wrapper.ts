import { NextFunction, Request, Response } from 'express';

export function runAsyncWrapper(
  callback: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await callback(req, res, next);
    } catch (err) {
      console.log(err);

      next(err);
    }
  };
}
