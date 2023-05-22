const { ApplicationCommandOptionType } = require('discord.js');
const { ChatInputCommand } = require('../../classes/Commands');
const {
  requiredServerConfigCommandOption, getServerConfigCommandOptionValue, broadcastMessage
} = require('../../modules/cftClient');

module.exports = new ChatInputCommand({
  permLevel: 'Administrator',
  global: true,
  data: {
    description: 'Broadcast a message to the entire server',
    options: [
      requiredServerConfigCommandOption,
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

    // Check if a proper server option is provided
    const serverCfg = getServerConfigCommandOptionValue(interaction);

    // Assignment
    const message = options.getString('message');

    // Checking message length
    if (message.length > 256) {
      interaction.editReply({ content: `${ emojis.error } ${ member }, message content can't be over \`256\` characters long - this command has been cancelled` });
      return;
    }

    // Sending message to server
    const res = await broadcastMessage(serverCfg.CFTOOLS_SERVER_API_ID, message);
    if (res !== true) {
      interaction.editReply({ content: `${ emojis.error } ${ member }, invalid response code - message might not have broadcasted.` });
      return;
    }

    // User feedback on success
    interaction.editReply({ content: `${ emojis.success } ${ member }, message delivered and displayed to everyone online.\n\n\`\`\`${ message }\`\`\`` });
  }
});
