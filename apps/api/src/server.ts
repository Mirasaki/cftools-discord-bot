import { json, urlencoded } from 'body-parser';
import express, { Express, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';

export const createServer = (): Express => {
  const app: Express = express();
  app
    .disable('x-powered-by')
    .use(morgan('dev'))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())
    .get('/message/:name', (req: Request, res: Response) => {
      return res.json({ message: `hello ${req.params.name}` });
    })
    .get('/health', (_req: Request, res: Response) => {
      return res.json({ ok: true });
    });

  return app;
};
