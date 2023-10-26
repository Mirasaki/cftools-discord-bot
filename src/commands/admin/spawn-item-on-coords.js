const { ApplicationCommandOptionType } = require('discord.js');
const { ChatInputCommand } = require('../../classes/Commands');
const {
  requiredServerConfigCommandOption,
  getServerConfigCommandOptionValue,
  postGameLabsAction,
  broadcastMessage
} = require('../../modules/cftClient');

module.exports = new ChatInputCommand({
  permLevel: 'Administrator',
  global: true,
  data: {
    description: 'Spawn an item at provided coordinates',
    options: [
      requiredServerConfigCommandOption,
      {
        name: 'item-class',
        description: 'The class name of the item to give to the player',
        type: ApplicationCommandOptionType.String,
        required: true,
        min_length: 1,
        max_length: 256
      },
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
      },
      {
        name: 'notify-players',
        description: 'Send a global notification to the players, default FALSE',
        type: ApplicationCommandOptionType.Boolean,
        required: false
      }
    ]
  },

  run: async (client, interaction) => {
    // Destructuring
    const { member, options } = interaction;
    const { emojis } = client.container;
    const itemClass = options.getString('item-class');
    const quantity = options.getNumber('quantity') ?? 1;
    const stacked = options.getBoolean('stacked') ?? false;
    const debug = options.getBoolean('debug') ?? false;
    const x = options.getNumber('x-coordinate');
    const y = options.getNumber('y-coordinate');
    const z = options.getNumber('z-coordinate');
    const notifyPlayers = options.getBoolean('notify-players') ?? false;

    // Deferring our reply
    await interaction.deferReply();

    // Resolve options
    const serverCfg = getServerConfigCommandOptionValue(interaction);

    // Performing request
    const res = await postGameLabsAction(
      serverCfg.CFTOOLS_SERVER_API_ID,
      'CFCloud_SpawnItemWorld',
      'world',
      null,
      {
        vector: {
          dataType: 'vector',
          valueVectorX: x,
          valueVectorY: y,
          valueVectorZ: z
        },
        item: {
          dataType: 'string',
          valueString: itemClass
        },
        quantity: {
          dataType: 'int',
          valueInt: quantity
        },
        stacked: {
          dataType: 'boolean',
          valueBool: stacked
        },
        debug: {
          dataType: 'boolean',
          valueBool: debug
        }
      }
    );

    if (res !== true) {
      interaction.editReply({ content: `${ emojis.error } ${ member }, invalid response code - item might not have been spawned at provided coordinates` });
      return;
    }

    // Notify player
    if (notifyPlayers) {
      await broadcastMessage(
        serverCfg.CFTOOLS_SERVER_API_ID,
        `${ itemClass } has spawned at ${ x }, ${ y }, ${ z }!`
      );
    }

    // User feedback on success
    interaction.editReply({ content: `${ emojis.success } ${ member }, ${ itemClass } has been spawned at ${ x }, ${ y }, ${ z }` });
  }
});
