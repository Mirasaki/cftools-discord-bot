const { ServerApiId } = require('cftools-sdk');
const {
  requiredServerConfigCommandOption,
  getServerConfigCommandOptionValue,
  handleCFToolsError,
  cftClient
} = require('../../modules/cftClient');
const { ChatInputCommand } = require('../../classes/Commands');
const { doMaxLengthChunkReply, titleCase } = require('../../util');
const { ApplicationCommandOptionType } = require('discord.js');
const { stripIndents } = require('common-tags/lib');

const banProperties = [
  'gameBanned',
  'communityBanned',
  'economyBanned',
  'vacBanned'
];

module.exports = new ChatInputCommand({
  permLevel: 'Administrator',
  global: true,
  data: {
    description: 'View the online player list - has sensitive information',
    options: [
      requiredServerConfigCommandOption,
      {
        name: 'public',
        description: 'Displays the list to everyone if true, false by default',
        type: ApplicationCommandOptionType.Boolean,
        required: false
      }
    ]
  },


  run: async (client, interaction) => {
    // Destructuring
    const {
      guild, member, options
    } = interaction;
    const { emojis } = client.container;

    // Deferring our reply
    const publicFlag = options.getBoolean('public');
    const isEphemeral = typeof publicFlag === 'boolean' ? !publicFlag : true;
    await interaction.deferReply({ ephemeral: isEphemeral });

    // Check if a proper server option is provided
    const serverCfg = getServerConfigCommandOptionValue(interaction);

    // Fetch sessions
    let sessions;
    try {
      sessions = await cftClient
        .listGameSessions({ serverApiId: ServerApiId.of(serverCfg.CFTOOLS_SERVER_API_ID) });
    }
    catch (err) {
      handleCFToolsError(interaction, err);
      return;
    }

    // Check availability
    if (!sessions || !sessions[0]) {
      interaction.editReply(`${ emojis.error } ${ member }, no one is currently online on **\`${ serverCfg.NAME }\`**`);
      return;
    }

    // Filter bans etc
    const flagged = sessions.filter(
      (e) => e.bans?.count >= 1 || banProperties.find((e) => e.bans && e.bans[e] === true)
    );

    // Destructure flagged from data and map our player strings
    const playerLinkMap = flagged.map((session) => stripIndents`
      [• ${ session.profile?.private === true ? '🕵️' : '' }${ session.playerName ?? 'Survivor' }](https://app.cftools.cloud/profile/${ session.cftoolsId.id } "CFTools Cloud Profile") ([\`${ session.profile?.name ?? 'Unknown' }\`](https://steamcommunity.com/profiles/${ session.steamId.id }/ "Steam Account Profile"))
      \` - \` ${ session.bans.count } Bans
      ${ banProperties.map((e) => `\` - \` ${ session.bans[e] === true ? emojis.success : emojis.error } ${
    titleCase(e.replace('Banned', ''))
  } Banned`).join('\n') }
    `);
    const output = `**Flagged players online:** ${ flagged.length }\n\n${ playerLinkMap.join('\n') ?? '-' }`;

    // Ok, we might have 1 line, or over 15k characters
    // Handle that accordingly
    doMaxLengthChunkReply(interaction, output, {
      title: `[ADMIN - FLAGGED] Online Player list for ${ serverCfg.NAME }`,
      titleIcon: guild.iconURL({ dynamic: true }),
      ephemeral: isEphemeral
    });
  }
});
