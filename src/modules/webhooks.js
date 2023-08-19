const { stripIndents } = require('common-tags');
const { ChannelType } = require('discord.js');

const isValidWebhookConfigMessage = (
  msg,
  targetChannelId
) => {
  // Destructure from message
  const { id: msgId,
    guild } = msg;

  // Return if target can't be resolved
  const targetChannel = guild.channels.cache.get(targetChannelId);
  if (!targetChannel) {
    console.error(stripIndents`
      [${ msgId }] Can't send watch-list message, targetChannelId channel from config can't be resolved: ${ targetChannelId }
    `);
    return false;
  }

  // Return if target is not text based
  else if (!targetChannel.isTextBased()) {
    console.error(stripIndents`
      [${ msgId }] Can't send watch-list message, targetChannelId channel is NOT a text based channel
    `);
    return false;
  }

  // Don't allow stage channels - which have linked text chat
  else if (targetChannel.type === ChannelType.GuildStageVoice) {
    console.error(stripIndents`
      [${ msgId }] Can't send watch-list message, targetChannelId channel is NOT a valid text based channel
    `);
    return false;
  }

  // Configuration is valid
  else return targetChannel;
};

module.exports = { isValidWebhookConfigMessage };
