const { ChannelType } = require('discord.js');
const { serverConfig } = require('./cftClient');
const { stripIndents } = require('common-tags');
const { getGuildSettings } = require('./db');

/**
 * @param {Message} msg
 * @param {Client} client
 */
const checkIsWatchListMsg = async (msg, client) => {
  const {
    guild,
    channelId,
    webhookId,
    author,
    cleanContent
  } = msg;
  const isJoined = cleanContent.indexOf(' joined from ') >= 0;
  if (!isJoined) return false;

  const settings = getGuildSettings(guild.id);
  const { watchList } = settings;

  for await (const cfg of serverConfig) {
    const {
      WATCH_LIST_CHANNEL_ID,
      WATCH_LIST_NOTIFICATION_ROLE_ID,
      CFTOOLS_WEBHOOK_CHANNEL_ID,
      CFTOOLS_WEBHOOK_USER_ID
    } = cfg;
    const isTargetChannel = channelId === CFTOOLS_WEBHOOK_CHANNEL_ID;
    const isTargetUser = CFTOOLS_WEBHOOK_USER_ID === (
      process.env.NODE_ENV === 'production'
        ? webhookId
        : author.id
    );

    // Validate target ids/is webhook message
    if (!isTargetChannel || !isTargetUser) continue;

    // Resolve target channel
    const webhookTargetChannel = isValidWebhookConfigMessage(msg, WATCH_LIST_CHANNEL_ID);
    if (!webhookTargetChannel) continue;

    // Resolve watch-list
    const activePlayerEntry = watchList.watchIds.find((e) => cleanContent.indexOf(e) >= 0);
    if (!activePlayerEntry) continue;

    // Send the notification
    const text = `<@&${ WATCH_LIST_NOTIFICATION_ROLE_ID }> - A player that's on the watch-list just logged in! (**\`${ activePlayerEntry }\`**)`;
    await webhookTargetChannel.send(text);
  }
};

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

module.exports = {
  checkIsWatchListMsg, isValidWebhookConfigMessage
};
