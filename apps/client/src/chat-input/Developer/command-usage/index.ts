import { SlashCommandBuilder } from 'discord.js';
import { CommandUsageConstants } from './enums';
import { deleteItemSubcommand, itemSubcommand, leaderboardSubcommand } from './options';
import { compactEmbedFromUsageStatistics, embedFromUsageStatistics, stringCommandTypeFromInteger } from './helpers';
import CommandStatisticOption from '@/auto-completes/command-statistic';
import { ArrayUtils, ChatInputCommand, InteractionUtils, PermLevel, isAutoCompleteResponseType } from '@rhidium/core';
import { COMMAND_STATISTICS_ROOT_ID, commandStatisticsTTLCache, prisma } from '@repo/database';

export const compactEntriesPerPage = 10;

const CommandUsageCommand = new ChatInputCommand({
  permLevel: PermLevel['Bot Administrator'],
  data: new SlashCommandBuilder()
    .setDescription('View detailed command usage information')
    .addSubcommand(leaderboardSubcommand)
    .addSubcommand(itemSubcommand)
    .addSubcommand(deleteItemSubcommand),
  run: async (client, interaction) => {
    const { options } = interaction;
    const compact = options.getBoolean('compact') ?? false;

    const subcommand = options.getSubcommand();
    if (subcommand === CommandUsageConstants.LEADERBOARD_SUBCOMMAND_NAME) {
      const allStats = await commandStatisticsTTLCache.getWithFetch(COMMAND_STATISTICS_ROOT_ID);
      if (!allStats || !allStats[0]) {
        CommandUsageCommand.reply(interaction, 'No command usage statistics were found');
        return;
      }

      const stats = allStats.sort((a, b) => b.usages.length - a.usages.length);
      const allEmbeds = compact
        ? ArrayUtils.chunk(stats, compactEntriesPerPage)
          .map((stat, ind) => compactEmbedFromUsageStatistics(client, stat, ind * compactEntriesPerPage))
        : stats.map((stat) => embedFromUsageStatistics(client, stat));

      InteractionUtils.paginator(
        'command-usage-leaderboard',
        client,
        allEmbeds.map((e) => ({ embeds: Array.isArray(e) ? e : [e] })),
        interaction,
      );
    }

    else if (subcommand === CommandUsageConstants.ITEM_SUBCOMMAND_NAME) {
      const value = await CommandStatisticOption.getValue(interaction, true);
      if (isAutoCompleteResponseType(value)) return;
      const embed = embedFromUsageStatistics(client, value);
      CommandUsageCommand.reply(interaction, embed);
    }

    else if (subcommand === CommandUsageConstants.DELETE_ITEM_SUBCOMMAND_NAME) {
      const value = await CommandStatisticOption.getValue(interaction, true);
      if (isAutoCompleteResponseType(value)) return;
      await prisma.commandStatistics.delete({ where: { id: value.id } });
      commandStatisticsTTLCache.delete(COMMAND_STATISTICS_ROOT_ID);
      CommandUsageCommand.reply(
        interaction,
        `Successfully deleted usage statistics for \`${value.commandId}\` (${stringCommandTypeFromInteger(value.type)})`
      );
    }
  },
});

export default CommandUsageCommand;
