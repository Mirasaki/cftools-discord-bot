module.exports = [
  {
    // Server data
    // Global display name in Discord
    NAME: 'My Server 😎',
    // Your server api id - make sure to "grant access" through the link displayed
    // in the cftools developer portal
    CFTOOLS_SERVER_API_ID: 'YOUR_SERVER_API_ID',
    // Your DayZ server IP
    SERVER_IPV4: '91.109.116.15',
    // Your DayZ Game port
    SERVER_PORT: '2302',

    // Include mod list in /server-info
    SERVER_INFO_INCLUDE_MOD_LIST: true,

    // Global Leaderboard
    // How many players to display - min 10, max 100
    LEADERBOARD_PLAYER_LIMIT: 25,
    // Players to exclude from leaderboard
    LEADERBOARD_BLACKLIST: [
      '6284d7a30873a63f22e34f34',
      'CFTools IDs to exclude from the blacklist',
      'always use commas (,) at the end of the line EXCEPT THE LAST ONE > like so'
    ],
    // What stats should be enabled in the leaderboard
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

    // Automatic Leaderboard - A module that sets a channel as
    // dedicated, always up-to-date leaderboard feed
    // Should we automatically update/post the leaderboard
    AUTO_LB_ENABLED: true,
    // The id of the channel to post the leaderboard
    AUTO_LB_CHANNEL_ID: '806479539110674472',
    // Time between messages in minutes
    AUTO_LB_INTERVAL_IN_MINUTES: 60,
    // Should we delete our old messages
    // Also deleted other bot messages, like commands
    AUTO_LB_REMOVE_OLD_MESSAGES: true,
    // Amount of players to display on automatic leaderboard
    AUTO_LB_PLAYER_LIMIT: 100,
    // The stat to rank players by in auto leaderboard module
    // One of LEADERBOARD_STATS
    AUTO_LB_STAT: 'SUICIDES'
  }
];
