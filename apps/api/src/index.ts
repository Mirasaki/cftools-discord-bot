import { createServer } from './server';
import { log } from '@repo/logger';

const port = process.env.API_PORT ?? 5000;
const server = createServer();

server.listen(port, () => {
  log(`API running on ${port}`);
});
