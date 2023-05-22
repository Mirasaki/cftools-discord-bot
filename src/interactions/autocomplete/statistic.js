const { ApplicationCommandOptionType } = require('discord.js');
const { ComponentCommand } = require('../../classes/Commands');
const { getServerConfigCommandOptionValue } = require('../../modules/cftClient');
const { getStatisticOptions } = require('../../modules/leaderboard');

module.exports = new ComponentCommand({ run: async (client, interaction, query) => {
  // Declarations
  const serverCfg = getServerConfigCommandOptionValue(interaction);
  const activeServerStatOptions = getStatisticOptions(serverCfg.LEADERBOARD_STATS);

  // Getting our search query's results
  // Structuring our result for Discord's API
  return activeServerStatOptions.filter(
    ({ name }) => name.toLowerCase().indexOf(query) >= 0
  );

  // Don't sort
  // .sort((a, b) => a.name.localeCompare(b.name));
} });

// Can't spread in required option if directly exported
// because the type will have been resolved
const statisticAutoCompleteOptionIdentifier = 'statistic';
module.exports.statisticAutoCompleteOptionIdentifier = statisticAutoCompleteOptionIdentifier;
const statisticAutoCompleteOption = {
  name: statisticAutoCompleteOptionIdentifier,
  description: 'The statistic to rank players by',
  type: ApplicationCommandOptionType.String,
  autocomplete: true,
  required: false
};
module.exports.statisticAutoCompleteOption = statisticAutoCompleteOption;
module.exports.requiredStatisticAutoCompleteOption = {
  ...statisticAutoCompleteOption,
  required: true
};
