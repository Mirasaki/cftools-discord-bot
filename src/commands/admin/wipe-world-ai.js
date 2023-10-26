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
    description: 'Wipe/clear all AI from the world',
    options: [
      requiredServerConfigCommandOption,
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
    const notifyPlayers = options.getBoolean('notify-players') ?? true;

    // Deferring our reply
    await interaction.deferReply();

    // Resolve options
    const serverCfg = getServerConfigCommandOptionValue(interaction);

    // Performing request
    const res = await postGameLabsAction(
      serverCfg.CFTOOLS_SERVER_API_ID,
      'CFCloud_WorldWipeAI',
      'world',
      null,
      {}
    );

    if (res !== true) {
      interaction.editReply({ content: `${ emojis.error } ${ member }, invalid response code - AI might not have been wiped` });
      return;
    }

    // Notify player
    if (notifyPlayers) {
      await broadcastMessage(
        serverCfg.CFTOOLS_SERVER_API_ID,
        'All AI has been wiped/cleared by an administrator (this might take a while to take effect)'
      );
    }

    // User feedback on success
    interaction.editReply({ content: `${ emojis.success } ${ member }, all world AI has been wiped/cleared` });
  }
});
