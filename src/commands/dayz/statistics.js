const {
  serverConfigCommandOption,
  getServerConfigCommandOptionValue,
  cftClient,
  handleCFToolsError
} = require('../../modules/cftClient');
const { ApplicationCommandOptionType } = require('discord.js');
const { ChatInputCommand } = require('../../classes/Commands');
const { ServerApiId } = require('cftools-sdk');
const { playerStatisticsCtx } = require('../../modules/statistics');

// Testing - Frank Blank:
// Steam64: 76561199350446127
// CFToolsID: 63dc087c3572609bfffa52af

module.exports = new ChatInputCommand({
  global: true,
  cooldown: {
    type: 'member',
    usages: 5,
    duration: 60
  },
  data: {
    description: 'Display information for a specific player',
    options: [
      {
        type: ApplicationCommandOptionType.String,
        name: 'identifier',
        description: 'The player\'s Steam64, BattlEye GUID, or Bohemia Interactive Id',
        required: true
      },
      serverConfigCommandOption
    ]
  },

  run: async (client, interaction) => {
    // Destructuring and assignments
    const { options } = interaction;
    const identifier = options.getString('identifier');
    const serverCfg = getServerConfigCommandOptionValue(interaction);

    // Deferring our reply
    await interaction.deferReply();

    // Resolve identifier to cftools id
    // Doesn't actually work with cftools id
    // At least during my testing
    // let cftoolsId = identifier;
    // try {
    //   ({ id: cftoolsId } = await cftClient.resolve({ id: identifier }));
    // }
    // catch {
    //   // Continue silently
    //   // Error is expected if identifier === cftoolsId
    // }

    // fetching from API
    let data;
    try {
      data = await cftClient.getPlayerDetails({
        playerId: { id: identifier },
        serverApiId: ServerApiId.of(serverCfg.CFTOOLS_SERVER_API_ID)
      });
    }
    catch (err) {
      handleCFToolsError(interaction, err);
      return;
    }

    // Dedicated function for stat calculations
    // and sending the result to reduce cognitive complexity
    let ctx;
    try {
      ctx = await playerStatisticsCtx(serverCfg, data);
    }
    catch (err) {
      interaction.editReply('An error occurred while processing the player\'s statistics. This is most likely an issue with the Chromium browser. Please try again later, or disable "STATISTICS_INCLUDE_ZONES_HEATMAP" in the server configuration.');
    }

    // Sending our detailed player information
    interaction.editReply(ctx);
  }
});


