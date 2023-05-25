/**
 * SEE the README.md file for explanation and details
 */

module.exports = [
  {
    // Server data
    NAME: 'My Server 😎',
    CFTOOLS_SERVER_API_ID: 'YOUR_SERVER_API_ID',
    SERVER_IPV4: '0.0.0.0',
    SERVER_PORT: 2302,

    // Command config
    STATISTICS_INCLUDE_ZONES_HEATMAP: true,
    STATISTICS_KEEP_PUPPETEER_BROWSER_OPEN: true,
    SERVER_INFO_INCLUDE_MOD_LIST: true,

    // Leaderboard config
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
    AUTO_LB_STAT: 'SUICIDES'
  }
];
