const logger = require('@mirasaki/logger');
const { Statistic, ServerApiId } = require('cftools-sdk');

// Mapping our Interaction Command API options
const { ChatInputCommand } = require('../../classes/Commands');
const {
  getServerConfigCommandOptionValue, requiredServerConfigCommandOption, cftClient
} = require('../../modules/cftClient');
const { statisticAutoCompleteOption, statisticAutoCompleteOptionIdentifier } = require('../../interactions/autocomplete/statistic');
const { buildLeaderboardEmbedMessages } = require('../../modules/leaderboard');


module.exports = new ChatInputCommand({
  // This is a global command
  global: true,
  // Setting a cooldown to avoid abuse
  // Allowed 7 times every 60 seconds per user
  cooldown: {
    type: 'member',
    usages: 7,
    duration: 60
  },
  // Defining our Discord Application Command API data
  // Name is generated from the file name if left undefined
  data: {
    description: 'Display your DayZ Leaderboard',
    options: [ requiredServerConfigCommandOption, statisticAutoCompleteOption ]
  },

  run: async (client, interaction) => {
    // Destructure from our Discord interaction
    const {
      member, guild, options
    } = interaction;
    const { emojis } = client.container;

    // Declarations
    const serverCfg = getServerConfigCommandOptionValue(interaction);
    const statStr = options.getString(statisticAutoCompleteOptionIdentifier)
      ?? serverCfg.LEADERBOARD_DEFAULT_SORTING_STAT
      ?? 'OVERALL';
    const statToGet = Statistic[
      statStr === 'OVERALL'
        ? 'KILL_DEATH_RATIO'
        : statStr
    ];

    // Deferring our interaction
    // due to possible API latency
    await interaction.deferReply();

    // Default
    // No option provided OR
    // 'overall' option specified
    const isDefaultQuery = statStr === 'OVERALL';

    // Getting our player data count
    let playerLimit = Number(serverCfg.LEADERBOARD_PLAYER_LIMIT);
    if (
      isNaN(playerLimit)
      || playerLimit < 10
      || playerLimit > 100
    ) {
      // Overwrite the provided player limit back to default if invalid
      playerLimit = 15;
    }

    let res;
    try {
      // Fetching our leaderboard data from the CFTools API
      res = await cftClient
        .getLeaderboard({
          serverApiId: ServerApiId.of(serverCfg.CFTOOLS_SERVER_API_ID),
          order: 'ASC',
          statistic: statToGet ?? (
            Statistic[serverCfg.LEADERBOARD_DEFAULT_SORTING_STAT ?? 'KILL_DEATH_RATIO']
          ),
          // Always use max limit, since we remove blacklist entries
          limit: 100
        });
    }
    catch (err) {
      // Properly logging the error if it is encountered
      logger.syserr('Encounter an error while fetching leaderboard data');
      logger.printErr(err);

      // Notify the user
      // Include debug in non-production environments
      interaction.editReply({ content: `${ emojis.error } ${ member }, error encountered while fetching leaderboard data: ${ err.message }` });

      // Returning the request
      return;
    }

    // Check if any data is actually present
    if (res.length === 0) {
      interaction.editReply({ content: `${ emojis.error } ${ member }, we don't have any data for that statistic yet.` });
      return;
    }

    // Filter out our blacklisted ids/entries
    const whitelistedData = res.filter((e) => !serverCfg.LEADERBOARD_BLACKLIST.includes(e.id.id));

    // Constructing our embed object
    const lbEmbedMessages = buildLeaderboardEmbedMessages(
      guild,
      whitelistedData,
      isDefaultQuery,
      statToGet,
      playerLimit
    );

    // Responding to our request
    await interaction.editReply({ embeds: lbEmbedMessages[0] });
    for (const msgEmbeds of lbEmbedMessages.slice(1, lbEmbedMessages.length)) {
      interaction.followUp({ embeds: msgEmbeds });
    }
  }
});
