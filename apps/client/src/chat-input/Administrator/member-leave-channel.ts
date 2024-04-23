import { guildSettingsFromCache, updateGuildSettings } from '@repo/database';
import { LoggingServices } from '@/services';
import { ChannelType, SlashCommandBuilder } from 'discord.js';
import { ChatInputCommand, InteractionUtils, PermLevel } from '@rhidium/core';
import Lang from '@/i18n/i18n';

const MemberLeaveChannelCommand = new ChatInputCommand({
  permLevel: PermLevel.Administrator,
  isEphemeral: true,
  guildOnly: true,
  data: new SlashCommandBuilder()
    .setDescription('Set the channel to send member leave messages to')
    .addChannelOption((option) => option
      .setName('channel')
      .setDescription('The channel to send member leave messages to')
      .setRequired(false)
      .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement),
    )
    .addBooleanOption((option) => option
      .setName('disable')
      .setDescription('Disable member leave messages')
      .setRequired(false),
    ),
  run: async (client, interaction) => {
    const { options } = interaction;
    const channel = options.getChannel('channel');
    const disable = options.getBoolean('disable') ?? false;

    const guildAvailable = InteractionUtils.requireAvailableGuild(client, interaction);
    if (!guildAvailable) return;

    await MemberLeaveChannelCommand.deferReplyInternal(interaction);

    const guildSettings = await guildSettingsFromCache(interaction.guildId);
    if (!guildSettings) {
      MemberLeaveChannelCommand.reply(
        interaction,
        client.embeds.error(Lang.t('general:settings.notFound')),
      );
      return;
    }

    if (disable) {
      guildSettings.memberLeaveChannelId = null;
      await updateGuildSettings(guildSettings, {
        data: { memberLeaveChannelId: null },
      });
      MemberLeaveChannelCommand.reply(
        interaction,
        client.embeds.success(Lang.t('commands:member-leave-channel.disabled')),
      );
      LoggingServices.adminLog(
        interaction.guild,
        client.embeds.info({
          title: Lang.t('commands:member-leave-channel.disabledTitle'),
          description: Lang.t('commands:member-leave-channel.disabledBy', {
            username: interaction.user.username,
          }),
        }),
      );
      return;
    }

    if (!channel) {
      MemberLeaveChannelCommand.reply(
        interaction,
        client.embeds.branding({
          fields: [{
            name: Lang.t('commands:member-leave-channel.title'),
            value: guildSettings.memberLeaveChannelId
              ? `<#${guildSettings.memberLeaveChannelId}>`
              : Lang.t('general:notSet'),
          }],
        })
      );
      return;
    }

    guildSettings.memberLeaveChannelId = channel.id;
    await updateGuildSettings(guildSettings, {
      data: { memberLeaveChannelId: channel.id },
    });
    MemberLeaveChannelCommand.reply(
      interaction,
      client.embeds.success(Lang.t('commands:member-leave-channel.changed', {
        channel: channel.toString(),
      })),
    );
    LoggingServices.adminLog(
      interaction.guild,
      client.embeds.info({
        title: Lang.t('commands:member-leave-channel.changedTitle'),
        fields: [{
          name: Lang.t('general:channel'),
          value: `<#${channel.id}>`,
          inline: true,
        }, {
          name: Lang.t('general:member'),
          value: interaction.user.toString(),
          inline: true,
        }],
      }),
    );
    return;
  },
});

export default MemberLeaveChannelCommand;
