import { Request, Response, NextFunction } from 'express';

export type ExpressController = (req: Request, res: Response, next: NextFunction) => Promise<void>;
