const { ChatInputCommand } = require('../../classes/Commands');
const { colorResolver } = require('../../util');
const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { MS_IN_ONE_DAY } = require('../../constants');
const {
  requiredServerConfigCommandOption, getServerConfigCommandOptionValue, cftClient
} = require('../../modules/cftClient');
const { ServerApiId } = require('cftools-sdk');
const { stripIndents } = require('common-tags');

// Timed: 76561199003950745
// Permanent: 76561197960604125

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

const commentOption = {
  name: 'comment',
  description: 'A comment to add to the priority queue entry',
  type: ApplicationCommandOptionType.String,
  required: false,
  min_length: 1,
  max_length: 100
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
        options: [
          requiredServerConfigCommandOption,
          steam64Option,
          {
            name: 'public',
            description: 'Whether to display the priority queue embed publicly',
            type: ApplicationCommandOptionType.Boolean,
            required: false
          }
        ]
      },
      {
        name: 'add',
        description: 'Add an entry to the priority queue',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          requiredServerConfigCommandOption,
          steam64Option,
          durationOption,
          commentOption
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
    const showPublic = options.getBoolean('public') ?? false;

    // Check if a proper server option is provided
    const serverCfg = getServerConfigCommandOptionValue(interaction);

    // Deferring our reply
    await interaction.deferReply({ ephemeral: !showPublic });

    const entryEmbed = ({
      steam64, cftoolsId, entry
    }) => new EmbedBuilder()
      .setColor(colorResolver())
      .setAuthor({
        name: `${ guild.name }`,
        iconURL: guild.iconURL({ forceStatic: false })
      })
      .setTitle('Priority Queue')
      .setDescription(stripIndents`
        **Steam64:** \`${ steam64 }\`
        **CFTools:** [${ cftoolsId.id }](<https://app.cftools.cloud/profile/${ cftoolsId.id }>)
        **Duration:** ${ entry.expiration === 'Permanent' ? 'Permanent' : `${ Math.round((entry.expiration - Date.now()) / MS_IN_ONE_DAY) } days` }
        **Comment:** ${ entry.comment ?? 'None' }
        **Created by:** [${ entry.createdBy.id }](<https://app.cftools.cloud/profile/${ entry.createdBy.id }>)
        **Created:** <t:${ Math.round(entry.created.valueOf() / 1000) }:R>
      `)
      .setTimestamp();

    switch (subcommand) {
      case 'add': {
        const steam64 = options.getString('steam64');
        const duration = options.getInteger('duration');
        const comment = options.getString('comment') ?? null;

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

        const add = await cftClient.putPriorityQueue({
          serverApiId: ServerApiId.of(serverCfg.CFTOOLS_SERVER_API_ID),
          id: cftoolsId,
          expires: duration === -1 ? 'Permanent' : new Date(Date.now() + duration * MS_IN_ONE_DAY),
          comment
        })
          .catch((err) => {
            interaction.editReply({ content: `${ emojis.error } Error encountered while adding priority queue entry for \`${ steam64 }\`: ${ err.message }` });
            return null;
          })
          .then(() => true);

        if (add === null) return;

        return interaction.editReply({ content: `${ emojis.success } Added \`${ steam64 }\` to the priority queue` });
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

        const entry = await cftClient.getPriorityQueue({
          serverApiId: ServerApiId.of(serverCfg.CFTOOLS_SERVER_API_ID),
          playerId: cftoolsId
        }).catch((err) => {
          interaction.editReply({ content: `${ emojis.error } Error encountered while fetching priority queue entry for \`${ steam64 }\`: ${ err.message }` });
          return undefined;
        });

        if (!entry) {
          if (entry === null) {
            interaction.editReply({ content: `${ emojis.error } \`${ steam64 }\` doesn't currently have priority queue` });
            return;
          }
          else return;
        }

        await interaction.editReply({ content: `${ emojis.success } Removing \`${ steam64 }\` from the priority queue` });

        let valid;
        await cftClient.deletePriorityQueue({
          serverApiId: ServerApiId.of(serverCfg.CFTOOLS_SERVER_API_ID),
          playerId: cftoolsId
        }).catch((err) => {
          valid = false;
          interaction.editReply({ content: `${ emojis.error } Error encountered while removing priority queue entry for \`${ steam64 }\`: ${ err.message }` });
        });

        if (!valid) return;

        return interaction.editReply({ embeds: [
          entryEmbed({
            steam64,
            cftoolsId,
            entry
          })
        ] });
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
          playerId: cftoolsId
        }).catch((err) => {
          interaction.editReply({ content: `${ emojis.error } Error encountered while fetching priority queue entry for \`${ steam64 }\`: ${ err.message }` });
          return undefined;
        });

        if (!entry) {
          if (entry === null) {
            interaction.editReply({ content: `${ emojis.error } \`${ steam64 }\` doesn't currently have priority queue` });
            return;
          }
          else return;
        }

        return interaction.editReply({ embeds: [
          entryEmbed({
            steam64,
            cftoolsId,
            entry
          })
        ] });
      }
    }
  }
});
