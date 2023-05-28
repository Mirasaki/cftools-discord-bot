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
const { ApplicationCommandOptionType } = require('discord.js');

module.exports = new ChatInputCommand({
  global: true,
  permLevel: 'Administrator',
  data: {
    description: 'Teleport a player that is currently online',
    options: [
      requiredServerConfigCommandOption,
      requiredPlayerSessionOption,
      {
        name: 'x-coordinate',
        description: 'The X level coordinate to teleport the player to',
        type: ApplicationCommandOptionType.Number,
        required: true,
        min_value: 0.0000,
        max_value: 100000.000
      },
      {
        name: 'y-coordinate',
        description: 'The Y level coordinate to teleport the player to',
        type: ApplicationCommandOptionType.Number,
        required: true,
        min_value: 0.0000,
        max_value: 100000.000
      },
      {
        name: 'z-coordinate',
        description: 'The Z level coordinate to teleport the player to',
        type: ApplicationCommandOptionType.Number,
        required: true,
        min_value: 0.0000,
        max_value: 100000.000
      }
    ]
  },
  run: async (client, interaction) => {
    // Destructuring and assignments
    const { member, options } = interaction;
    const { emojis } = client.container;
    const serverCfg = getServerConfigCommandOptionValue(interaction);
    const x = options.getNumber('x-coordinate');
    const z = options.getNumber('y-coordinate');
    const y = options.getNumber('z-coordinate');

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
      await cftClient.teleport({
        serverApiId: ServerApiId.of(serverCfg.CFTOOLS_SERVER_API_ID),
        session,
        coordinates: {
          // Why does the SDK switch y and z? =)
          x, y: z, z: y
        }
      });
    }
    catch (err) {
      handleCFToolsError(interaction, err);
      return;
    }

    // Ok, feedback
    interaction.editReply({ content: `${ emojis.success } ${ member }, **\`${ session.playerName }\`** has been teleported to \`<${ x }, ${ y }, ${ z }>\`` });
  }
});


