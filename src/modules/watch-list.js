const { serverConfig } = require('./cftClient');
const { getGuildSettings } = require('./db');
const { isValidWebhookConfigMessage } = require('./webhooks');

const checkIsWatchListMsg = async (msg) => {
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

module.exports = { checkIsWatchListMsg };
