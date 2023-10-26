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
const { debugLog } = require('../../util');

module.exports = new ChatInputCommand({
  global: true,
  permLevel: 'Administrator',
  data: {
    description: 'Teleport a player that is currently online to another player',
    options: [
      requiredServerConfigCommandOption,
      requiredPlayerSessionOption,
      {
        ...requiredPlayerSessionOption,
        name: 'player-to',
        description: 'The target in-game player to teleport the other to'
      }
    ]
  },
  run: async (client, interaction) => {
    // Destructuring and assignments
    const { member } = interaction;
    const { emojis } = client.container;
    const serverCfg = getServerConfigCommandOptionValue(interaction);

    // Deferring our reply
    await interaction.deferReply();

    // Check session, might have logged out
    const session = await getPlayerSessionOptionValue(interaction);
    if (!session) {
      interaction.editReply(`${ emojis.error } ${ member }, can't resolve provided player/session, player most likely logged out - this command has been cancelled`);
      return;
    }

    // Check target session
    const targetSession = await getPlayerSessionOptionValue(interaction, 'player-to');
    if (!targetSession) {
      interaction.editReply(`${ emojis.error } ${ member }, can't resolve provided target player/session, player most likely logged out - this command has been cancelled`);
      return;
    }

    // Check is not same session
    if (targetSession.id === session.id) {
      interaction.editReply(`${ emojis.error } ${ member }, same session provided for player and target - this command has been cancelled`);
      return;
    }

    // Resolve data
    // Haha optional fields be like
    let coords;
    const { live } = targetSession;
    if (live) {
      const { position } = live;
      if (position) {
        const { latest } = position;
        if (latest) coords = latest;
      }
    }

    // Check data availability
    if (!coords) {
      interaction.editReply(`${ emojis.error } ${ member }, can't resolve latest coordinates for target **${ targetSession.playerName }**, try again later (they might not have finished connecting/loading yet) - this command has been cancelled`);
      return;
    }

    // Try to perform teleport
    try {
      const {
        x, y, z
      } = coords;
      debugLog(`Teleporting ${ session.playerName } to ${ targetSession.playerName }, target session ref:`);
      debugLog(targetSession);
      debugLog(coords);
      await cftClient.teleport({
        serverApiId: ServerApiId.of(serverCfg.CFTOOLS_SERVER_API_ID),
        session,
        coordinates: {
          x, y, z
        }
      });
    }
    catch (err) {
      handleCFToolsError(interaction, err);
      return;
    }

    // Ok, feedback
    interaction.editReply({ content: `${ emojis.success } ${ member }, **\`${ session.playerName }\`** has been teleported to **\`${ targetSession.playerName }\`**` });
  }
});


