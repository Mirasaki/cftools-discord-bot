const { MS_IN_ONE_SECOND } = require('../constants');
const { serverConfig, broadcastMessage } = require('../modules/cftClient');
const { checkIsDelayedKillFeedMsg } = require('../modules/delayed-kill-feed');
const { checkIsWatchListMsg } = require('../modules/watch-list');
const { debugLog } = require('../util');

const chatFeedThrottleCache = new Map();

// eslint-disable-next-line sonarjs/cognitive-complexity
module.exports = async (client, msg) => {
  // Check available
  if (!msg.guild || msg.guild.available === false) return;

  // Ignore bots
  if (msg.author.bot) return;

  // Destructure from msg
  const {
    author, member, channelId, content
  } = msg;

  // Return on empty messages
  // Can happen when client doesn't have Message Content Intent
  // or for messages that don't have textContent but only embeds/files/components,
  // the latter of which is ignored by the #bot check
  if (!content || content.length === 0) return;

  // Run watch list checks
  checkIsWatchListMsg(msg);

  // Run delayed kill feed checks
  checkIsDelayedKillFeedMsg(msg);

  // Member property isn't available, which is required
  // This can happen in partial API outages
  if (!member) return;

  // Find is target chat-feed config
  const targetConfigs = serverConfig.filter((e) => e.CHAT_FEED_CHANNEL_IDS?.includes(channelId));
  if (targetConfigs.length === 0) return; // No target config

  // Loop over config matches
  for await (const {
    NAME,
    CFTOOLS_SERVER_API_ID,
    USE_CHAT_FEED,
    CHAT_FEED_REQUIRED_ROLE_IDS,
    CHAT_FEED_USE_DISCORD_PREFIX,
    CHAT_FEED_USE_DISPLAY_NAME,
    CHAT_FEED_MESSAGE_COOLDOWN,
    CHAT_FEED_MAX_DISPLAY_NAME_LENGTH,
    CHAT_FEED_DISCORD_TAGS
  } of targetConfigs) {
    // Is (temporarily) disabled
    if (USE_CHAT_FEED !== true) {
      debugLog(`[Live Chat Feed - ${ NAME }] Chat feed disabled, returning`);
      continue;
    }

    // Check author has any required roles
    const authorHasRequiredRoles = CHAT_FEED_REQUIRED_ROLE_IDS.length === 0
      ? true
      : CHAT_FEED_REQUIRED_ROLE_IDS.some((e) => member._roles.includes(e));
    if (!authorHasRequiredRoles) {
      debugLog(`[Live Chat Feed - ${ NAME }] Author doesn't have required roles, returning`);
      continue;
    }

    // Throttle usage
    const chatFeedCooldownIdentifier = `${ CFTOOLS_SERVER_API_ID }-${ channelId }-${ member.id }`;
    if (typeof CHAT_FEED_MESSAGE_COOLDOWN === 'number') {
      // Represents timestamp integer when cooldown expires
      const cdEntry = chatFeedThrottleCache.get(chatFeedCooldownIdentifier);
      // Set throttle entry and schedule deletion
      if (!cdEntry) {
        debugLog(`[Live Chat Feed - ${ NAME }] Applying cooldown to "${ chatFeedCooldownIdentifier }"`);
        chatFeedThrottleCache.set(
          chatFeedCooldownIdentifier,
          Date.now() + CHAT_FEED_MESSAGE_COOLDOWN * MS_IN_ONE_SECOND
        );
        setTimeout(() => {
          debugLog(`[Live Chat Feed - ${ NAME }] Removing cooldown for "${ chatFeedCooldownIdentifier }"`);
          chatFeedThrottleCache.delete(chatFeedCooldownIdentifier);
        }, Math.round(CHAT_FEED_MESSAGE_COOLDOWN * MS_IN_ONE_SECOND));
      }
      // Being throttled/is on cooldown
      else if (cdEntry > Date.now()) {
        debugLog(`[Live Chat Feed - ${ NAME }] Is on cooldown for "${ chatFeedCooldownIdentifier }", returning`);
        continue;
      }
    }

    // Resolve message to send to DayZ
    let messageStr = '';

    // Resolve conditional Discord tag/prefix
    // Note: Explicit no space after color declaration
    if (CHAT_FEED_USE_DISCORD_PREFIX) messageStr += '(Discord)';

    // Resolve tag
    let tag = null;
    if (
      CHAT_FEED_DISCORD_TAGS
      && Array.isArray(CHAT_FEED_DISCORD_TAGS)
      && CHAT_FEED_DISCORD_TAGS.length >= 1
    ) {
      const workingTags = CHAT_FEED_DISCORD_TAGS.filter((e) => e.enabled !== false);
      const firstTagMatch = workingTags.find((e) => e.roleIds.some((roleId) => member._roles.includes(roleId)));
      if (firstTagMatch) tag = firstTagMatch;
    }

    // Resolve tag strings if tag is active
    if (tag) {
      // Resolve color function
      if (tag.color) {
        const colorPrefix = '|>C'; // Used by CFTools as indicator for prefix
        const cleanedColor = tag.color.replaceAll('#', '');
        messageStr = `${ colorPrefix }${ cleanedColor }${ messageStr }`;
      }
      // Append tag display string
      messageStr += `${ messageStr.length === 0 ? '' : ' ' }${ tag.displayTag }`;
    }

    // Resolve display name
    let activeDisplayName = CHAT_FEED_USE_DISPLAY_NAME ? member.displayName : author.username;
    if (
      Number.isInteger(CHAT_FEED_MAX_DISPLAY_NAME_LENGTH)
      && activeDisplayName.length > CHAT_FEED_MAX_DISPLAY_NAME_LENGTH
    ) activeDisplayName = activeDisplayName.slice(
      0,
      CHAT_FEED_MAX_DISPLAY_NAME_LENGTH
    ) + '...';
    messageStr += `${ messageStr.length === 0 ? '' : ' ' }${ activeDisplayName }`;

    // Append the actual message content, finally O;
    messageStr += `: ${ content }`;
    // Make sure we don't exceed max message length
    if (messageStr.length > 256) messageStr = messageStr.slice(0, 253) + '...';

    // Sending message to server
    const res = await broadcastMessage(CFTOOLS_SERVER_API_ID, messageStr);
    if (res !== true) debugLog(`[Live Chat Feed - ${ NAME }] Invalid response code - message might not have broadcasted: "${ messageStr }"`);
    else debugLog(`[Live Chat Feed - ${ NAME }] Message delivered and displayed to everyone online: "${ messageStr }"`);
  }
};
