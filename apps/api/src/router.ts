import { Router } from 'express';
import { webhookRoutes } from './routes';

const router: Router = Router();

router.use('/webhooks', webhookRoutes);

export default router;
