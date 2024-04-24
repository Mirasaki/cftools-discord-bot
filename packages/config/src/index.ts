import { Config } from './types';

export const config = {
  servers: [
    {
      id: 's4',
      name: '28 DAYZ LATER | s4 | TEST SERVER | DISCORD.GG/28DAYZLATER',
      ipv4: '172.111.51.30 ',
      gamePort: 2402,
      steamQueryPort: 27017,
      serverApiIdEnvKey: 'CFTOOLS_SERVER_API_ID_1',
      banListIdEnvKey: 'CFTOOLS_BAN_LIST_ID_1',
      webhookSecretEnvKey: 'CFTOOLS_WEBHOOK_SECRET_1',
      banListWebhookSecretEnvKey: 'CFTOOLS_BAN_LIST_WEBHOOK_SECRET_1',
    },
    {
      id: 's5',
      name: '28 DAYZ LATER | s5 | TEST SERVER | DISCORD.GG/28DAYZLATER',
      ipv4: '172.111.51.3',
      gamePort: 2402,
      steamQueryPort: 27017,
      serverApiIdEnvKey: 'CFTOOLS_SERVER_API_ID_2',
      banListIdEnvKey: 'CFTOOLS_BAN_LIST_ID_2',
      webhookSecretEnvKey: 'CFTOOLS_WEBHOOK_SECRET_2',
      banListWebhookSecretEnvKey: 'CFTOOLS_BAN_LIST_WEBHOOK_SECRET_2',
    },
  ],
  cftools: {
    leaderboard: {
      enabled: true,
      defaultSortValue: 'kills',
      allowedSortValues: ['kills', 'deaths', 'kdratio', 'longest_kill', 'longest_shot', 'playtime', 'suicides'],
      blacklistedCFToolsIds: [],
      showAmount: 100,
    },
  },
} satisfies Config;

export const resolvedConfig = {
  cftools: config.cftools,
  servers: config.servers.map(server => ({
    name: server.name,
    ipv4: server.ipv4,
    gamePort: server.gamePort,
    steamQueryPort: server.steamQueryPort,
    serverApiId: process.env[server.serverApiIdEnvKey],
    banListId: process.env[server.banListIdEnvKey],
    webhookSecret: process.env[server.webhookSecretEnvKey],
    banListWebhookSecret: process.env[server.banListWebhookSecretEnvKey],
  })),
};

export const resolveServer = (serverId: string) => {
  return resolvedConfig.servers.find(server => server.serverApiId === serverId);
};
