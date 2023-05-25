const { ComponentCommand } = require('../../classes/Commands');
const { getServerConfigCommandOptionValue, getTeleportLocations } = require('../../modules/cftClient');

module.exports = new ComponentCommand({ run: async (client, interaction, query) => {
  const serverCfg = getServerConfigCommandOptionValue(interaction);
  const teleportLocations = getTeleportLocations(serverCfg);
  if (!teleportLocations || !teleportLocations[0]) return null;

  // Getting our search query's results
  const queryResult = teleportLocations.filter((e) => e.name.toLowerCase().indexOf(query) >= 0);

  // Structuring our result for Discord's API
  return queryResult
    .map((e, ind) => ({
      name: e.name, value: ind.toString()
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
} });
