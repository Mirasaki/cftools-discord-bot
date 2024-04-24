import { createHash } from 'crypto';
import { ExpressController } from '../types';
import { resolveServer } from '@repo/config';
import { unknownResourceError } from '../errors';
import { prisma } from '@repo/database';
import { resolveCFToolsWebhookEvent } from '../helpers/webhooks';
import { debugLog } from '@repo/logger';

export const postCFToolsWebhookController: ExpressController = async (req, res, next) => {
  const { serverId } = req.params;
  const serverCfg = resolveServer(serverId);
  if (!serverCfg) {
    debugLog('Could not resolve server configuration for serverId: ', serverId);
    next(unknownResourceError({ server: serverId }));
    return;
  }

  const { headers, body } = req;
  const event = headers['x-hephaistos-event'];
  const signature = headers['x-hephaistos-signature'];
  const delivery = headers['x-hephaistos-delivery'];

  if (!delivery || Array.isArray(delivery)) {
    debugLog('Missing or invalid delivery header for serverId: ', serverId);
    next(unknownResourceError({
      server: serverId,
      reason: 'missing or invalid delivery header',
    }));
    return;
  }

  if (!event || Array.isArray(event)) {
    debugLog('Missing or invalid event header for delivery', delivery);
    next(unknownResourceError({
      server: serverId,
      reason: 'missing or invalid event header',
    }));
    return;
  }

  /**
   * If the event is a verification event, we should return a 200 status code
   * and not process the request any further. This request does NOT
   * have a signature header, so we should not attempt to verify it.
   */
  if (event === 'verification') {
    debugLog('Received verification event for delivery', delivery);
    res.sendStatus(200);
    return;
  }

  if (!signature || Array.isArray(signature)) {
    debugLog('Missing or invalid signature header for delivery', delivery);
    next(unknownResourceError({
      server: serverId,
      reason: 'missing or invalid signature header',
    }));
    return;
  }

  const hash = createHash('sha256')
    .update(`${delivery}${serverCfg.webhookSecret}`)
    .digest('hex');

  if (signature !== hash) {
    debugLog('Invalid signature for delivery', delivery);
    next(unknownResourceError({
      server: serverId,
      reason: 'invalid signature, could not verify request',
    }));
    return;
  }
  
  /**
   * At this point, we have verified the request is legitimate and we can
   * return a 200 status code to the client BEFORE processing the request.
   */
  res.sendStatus(200);

  const resolvedEvent = resolveCFToolsWebhookEvent(event);
  if (!resolvedEvent) {
    debugLog('Invalid event type for delivery', delivery);
    next(unknownResourceError({
      server: serverId,
      reason: 'invalid event type',
    }));
    return;
  }

  // Process the request
  debugLog('Processing webhook event for delivery', delivery, body);
  prisma.webhookEvent.create({
    data: {
      serverId,
      deliveryId: delivery,
      eventType: resolvedEvent,
      data: body,
    },
  });
};
