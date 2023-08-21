const { ChatInputCommand } = require('../../classes/Commands');
const { colorResolver } = require('../../util');
const {
  ApplicationCommandOptionType, EmbedBuilder, AttachmentBuilder
} = require('discord.js');
const { getGuildSettings, db } = require('../../modules/db');
const { EMBED_DESCRIPTION_MAX_LENGTH } = require('../../constants');

module.exports = new ChatInputCommand({
  permLevel: 'Administrator',
  global: true,
  data: {
    description: 'Manage your global watch list',
    options: [
      {
        name: 'view',
        description: 'Display the current configuration',
        type: ApplicationCommandOptionType.Subcommand
      },
      {
        name: 'add',
        description: 'Add an entry to the watch-list',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'id',
            description: 'The CFTools ID to add to the watch-list',
            type: ApplicationCommandOptionType.String,
            min_length: 7,
            required: true
          }
        ]
      },
      {
        name: 'remove',
        description: 'Remove an entry from the watch-list',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'id',
            description: 'The CFTools ID to remote from the watch-list',
            type: ApplicationCommandOptionType.String,
            min_length: 7,
            required: true
          }
        ]
      },
      {
        name: 'reset',
        description: 'Reset the watch-list',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'confirmation',
            description: 'Confirm you want to execute this action',
            type: ApplicationCommandOptionType.Boolean,
            required: false
          }
        ]
      }
    ]
  },


  run: async (client, interaction) => {
    // Destructuring
    const {
      guild, member, options
    } = interaction;
    const { emojis } = client.container;
    const subcommand = options.getSubcommand();

    // Deferring our reply
    await interaction.deferReply({ ephemeral: true });

    // Check if a proper server option is provided
    const guilds = db.getCollection('guilds');
    const settings = getGuildSettings(guild.id);
    let { watchList } = settings;

    // Make sure we have a watch-list
    if (!watchList) {
      const newWatchList = { watchIds: [] };
      settings.watchList = newWatchList;
      watchList = newWatchList;
      guilds.update(settings);
    }

    switch (subcommand) {
      case 'add': {
        const playerId = options.getString('id');
        if (watchList.watchIds.includes(playerId)) {
          interaction.editReply(`${ emojis.error } ${ member }, that id is already present in this watch-list - this command has been cancelled`);
          return;
        }

        watchList.watchIds.push(playerId);
        guilds.update(settings);

        interaction.editReply(`${ emojis.success } ${ member }, \`${ playerId }\` has been added to the watch-list`);
        break;
      }
      case 'remove': {
        const playerId = options.getString('id');
        if (!watchList.watchIds.includes(playerId)) {
          interaction.editReply(`${ emojis.error } ${ member }, that id is not present in this watch-list - this command has been cancelled`);
          return;
        }

        watchList.watchIds = watchList.watchIds.filter((e) => e !== playerId);
        guilds.update(settings);

        interaction.editReply(`${ emojis.success } ${ member }, \`${ playerId }\` has been removed from the watch-list`);
        break;
      }
      case 'reset': {
        const confirmation = options.getBoolean('confirmation');
        if (!confirmation !== true) {
          interaction.editReply(`${ emojis.error } ${ member }, you didn't select \`True\` on the confirmation prompt - this command has been cancelled`);
          return;
        }

        watchList.watchIds = [];
        guilds.update(settings);

        interaction.editReply(`${ emojis.success } ${ member },  }\` watch-list has been reset`);
        break;
      }
      case 'view':
      default: {
        // Resolve output
        const outputStr = watchList.watchIds[0]
          ? watchList.watchIds.map((e) => `\`${ e }\``).join(', ')
          : 'No watch ids configured yet';
        const files = [];
        if (outputStr.length >= EMBED_DESCRIPTION_MAX_LENGTH) {
          files.push(new AttachmentBuilder(Buffer.from(outputStr)).setName('watch-list-configuration.txt'));
        }

        // Feedback
        interaction.editReply({
          embeds: [
            new EmbedBuilder({ color: colorResolver() })
              .setAuthor({
                name: 'Watch-list configuration',
                iconURL: guild.iconURL()
              })
              .setDescription(
                outputStr.length >= EMBED_DESCRIPTION_MAX_LENGTH
                  ? 'Output too long, attached as file'
                  : outputStr
              )
          ],
          files
        });
      }
    }
  }
});
