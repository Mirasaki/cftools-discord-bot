const { clientConfig } = require('../src/util');
const colors = require('../config/colors.json');

/**
 * For more information:
 * {@link https://wiki.mirasaki.dev/docs/cftools-discord-bot/server-configuration}
 */
module.exports = [
  {
    // Server data
    NAME: 'My Server 😎',
    CFTOOLS_SERVER_API_ID: 'YOUR_SERVER_API_ID',
    SERVER_IPV4: '0.0.0.0',
    SERVER_PORT: 2302,
    CFTOOLS_WEBHOOK_CHANNEL_ID: '806479539110674472',
    CFTOOLS_WEBHOOK_USER_ID: '290182686365188096',

    // Command config
    STATISTICS_INCLUDE_ZONES_HEATMAP: true,
    STATISTICS_KEEP_PUPPETEER_BROWSER_OPEN: true,
    STATISTICS_HIDE_PLAYER_NAME_HISTORY: true,
    SERVER_INFO_INCLUDE_MOD_LIST: true,

    // Live Discord > DayZ chat feed configuration
    USE_CHAT_FEED: true,
    CHAT_FEED_CHANNEL_IDS: [ '806479539110674472' ],
    CHAT_FEED_REQUIRED_ROLE_IDS: [],
    CHAT_FEED_USE_DISCORD_PREFIX: true,
    CHAT_FEED_USE_DISPLAY_NAME: true,
    CHAT_FEED_MESSAGE_COOLDOWN: 2.5,
    CHAT_FEED_MAX_DISPLAY_NAME_LENGTH: 20,
    CHAT_FEED_DISCORD_TAGS: [
      {
        roleIds: [ clientConfig.permissions.ownerId ],
        displayTag: '[OWNER]',
        color: colors.red
      },
      {
        roleIds: clientConfig.permissions.administratorRoleIds,
        displayTag: '[ADMIN]',
        color: colors.red
      },
      {
        roleIds: clientConfig.permissions.moderatorRoleIds,
        displayTag: '[MOD]',
        color: colors.blue
      },
      {
        // Matches everyone - Doesn't use any color
        roleIds: [],
        displayTag: '[SURVIVOR]',
        enabled: false
      }
    ],

    // Teleport config
    USE_TELEPORT_LOCATIONS: true,
    TELEPORT_LOCATIONS_FILE_NAME: 'chernarus',

    // Watch list config
    WATCH_LIST_CHANNEL_ID: '806479539110674472',
    WATCH_LIST_NOTIFICATION_ROLE_ID: '1112020551817502860',

    // Kill Feed config
    USE_KILL_FEED: true,
    KILL_FEED_DELAY: 5,
    KILL_FEED_CHANNEL_ID: '806479539110674472',

    // Leaderboard config
    LEADERBOARD_DEFAULT_SORTING_STAT: 'OVERALL',
    LEADERBOARD_PLAYER_LIMIT: 25,
    LEADERBOARD_BLACKLIST: [
      '6284d7a30873a63f22e34f34',
      'CFTools IDs to exclude from the blacklist',
      'always use commas (,) at the end of the line EXCEPT THE LAST ONE > like so'
    ],
    LEADERBOARD_STATS: [
      'OVERALL',
      'KILLS',
      'KILL_DEATH_RATIO',
      'LONGEST_KILL',
      'PLAYTIME',
      'LONGEST_SHOT',
      'DEATHS',
      'SUICIDES'
    ],

    // Automatic Leaderboard
    AUTO_LB_ENABLED: true,
    AUTO_LB_CHANNEL_ID: '806479539110674472',
    AUTO_LB_INTERVAL_IN_MINUTES: 60,
    AUTO_LB_REMOVE_OLD_MESSAGES: true,
    AUTO_LB_PLAYER_LIMIT: 100,
    AUTO_LB_STAT: 'OVERALL'
  }
];
