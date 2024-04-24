import { Router } from 'express';
import { postCFToolsWebhookController } from '../controllers/webhooks';

const router: Router = Router();

router.post(
  '/cftools/:serverId',
  postCFToolsWebhookController
);

router.post(
  '/cftools/:serverId/bans',
  async (_req, res) => {
    res.json({ ok: true });
  }
);

export default router;
