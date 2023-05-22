const { ApplicationCommandOptionType } = require('discord.js');
const { ChatInputCommand } = require('../../classes/Commands');
const {
  requiredServerConfigCommandOption,
  requiredPlayerSessionOption,
  getServerConfigCommandOptionValue,
  getPlayerSessionOptionValue,
  messageSurvivor
} = require('../../modules/cftClient');

module.exports = new ChatInputCommand({
  permLevel: 'Administrator',
  global: true,
  data: {
    description: 'Send a private message to an online survivor',
    options: [
      requiredServerConfigCommandOption,
      requiredPlayerSessionOption,
      {
        type: ApplicationCommandOptionType.String,
        name: 'message',
        description: 'Message to send to specified player',
        required: true,
        min_length: 3,
        max_length: 256
      }
    ]
  },

  run: async (client, interaction) => {
    // Destructuring
    const { member, options } = interaction;
    const { emojis } = client.container;

    // Deferring our reply
    await interaction.deferReply();

    // Resolve options
    const serverCfg = getServerConfigCommandOptionValue(interaction);
    const session = await getPlayerSessionOptionValue(interaction);
    const message = options.getString('message');

    // Check session, might have logged out
    if (!session) {
      interaction.editReply(`${ emojis.error } ${ member }, can't resolve provided player/session, player most likely logged out - this command has been cancelled`);
      return;
    }

    // Checking message length
    if (message.length > 256) {
      interaction.editReply({ content: `${ emojis.error } ${ member }, message content can't be over \`256\` characters long - this command has been cancelled` });
      return;
    }

    // Sending message to survivor
    const res = await messageSurvivor(serverCfg.CFTOOLS_SERVER_API_ID, session.id, message);
    if (res !== true) {
      interaction.editReply({ content: `${ emojis.error } ${ member }, invalid response code - message might not have been DM'ed to **\`${ session.playerName }\`**` });
      return;
    }

    // User feedback on success
    interaction.editReply({ content: `${ emojis.success } ${ member }, message delivered to **\`${ session.playerName }\`**.\n\n\`\`\`${ message }\`\`\`` });
  }
});
