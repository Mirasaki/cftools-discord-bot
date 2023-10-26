const {
  getServerConfigCommandOptionValue,
  handleCFToolsError,
  requiredPlayerSessionOption,
  requiredServerConfigCommandOption,
  getPlayerSessionOptionValue,
  cftClient,
  playerSessionOption
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
    description: 'Teleport selected players to another player',
    options: [
      requiredServerConfigCommandOption,
      {
        ...requiredPlayerSessionOption,
        name: 'target-player'
      },
      ...Array
        // 23, 25 is max, we use 2 already
        .from({ length: 23 })
        .map((e, ind) => ({
          ...playerSessionOption,
          name: `player-${ ind + 1 }`,
          description: 'Any in-game player'
        }))
    ]
  },
  // eslint-disable-next-line sonarjs/cognitive-complexity
  run: async (client, interaction) => {
    // Destructuring and assignments
    const { member, options } = interaction;
    const { emojis } = client.container;
    const serverCfg = getServerConfigCommandOptionValue(interaction);

    // Deferring our reply
    await interaction.deferReply();

    // Check session, might have logged out
    const targetSession = await getPlayerSessionOptionValue(interaction, 'target-player');
    if (!targetSession) {
      interaction.editReply(`${ emojis.error } ${ member }, can't resolve provided player/session, player most likely logged out - this command has been cancelled`);
      return;
    }

    // Resolve all sessions from command options
    const allSessions = await Promise.all(
      Array
        .from({ length: 23 })
        .map((e, ind) => options.getString(`player-${ ind + 1 }`) ? getPlayerSessionOptionValue(interaction, `player-${ ind + 1 }`) : null)
        .filter((e) => e !== null) // truthy values only
    );

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

    // Notify start
    await interaction.editReply(`${ emojis.wait } ${ member }, teleporting selected players to **\`${ targetSession.playerName }\`**, **this will happen in ${ TELEPORT_COOLDOWN_IN_SECONDS } second intervals to avoid getting rate limited**`);

    // Teleport selected players to target
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
      const remainingSeconds = TELEPORT_COOLDOWN_IN_SECONDS * (allSessions.length - (sessionIndex + 1));
      const timeRemainingStr = sessionIndex + 1 !== allSessions.length
        ? ` ~${ msToHumanReadableTime(remainingSeconds * 1000) } remaining`
        : '';

      // Explicit await for non-static loop interval
      await interaction.followUp(`${ emojis.success } Teleported **\`${ session.playerName }\`** to **\`${ targetSession.playerName }\`** (${ sessionIndex + 1 } out of ${ allSessions.length })${ timeRemainingStr }`);

      // Sleep for 15 seconds
      await sleep(MS_IN_ONE_SECOND * TELEPORT_COOLDOWN_IN_SECONDS);
    }

    // Ok, feedback
    interaction.editReply({ content: `${ emojis.success } ${ member }, selected players have been teleported to **\`${ targetSession.playerName }\`**` });
    interaction.followUp(`${ emojis.success } ${ member }, finished teleporting`);
  }
});


