const { Game } = require('cftools-sdk');
const {
  getServerConfigCommandOptionValue,
  handleCFToolsError,
  cftClient,
  serverConfigCommandOption
} = require('../../modules/cftClient');
const { ChatInputCommand } = require('../../classes/Commands');
const { colorResolver } = require('../../util');
const { resolveFlags, serverInfoOverviewEmbed } = require('../../modules/server-info');

module.exports = new ChatInputCommand({
  global: true,
  cooldown: {
    usages: 2,
    duration: 30
  },
  data: {
    description: 'Display general server information',
    options: [ serverConfigCommandOption ]
  },
  run: async (client, interaction) => {
    // Destructuring
    const { guild } = interaction;
    const { colors, emojis } = client.container;

    // Deferring our reply
    await interaction.deferReply();

    // Check if a proper server option is provided
    const serverCfg = getServerConfigCommandOptionValue(interaction);

    // Fetch sessions
    let data;
    try {
      data = await cftClient.getGameServerDetails({
        game: Game.DayZ,
        ip: serverCfg.SERVER_IPV4,
        port: serverCfg.SERVER_PORT
      });
    }
    catch (err) {
      handleCFToolsError(interaction, err);
      return;
    }

    // Set up context
    const ctx = { embeds: [] };
    const { mods, attributes } = data;

    // Resolve flags
    const flags = resolveFlags({ attributes });

    // Not currently a supported scheme in Discord
    // [Connect here](steam://connect/${ serverCfg.SERVER_IPV4 }:${ serverCfg.SERVER_PORT } "Connect through direct Steam link")

    // Overview embed
    ctx.embeds.push(serverInfoOverviewEmbed(data, flags, guild));

    // If we have mods, prepare embed for every 50 entries
    if (serverCfg.SERVER_INFO_INCLUDE_MOD_LIST && mods && mods[0]) {
      for (let i = 0; i < mods.length; i += 50) {
        const chunk = mods.slice(i, i + 50);
        ctx.embeds.push({
          title: i === 0 ? `Mod List (${ mods.length })` : null,
          color: colorResolver(data.online ? colors.success : colors.error),
          description: chunk.map(({ name, fileId }) => `${ emojis.separator } [${ name }](https://steamcommunity.com/sharedfiles/filedetails/?id=${ fileId })`).join('\n')
        });
      }
    }

    // Send the information
    interaction.editReply(ctx);
  }
});
