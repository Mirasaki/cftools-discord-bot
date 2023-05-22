const { ComponentCommand } = require('../../classes/Commands');
const { getServerConfigCommandOptionValue, survivorSessionOptionValues } = require('../../modules/cftClient');

module.exports = new ComponentCommand({ run: async (client, interaction, query) => {
  const serverCfg = getServerConfigCommandOptionValue(interaction);
  const inGameSurvivors = await survivorSessionOptionValues(serverCfg.CFTOOLS_SERVER_API_ID);

  // Getting our search query's results
  const queryResult = inGameSurvivors.filter((e) => e.name.toLowerCase().indexOf(query) >= 0);

  // Structuring our result for Discord's API
  return queryResult
    .sort((a, b) => a.name.localeCompare(b.name));
} });
