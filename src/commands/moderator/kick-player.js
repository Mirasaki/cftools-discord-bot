const {
  getServerConfigCommandOptionValue,
  handleCFToolsError,
  requiredPlayerSessionOption,
  requiredServerConfigCommandOption,
  getPlayerSessionOptionValue,
  kickPlayer
} = require('../../modules/cftClient');
const { ChatInputCommand } = require('../../classes/Commands');
const { ApplicationCommandOptionType } = require('discord.js');

module.exports = new ChatInputCommand({
  global: true,
  permLevel: 'Moderator',
  data: {
    description: 'Kick a player that is currently online',
    options: [
      requiredServerConfigCommandOption,
      requiredPlayerSessionOption,
      {
        name: 'reason',
        description: 'The reason for this kick, required',
        type: ApplicationCommandOptionType.String,
        required: true,
        min_length: 1,
        max_length: 128
      }
    ]
  },
  run: async (client, interaction) => {
    // Destructuring and assignments
    const { member, options } = interaction;
    const { emojis } = client.container;
    const reason = options.getString('reason') ?? 'n/a';
    const serverCfg = getServerConfigCommandOptionValue(interaction);

    // Deferring our reply
    await interaction.deferReply();

    // Check session, might have logged out
    const session = await getPlayerSessionOptionValue(interaction);
    if (!session) {
      interaction.editReply(`${ emojis.error } ${ member }, can't resolve provided player/session, player most likely logged out - this command has been cancelled`);
      return;
    }

    // Try to perform kick
    let res;
    try {
      res = await kickPlayer(
        serverCfg.CFTOOLS_SERVER_API_ID,
        session.id,
        reason
      );
    }
    catch (err) {
      handleCFToolsError(interaction, err);
      return;
    }

    // Check has failed
    if (res !== true) {
      interaction.editReply({ content: `${ emojis.error } ${ member }, invalid response code - **\`${ session.playerName }\`** might not have been kicked` });
      return;
    }

    // Ok, feedback
    interaction.editReply({ content: `${ emojis.success } ${ member }, **\`${ session.playerName }\`** has been kicked` });
  }
});


