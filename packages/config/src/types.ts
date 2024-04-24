export type LeaderboardSortValues = 'kills' | 'deaths'
  | 'suicides' | 'playtime'
  | 'longest_kill' | 'longest_shot'
  | 'kdratio';

export type Config = {
  servers: {
    /** The unique identifier for this server. */
    id: string;
    /** The public facing name of the server. */
    name: string;
    /** The IPv4 address of the server. */
    ipv4: string;
    /**
     * The port of the server
     * 
     * @default 2302
     */
    gamePort: number;
    /**
     * The Steam query port of the server
     * 
     * @default 27016
     */
    steamQueryPort: number;
    /**
     * The CFTools API ID environmental key for this server.
     * 
     * @see https://wiki.mirasaki.dev/docs/cftools-server-api-id
     */
    serverApiIdEnvKey: string;
    /**
     * The BanList identifier environmental key for this server.
     */
    banListIdEnvKey: string;
    /**
     * The CFTools webhook secret environmental key for this server.
     */
    webhookSecretEnvKey: string;
    /**
     * The CFTools BanList webhook secret environmental key for this server.
     */
    banListWebhookSecretEnvKey: string;
  }[];
  cftools: {
    leaderboard: {
      /** Should the leaderboard be enabled? */
      enabled: boolean;
      /** The default sort value for the leaderboard. */
      defaultSortValue: LeaderboardSortValues;
      /** The allowed sort values for the leaderboard. */
      allowedSortValues: LeaderboardSortValues[];
      /** The CFTools IDs to blacklist from the leaderboard, these will not be shown. */
      blacklistedCFToolsIds: string[];
      /** The amount of entries to show on the leaderboard. */
      showAmount: number;
    };
  };
};
