const { ApplicationCommandOptionType } = require('discord.js');
const { ChatInputCommand } = require('../../classes/Commands');
const {
  requiredServerConfigCommandOption,
  requiredPlayerSessionOption,
  getServerConfigCommandOptionValue,
  getPlayerSessionOptionValue,
  messageSurvivor,
  postGameLabsAction
} = require('../../modules/cftClient');

module.exports = new ChatInputCommand({
  permLevel: 'Administrator',
  global: true,
  data: {
    description: 'Kill a player that is currently online',
    options: [
      requiredServerConfigCommandOption,
      requiredPlayerSessionOption,
      {
        name: 'notify-player',
        description: 'Send a DM to the player as a notification, default true',
        type: ApplicationCommandOptionType.Boolean,
        required: false
      }
    ]
  },

  run: async (client, interaction) => {
    // Destructuring
    const { member, options } = interaction;
    const { emojis } = client.container;
    const notifyPlayer = options.getBoolean('notify-player') ?? true;

    // Deferring our reply
    await interaction.deferReply();

    // Resolve options
    const serverCfg = getServerConfigCommandOptionValue(interaction);
    const session = await getPlayerSessionOptionValue(interaction);

    // Check session, might have logged out
    if (!session) {
      interaction.editReply(`${ emojis.error } ${ member }, can't resolve provided player/session, player most likely logged out - this command has been cancelled`);
      return;
    }

    // Performing request
    const res = await postGameLabsAction(
      serverCfg.CFTOOLS_SERVER_API_ID,
      'CFCloud_KillPlayer',
      'player',
      session.steamId.id
    );

    if (res !== true) {
      interaction.editReply({ content: `${ emojis.error } ${ member }, invalid response code - **\`${ session.playerName }\`** might not have been killed` });
      return;
    }

    // Notify player
    if (notifyPlayer) {
      await messageSurvivor(serverCfg.CFTOOLS_SERVER_API_ID, session.id, 'You have been killed by an administrator');
    }

    // User feedback on success
    interaction.editReply({ content: `${ emojis.success } ${ member }, **\`${ session.playerName }\`** has been killed!` });
  }
});
