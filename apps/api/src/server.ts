import { json, urlencoded } from 'body-parser';
import express, { Express, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { apiErrorHandler, unknownResourceError } from './errors';
import bodyParser from 'body-parser';
import router from './router';

export const createServer = (): Express => {
  const app: Express = express();
  app
    .disable('x-powered-by')
    .use(morgan('dev'))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())
    .get('/health', (_req: Request, res: Response) => {
      return res.json({ ok: true });
    });

  /*
  * As req.body's shape is based on user-controlled input,
  * all properties and values in this object are untrusted and
  * should be validated before trusting.
  */
  app.use(bodyParser.json({ limit: '1mb' }));
  app.use(bodyParser.urlencoded({ extended: true }));
  
  // Apply our app router
  app.use(router);

  // [DEV] Improving wording and documentation
  // Where numberOfProxies is the number of proxies between the user and the server.
  // To find the correct number, hit the following endpoint until your public ip is displayed
  app.get('/ip', (req, res) => res.json({
    ok: true,
    data: req.ip,
    message: [ // [DEV] Review this endpoint
      'We don\'t log your IP internally, we don\'t save it anywhere -',
      'and can and will never share it with anyone. It is only used internally to apply',
      'rate limits when you\'re not already authenticated',
    ].join(' '),
  }));

  // Apply our local middleware
  app.get('*', (req, _res, next) => next(unknownResourceError({
    method: req.method,
    path: req.path,
  })));
  app.use(apiErrorHandler);

  return app;
};
