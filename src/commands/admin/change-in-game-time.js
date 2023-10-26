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
    description: 'Change the current in-game time',
    options: [
      requiredServerConfigCommandOption,
      {
        name: 'hour',
        description: 'The hour to set the time to',
        type: ApplicationCommandOptionType.Integer,
        required: true,
        min_value: 0,
        max_value: 23
      },
      {
        name: 'minute',
        description: 'The minute to set the time to',
        type: ApplicationCommandOptionType.Integer,
        required: true,
        min_value: 0,
        max_value: 59
      },
      {
        name: 'notify-players',
        description: 'Send a global notification to the players, default true',
        type: ApplicationCommandOptionType.Boolean,
        required: false
      }
    ]
  },

  run: async (client, interaction) => {
    // Destructuring
    const { member, options } = interaction;
    const { emojis } = client.container;
    const hour = options.getInteger('hour');
    const minute = options.getInteger('minute');
    const notifyPlayers = options.getBoolean('notify-players') ?? true;

    // Deferring our reply
    await interaction.deferReply();

    // Resolve options
    const serverCfg = getServerConfigCommandOptionValue(interaction);

    // Performing request
    const res = await postGameLabsAction(
      serverCfg.CFTOOLS_SERVER_API_ID,
      'CFCloud_WorldTime',
      'world',
      null,
      {
        hour: { valueInt: hour },
        minute: { valueInt: minute }
      }
    );

    if (res !== true) {
      interaction.editReply({ content: `${ emojis.error } ${ member }, invalid response code - time might not have been updated` });
      return;
    }

    const hourStr = hour.toString().padStart(2, '0');
    const minuteStr = minute.toString().padStart(2, '0');
    const timeStr = `${ hourStr }:${ minuteStr }`;

    // Notify player
    if (notifyPlayers) {
      await broadcastMessage(
        serverCfg.CFTOOLS_SERVER_API_ID,
        `The time has been changed to ${ timeStr } by an administrator (this might take a while to take effect)`
      );
    }

    // User feedback on success
    interaction.editReply({ content: `${ emojis.success } ${ member }, time has been changed to **\`${ timeStr }\`**!` });
  }
});
