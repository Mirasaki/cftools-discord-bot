const { ChatInputCommand } = require('../../classes/Commands');
const { colorResolver } = require('../../util');
const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { MS_IN_ONE_DAY } = require('../../constants');
const {
  requiredServerConfigCommandOption, getServerConfigCommandOptionValue, cftClient
} = require('../../modules/cftClient');
const { ServerApiId } = require('cftools-sdk');
const { stripIndents } = require('common-tags');

const steam64Regex = /^7656119[0-9]{10}$/;
const steam64Option = {
  name: 'steam64',
  description: 'The Steam64 ID of the player to view',
  type: ApplicationCommandOptionType.String,
  required: true
};

const durationOption = {
  name: 'duration',
  description: 'The duration of the priority queue, in days (-1 = permanent)',
  type: ApplicationCommandOptionType.Integer,
  required: true,
  min_value: -1,
  max_value: 365
};

module.exports = new ChatInputCommand({
  permLevel: 'Administrator',
  global: true,
  data: {
    description: 'Manage your priority queue',
    options: [
      {
        name: 'view',
        description: 'Display the current configuration',
        type: ApplicationCommandOptionType.Subcommand,
        options: [ requiredServerConfigCommandOption, steam64Option ]
      },
      {
        name: 'add',
        description: 'Add an entry to the priority queue',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          requiredServerConfigCommandOption,
          steam64Option,
          durationOption
        ]
      },
      {
        name: 'remove',
        description: 'Remove an entry from the priority queue',
        type: ApplicationCommandOptionType.Subcommand,
        options: [ requiredServerConfigCommandOption, steam64Option ]
      }
    ]
  },
  // eslint-disable-next-line sonarjs/cognitive-complexity
  run: async (client, interaction) => {
    // Destructuring
    const { guild, options } = interaction;
    const { emojis } = client.container;
    const subcommand = options.getSubcommand();

    // Check if a proper server option is provided
    const serverCfg = getServerConfigCommandOptionValue(interaction);

    // Deferring our reply
    await interaction.deferReply({ ephemeral: true });

    const entryEmbed = ({ steam64, entry }) => new EmbedBuilder()
      .setColor(colorResolver())
      .setAuthor(`${ guild.name }`, guild.iconURL({ forceStatic: false }))
      .setTitle('Priority Queue')
      .setDescription(stripIndents`
        **Steam64:** \`${ steam64 }\`
        **Duration:** ${ entry.expiration === 'Permanent' ? 'Permanent' : `${ Math.round((entry.expiration - Date.now()) / MS_IN_ONE_DAY) } days` }
        **Added by:** ${ entry.addedBy }
        **Added at:** ${ entry.addedAt }
        ${ entry.expiration }
      `)
      .setTimestamp();

    switch (subcommand) {
      case 'add': {
        const steam64 = options.getString('steam64');
        const duration = options.getInteger('duration');

        if (!steam64Regex.test(steam64)) {
          interaction.editReply({ content: `${ emojis.error } \`${ steam64 }\` is not a valid Steam64 ID` });
          return;
        }

        let cftoolsId = steam64;
        try {
          cftoolsId = await cftClient.resolve({ id: steam64 });
        }
        catch (err) {
          interaction.editReply({ content: `${ emojis.error } Failed to resolve \`${ steam64 }\`` });
          return;
        }

        await cftClient.putPriorityQueue({
          serverApiId: ServerApiId.of(serverCfg.CFTOOLS_SERVER_API_ID),
          id: { id: cftoolsId },
          expires: duration === -1 ? 'Permanent' : new Date(Date.now() + duration * MS_IN_ONE_DAY)
        }).catch(() => null);

        const entry = await cftClient.getPriorityQueue({
          serverApiId: ServerApiId.of(serverCfg.CFTOOLS_SERVER_API_ID),
          playerId: { id: cftoolsId }
        }).catch(() => null);

        if (!entry) {
          interaction.editReply({ content: `${ emojis.error } Failed to add \`${ steam64 }\` to the priority queue` });
          return;
        }

        return interaction.editReply({ embeds: [ entryEmbed(entry) ] });
      }

      case 'remove': {
        const steam64 = options.getString('steam64');

        if (!steam64Regex.test(steam64)) {
          interaction.editReply({ content: `${ emojis.error } \`${ steam64 }\` is not a valid Steam64 ID` });
          return;
        }

        let cftoolsId = steam64;
        try {
          cftoolsId = await cftClient.resolve({ id: steam64 });
        }
        catch (err) {
          interaction.editReply({ content: `${ emojis.error } Failed to resolve \`${ steam64 }\`` });
          return;
        }

        const entry = await cftClient.deletePriorityQueue({
          serverApiId: ServerApiId.of(serverCfg.CFTOOLS_SERVER_API_ID),
          id: cftoolsId
        }).catch(() => null);

        if (!entry) {
          interaction.editReply({ content: `${ emojis.error } Failed to remove \`${ steam64 }\` from the priority queue` });
          return;
        }

        return interaction.editReply({ embeds: [ entryEmbed(entry) ] });
      }

      case 'view':
      default: {
        const steam64 = options.getString('steam64');

        let cftoolsId = steam64;
        try {
          cftoolsId = await cftClient.resolve({ id: steam64 });
        }
        catch (err) {
          interaction.editReply({ content: `${ emojis.error } Failed to resolve \`${ steam64 }\`` });
          return;
        }

        const entry = await cftClient.getPriorityQueue({
          serverApiId: ServerApiId.of(serverCfg.CFTOOLS_SERVER_API_ID),
          playerId: { id: cftoolsId }
        }).catch(() => null);

        if (!entry) {
          interaction.editReply({ content: `${ emojis.error } No priority queue entry found for \`${ steam64 }\`` });
          return;
        }

        return interaction.editReply({ embeds: [ entryEmbed(entry) ] });
      }
    }
  }
});
