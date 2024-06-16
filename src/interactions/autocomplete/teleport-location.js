const { ComponentCommand } = require('../../classes/Commands');
const { getServerConfigCommandOptionValue, getTeleportLocations } = require('../../modules/cftClient');

module.exports = new ComponentCommand({ run: async (client, interaction, query) => {
  // Check active/enabled
  const serverCfg = getServerConfigCommandOptionValue(interaction);
  if (!serverCfg.USE_TELEPORT_LOCATIONS) return [
    {
      name: 'Teleport locations aren\'t enabled for this server configuration',
      value: '-1'
    }
  ];

  // Resolve locations
  const teleportLocations = getTeleportLocations(serverCfg);
  if (!teleportLocations || !teleportLocations[0]) return null;

  // Getting our search query's results
  const queryResult = teleportLocations.filter((e) => e.name.toLowerCase().indexOf(query) >= 0);

  // Structuring our result for Discord's API
  return queryResult
    .map((e) => ({
      name: e.name,
      value: teleportLocations.indexOf(e).toString()
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
} });
