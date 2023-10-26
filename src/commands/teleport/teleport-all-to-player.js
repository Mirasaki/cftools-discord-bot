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
const { sleep, msToHumanReadableTime } = require('../../util');
const { MS_IN_ONE_SECOND } = require('../../constants');
const TELEPORT_COOLDOWN_IN_SECONDS = 15;

module.exports = new ChatInputCommand({
  global: true,
  permLevel: 'Administrator',
  data: {
    description: 'Teleport everyone that is currently online to a player',
    options: [ requiredServerConfigCommandOption, requiredPlayerSessionOption ]
  },
  // eslint-disable-next-line sonarjs/cognitive-complexity
  run: async (client, interaction) => {
    // Destructuring and assignments
    const { member } = interaction;
    const { emojis } = client.container;
    const serverCfg = getServerConfigCommandOptionValue(interaction);

    // Deferring our reply
    await interaction.deferReply();

    // Check session, might have logged out
    const targetSession = await getPlayerSessionOptionValue(interaction);
    if (!targetSession) {
      interaction.editReply(`${ emojis.error } ${ member }, can't resolve provided player/session, player most likely logged out - this command has been cancelled`);
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
      interaction.editReply(`${ emojis.error } ${ member }, can't resolve latest coordinates for target **\`${ targetSession.playerName }\`**, try again later (they might not have finished connecting/loading yet) - this command has been cancelled`);
      return;
    }

    // Safe to destructure
    const {
      x, y, z
    } = coords;

    // Fetch all sessions
    const allSessions = await cftClient
      .listGameSessions({ serverApiId: ServerApiId.of(serverCfg.CFTOOLS_SERVER_API_ID) });

    // Notify start
    await interaction.editReply(`${ emojis.wait } ${ member }, teleporting everyone to **\`${ targetSession.playerName }\`**, **this will happen in ${ TELEPORT_COOLDOWN_IN_SECONDS } second intervals to avoid getting rate limited**`);

    // Teleport everyone to target
    for await (const session of allSessions) {
      const sessionIndex = allSessions.indexOf(session);

      // Skip target player
      if (session.id === targetSession.id) {
        interaction.followUp(`${ emojis.success } Skipping **\`${ session.playerName }\`** as they are the target location (${ sessionIndex + 1 } out of ${ allSessions.length })`);
        continue;
      }

      // Try to perform teleport, for each session
      // On a 15 second interval
      try {
        await cftClient.teleport({
          serverApiId: ServerApiId.of(serverCfg.CFTOOLS_SERVER_API_ID),
          session,
          coordinates: {
            x, y, z
          }
        });
      }
      catch (err) {
        handleCFToolsError(interaction, err, true);
        // Sleep for 15 seconds - even if error is encountered
        await sleep(MS_IN_ONE_SECOND * TELEPORT_COOLDOWN_IN_SECONDS);
        continue;
      }

      // Resolve remaining time str, account for skipping target session
      const remainingSeconds = TELEPORT_COOLDOWN_IN_SECONDS * ((
        /* Should account for 0-index, but we add 1 for the target player session **/
        allSessions.length - 2
      ) - (sessionIndex - (
        sessionIndex >= allSessions.indexOf(targetSession)
          ? 1
          : 0
      )));
      const timeRemainingStr = sessionIndex + 1 !== allSessions.length
        ? ` ~${ msToHumanReadableTime(remainingSeconds * 1000) } remaining`
        : '';

      // Explicit await for non-static loop interval
      await interaction.followUp(`${ emojis.success } Teleported **\`${ session.playerName }\`** to **\`${ targetSession.playerName }\`** (${ sessionIndex + 1 } out of ${ allSessions.length })${ timeRemainingStr }`);

      // Sleep for 15 seconds
      await sleep(MS_IN_ONE_SECOND * TELEPORT_COOLDOWN_IN_SECONDS);
    }

    // Ok, feedback
    interaction.editReply({ content: `${ emojis.success } ${ member }, everyone has been teleported to **\`${ targetSession.playerName }\`**` });
    interaction.followUp(`${ emojis.success } ${ member }, finished teleporting`);
  }
});


