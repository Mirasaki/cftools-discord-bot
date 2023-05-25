const {
  getServerConfigCommandOptionValue,
  handleCFToolsError,
  requiredPlayerSessionOption,
  requiredServerConfigCommandOption,
  getPlayerSessionOptionValue,
  cftClient,
  requiredTeleportLocationOption,
  getTeleportLocationOptionValue
} = require('../../modules/cftClient');
const { ChatInputCommand } = require('../../classes/Commands');
const { ServerApiId } = require('cftools-sdk');

module.exports = new ChatInputCommand({
  global: false,
  permLevel: 'Administrator',
  data: {
    description: 'Teleport a player that is currently online to customizable locations',
    options: [
      requiredServerConfigCommandOption,
      requiredPlayerSessionOption,
      requiredTeleportLocationOption
    ]
  },
  run: async (client, interaction) => {
    // Destructuring and assignments
    const { member } = interaction;
    const { emojis } = client.container;
    const serverCfg = getServerConfigCommandOptionValue(interaction);
    const tpLocation = getTeleportLocationOptionValue(interaction);
    if (!tpLocation) {
      interaction.reply(`${ emojis.error } ${ member }, \`teleport-location\` can't be resolved. This could be because you changed server while having loaded the \`teleport-location\` option, please try again - this command has been cancelled`);
      return;
    }

    // Deferring our reply
    await interaction.deferReply();

    // Check session, might have logged out
    const session = await getPlayerSessionOptionValue(interaction);
    if (!session) {
      interaction.editReply(`${ emojis.error } ${ member }, can't resolve provided player/session, player most likely logged out - this command has been cancelled`);
      return;
    }

    // Try to perform teleport
    try {
      // Destructure and verify type
      // eslint-disable-next-line array-element-newline, array-bracket-newline
      const { name, coordinates: [ x, y, z ] } = tpLocation;
      if (
        typeof x !== 'number'
        || typeof y !== 'number'
        || typeof z !== 'number'
      ) {
        interaction.editReply(`${ emojis.error } ${ member }, invalid coordinate configuration for teleport location **${ name }**: <${ x }, ${ y }, ${ z }>`);
        return;
      }

      // Ok, perform teleport
      await cftClient.teleport({
        serverApiId: ServerApiId.of(serverCfg.CFTOOLS_SERVER_API_ID),
        session,
        coordinates: {
          x, y, z
        }
      });
    }
    catch (err) {
      handleCFToolsError(interaction, err);
      return;
    }

    // Ok, feedback
    interaction.editReply({ content: `${ emojis.success } ${ member }, **\`${ session.playerName }\`** has been teleported to **\`${ tpLocation.name }\`**` });
  }
});


