const { ServerApiId } = require('cftools-sdk');
const {
  getServerConfigCommandOptionValue,
  handleCFToolsError,
  cftClient,
  serverConfigCommandOption
} = require('../../modules/cftClient');
const { ChatInputCommand } = require('../../classes/Commands');
const { doMaxLengthChunkReply } = require('../../util');

module.exports = new ChatInputCommand({
  global: true,
  cooldown: {
    usages: 1,
    duration: 30
  },
  data: {
    description: 'View the online player list - has sensitive information',
    options: [ serverConfigCommandOption ]
  },


  run: async (client, interaction) => {
    // Destructuring
    const { guild, member } = interaction;
    const { emojis } = client.container;

    // Deferring our reply
    await interaction.deferReply();

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

    // Destructure sessions from data and map our player strings
    const playerMap = sessions.map((session) => `• ${ session.playerName ?? 'Survivor' }`);
    const output = `**Players online:** ${ sessions.length }\n\n${ playerMap.join('\n') ?? '-' }`;

    // Ok, we might have 1 line, or over 15k characters
    // Handle that accordingly
    doMaxLengthChunkReply(interaction, output, {
      title: `Online Player list for ${ serverCfg.NAME }`,
      titleIcon: guild.iconURL({ dynamic: true })
    });
  }
});
