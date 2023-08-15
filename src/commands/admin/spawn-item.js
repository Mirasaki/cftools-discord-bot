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
    description: 'Give an item to a player that is currently online',
    options: [
      requiredServerConfigCommandOption,
      requiredPlayerSessionOption,
      {
        name: 'item-class',
        description: 'The class name of the item to give to the player',
        type: ApplicationCommandOptionType.String,
        required: true,
        min_length: 1,
        max_length: 256
      },
      {
        name: 'quantity',
        description: 'The quantity for this item, default is 1',
        type: ApplicationCommandOptionType.Number,
        required: false,
        min_value: 0.0000,
        max_value: 1000
      },
      {
        name: 'stacked',
        description: 'Spawn items as a stack (only works if item supports to be stacked), default is false',
        type: ApplicationCommandOptionType.Boolean,
        required: false
      },
      {
        name: 'debug',
        description: 'Use debug spawn method to automatically populate specific items',
        type: ApplicationCommandOptionType.Boolean,
        required: false
      }
    ]
  },
  run: async (client, interaction) => {
    // Destructuring and assignments
    const { member, options } = interaction;
    const { emojis } = client.container;
    const serverCfg = getServerConfigCommandOptionValue(interaction);
    const itemClass = options.getString('item-class');
    const quantity = options.getNumber('quantity') ?? 1;
    const stacked = options.getBoolean('stacked') ?? false;
    const debug = options.getBoolean('debug') ?? false;

    // Deferring our reply
    await interaction.deferReply();

    // Check session, might have logged out
    const session = await getPlayerSessionOptionValue(interaction);
    if (!session) {
      interaction.editReply(`${ emojis.error } ${ member }, can't resolve provided player/session, player most likely logged out - this command has been cancelled`);
      return;
    }

    // Try to perform spawn
    try {
      await cftClient.spawnItem({
        serverApiId: ServerApiId.of(serverCfg.CFTOOLS_SERVER_API_ID),
        session,
        itemClass,
        quantity,
        stacked,
        debug
      });
    }
    catch (err) {
      handleCFToolsError(interaction, err);
      return;
    }

    // Ok, feedback
    interaction.editReply({ content: `${ emojis.success } ${ member }, spawned **${ quantity }x** \`${ itemClass }\` on **\`${ session.playerName }\`**` });
  }
});


