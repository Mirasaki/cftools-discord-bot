const {
  getServerConfigCommandOptionValue,
  handleCFToolsError,
  requiredPlayerSessionOption,
  requiredServerConfigCommandOption,
  getPlayerSessionOptionValue,
  cftClient
} = require('../../modules/cftClient');
const { ChatInputCommand } = require('../../classes/Commands');
const { ServerApiId } = require('cftools-sdk');

module.exports = new ChatInputCommand({
  global: true,
  permLevel: 'Moderator',
  data: {
    description: 'Heal a player that is currently online',
    options: [ requiredServerConfigCommandOption, requiredPlayerSessionOption ]
  },
  run: async (client, interaction) => {
    // Destructuring and assignments
    const { member } = interaction;
    const { emojis } = client.container;
    const serverCfg = getServerConfigCommandOptionValue(interaction);

    // Deferring our reply
    await interaction.deferReply();

    // Check session, might have logged out
    const session = await getPlayerSessionOptionValue(interaction);
    if (!session) {
      interaction.editReply(`${ emojis.error } ${ member }, can't resolve provided player/session, player most likely logged out - this command has been cancelled`);
      return;
    }

    // Try to perform heal
    try {
      await cftClient.healPlayer({
        serverApiId: ServerApiId.of(serverCfg.CFTOOLS_SERVER_API_ID),
        session
      });
    }
    catch (err) {
      handleCFToolsError(interaction, err);
      return;
    }

    // Ok, feedback
    interaction.editReply({ content: `${ emojis.success } ${ member }, **\`${ session.playerName }\`** has been healed` });
  }
});


