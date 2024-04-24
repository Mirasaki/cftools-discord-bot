import { WebhookEventType } from '@repo/database';

export type CFToolsWebhookEventType = 'rcon.restricted'
  | 'rcon.authentication_error'
  | 'gameserver.downtime'
  | 'gameserver.downtime_cleared'
  | 'gameserver.mod_update'
  | 'user.join'
  | 'user.leave'
  | 'user.kicked'
  | 'user.chat'
  | 'player.kill'
  | 'player.damage'
  | 'player.death'
  | 'player.death_infected'
  | 'player.death_environment'
  | 'player.death_starvation'
  | 'player.death_animal'
  | 'player.death_explosion'
  | 'player.death_object'
  | 'player.death_falldamage'
  | 'player.death_blood'
  | 'player.suicide'
  | 'player.place'
  | 'player.interact'

export const cftoolsWebhookEvents: CFToolsWebhookEventType[] = [
  'rcon.restricted',
  'rcon.authentication_error',
  'gameserver.downtime',
  'gameserver.downtime_cleared',
  'gameserver.mod_update',
  'user.join',
  'user.leave',
  'user.kicked',
  'user.chat',
  'player.kill',
  'player.damage',
  'player.death',
  'player.death_infected',
  'player.death_environment',
  'player.death_starvation',
  'player.death_animal',
  'player.death_explosion',
  'player.death_object',
  'player.death_falldamage',
  'player.death_blood',
  'player.suicide',
  'player.place',
  'player.interact',
];

export const resolveCFToolsWebhookEvent = (str: string) => {
  if (!cftoolsWebhookEvents.includes(str as CFToolsWebhookEventType)) return null;

  if (str === 'rcon.restricted') return WebhookEventType.RCON_RESTRICTED;
  if (str === 'rcon.authentication_error') return WebhookEventType.RCON_AUTHENTICATION_ERROR;
  if (str === 'gameserver.downtime') return WebhookEventType.GAMESERVER_DOWNTIME;
  if (str === 'gameserver.downtime_cleared') return WebhookEventType.GAMESERVER_DOWNTIME_CLEARED;
  if (str === 'gameserver.mod_update') return WebhookEventType.GAMESERVER_MOD_UPDATE;
  if (str === 'user.join') return WebhookEventType.USER_JOIN;
  if (str === 'user.leave') return WebhookEventType.USER_LEAVE;
  if (str === 'user.kicked') return WebhookEventType.USER_KICKED;
  if (str === 'user.chat') return WebhookEventType.USER_CHAT;
  if (str === 'player.kill') return WebhookEventType.PLAYER_KILL;
  if (str === 'player.damage') return WebhookEventType.PLAYER_DAMAGE;
  if (str === 'player.death') return WebhookEventType.PLAYER_DEATH;
  if (str === 'player.death_infected') return WebhookEventType.PLAYER_DEATH_INFECTED;
  if (str === 'player.death_environment') return WebhookEventType.PLAYER_DEATH_ENVIRONMENT;
  if (str === 'player.death_starvation') return WebhookEventType.PLAYER_DEATH_STARVATION;
  if (str === 'player.death_animal') return WebhookEventType.PLAYER_DEATH_ANIMAL;
  if (str === 'player.death_explosion') return WebhookEventType.PLAYER_DEATH_EXPLOSION;
  if (str === 'player.death_object') return WebhookEventType.PLAYER_DEATH_OBJECT;
  if (str === 'player.death_falldamage') return WebhookEventType.PLAYER_DEATH_FALLDAMAGE;
  if (str === 'player.death_blood') return WebhookEventType.PLAYER_DEATH_BLOOD;
  if (str === 'player.suicide') return WebhookEventType.PLAYER_SUICIDE;
  if (str === 'player.place') return WebhookEventType.PLAYER_PLACE;
  if (str === 'player.interact') return WebhookEventType.PLAYER_INTERACT;

  console.warn(`Unresolved webhook event: ${str}`);
  return null;
};
