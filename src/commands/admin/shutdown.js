const { ApplicationCommandOptionType } = require('discord.js');
const { ChatInputCommand } = require('../../classes/Commands');
const {
  requiredServerConfigCommandOption, getServerConfigCommandOptionValue, broadcastMessage, rconCommand
} = require('../../modules/cftClient');
const { MS_IN_ONE_MINUTE } = require('../../constants');
const { sleep } = require('../../util');

module.exports = new ChatInputCommand({
  permLevel: 'Administrator',
  global: true,
  data: {
    description: 'Stop the server, with an optional delay in minutes',
    options: [
      requiredServerConfigCommandOption,
      {
        type: ApplicationCommandOptionType.Integer,
        name: 'delay',
        description: 'Delay in minutes before stopping the server',
        required: true,
        min_value: 0,
        max_value: 1440
      },
      {
        type: ApplicationCommandOptionType.Boolean,
        name: 'notify-server',
        description: 'Whether to notify the server of the shutdown',
        required: true
      }
    ]
  },

  run: async (client, interaction) => {
    // Destructuring
    const { member, options } = interaction;
    const { emojis } = client.container;

    // Deferring our reply
    await interaction.deferReply();

    // Check if a proper server option is provided
    const serverCfg = getServerConfigCommandOptionValue(interaction);
    const notifyServer = options.getBoolean('notify-server') ?? true;
    const delay = options.getInteger('delay') ?? 0;
    const delayMs = delay * MS_IN_ONE_MINUTE;

    await interaction.editReply({ content: `${ emojis.success } ${ member }, scheduling shutdown in ${ delay } minutes...` });

    // Sending message to server
    if (notifyServer === true && delay > 0) {
      const res = await broadcastMessage(serverCfg.CFTOOLS_SERVER_API_ID, `Server will be shutting down in ${ delay } minutes`);
      if (res !== true) {
        interaction.followUp({ content: `${ emojis.error } ${ member }, invalid response code - message might not have broadcasted.` });
      }
    }

    // Schedule shutdown notifications
    if (delay > 60) {
      setTimeout(async () => {
        await broadcastMessage(serverCfg.CFTOOLS_SERVER_API_ID, 'Server will be shutting down in 1 hour');
        interaction.followUp({ content: `${ emojis.success } ${ member }, server is shutting down in 1 hour!` });
      }, delayMs - (60 * MS_IN_ONE_MINUTE));
    }

    if (delay > 30) {
      setTimeout(async () => {
        await broadcastMessage(serverCfg.CFTOOLS_SERVER_API_ID, 'Server will be shutting down in 30 minutes');
        interaction.followUp({ content: `${ emojis.success } ${ member }, server is shutting down in 30 minutes!` });
      }, delayMs - (60 * MS_IN_ONE_MINUTE));
    }

    if (delay > 10) {
      setTimeout(async () => {
        await broadcastMessage(serverCfg.CFTOOLS_SERVER_API_ID, 'Server will be shutting down in 10 minutes');
        interaction.followUp({ content: `${ emojis.success } ${ member }, server is shutting down in 10 minutes!` });
      }, delayMs - (60 * MS_IN_ONE_MINUTE));
    }

    if (delay > 5) {
      setTimeout(async () => {
        await broadcastMessage(serverCfg.CFTOOLS_SERVER_API_ID, 'Server will be shutting down in 5 minutes');
        interaction.followUp({ content: `${ emojis.success } ${ member }, server is shutting down in 5 minutes!` });
      }, delayMs - (60 * MS_IN_ONE_MINUTE));
    }

    if (delay > 1) {
      setTimeout(async () => {
        await broadcastMessage(serverCfg.CFTOOLS_SERVER_API_ID, 'Server will be shutting down in 1 minute');
        interaction.followUp({ content: `${ emojis.success } ${ member }, server is shutting down in 1 minutes!` });
      }, delayMs - (60 * MS_IN_ONE_MINUTE));
    }

    // Wait for delay
    await sleep(delayMs);

    const res = await rconCommand(serverCfg.CFTOOLS_SERVER_API_ID, '#shutdown');
    if (res !== true) {
      interaction.followUp({ content: `${ emojis.error } ${ member }, invalid response code - server might not have shut-down` });
      return;
    }

    // User feedback on success
    interaction.followUp({ content: `${ emojis.success } ${ member }, server is shutting down!` });
  }
});
