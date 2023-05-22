const cftSDK = require('cftools-sdk');
const emojis = require('../../config/emojis.json');

const APPLICATION_JSON = 'application/json';

// Destructure our environmental variables
const { CFTOOLS_API_SECRET, CFTOOLS_API_APPLICATION_ID } = process.env;

// Getting our servers config
const serverConfig = require('../../config/servers.js');
const { ApplicationCommandOptionType } = require('discord.js');
const { MS_IN_ONE_HOUR, CFTOOLS_API_URL } = require('../constants');
const logger = require('@mirasaki/logger');

// Creating a unique client for every entry
const cftClient = new cftSDK.CFToolsClientBuilder()
  .withCache()
  .withCredentials(CFTOOLS_API_APPLICATION_ID, CFTOOLS_API_SECRET)
  .build();

// CFTools servers- command option
const serverConfigCommandChoicesIdentifier = 'server';
const serverConfigCommandChoices = serverConfig
  .map(({ CFTOOLS_SERVER_API_ID, NAME }) => ({
    name: NAME, value: CFTOOLS_SERVER_API_ID
  }));
const serverConfigCommandOption = {
  name: serverConfigCommandChoicesIdentifier,
  description: 'Which server to display',
  type: ApplicationCommandOptionType.String,
  required: false,
  choices: serverConfigCommandChoices
};
const requiredServerConfigCommandOption = {
  ...serverConfigCommandOption,
  required: true
};
const getServerConfigCommandOptionValue = (interaction) => {
  const { options } = interaction;
  // Resolving server input
  const serverApiId = options.getString('server');
  let serverCfg;
  if (!serverApiId) serverCfg = serverConfig[0];
  else serverCfg = serverConfig.find(
    ({ CFTOOLS_SERVER_API_ID }) => CFTOOLS_SERVER_API_ID === serverApiId
  );
  if (!serverCfg) serverCfg = serverConfig[0];
  return serverCfg;
};

// Player Session Option
const playerSessionChoicesIdentifier = 'player';
const playerSessionOption = {
  name: playerSessionChoicesIdentifier,
  description: 'The in-game player',
  type: ApplicationCommandOptionType.String,
  required: false,
  autocomplete: true
};
const requiredPlayerSessionOption = {
  ...playerSessionOption,
  required: true
};
const getPlayerSessionOptionValue = async (interaction) => {
  const { options } = interaction;
  const serverCfg = getServerConfigCommandOptionValue(interaction);
  const sessionId = options.getString(playerSessionChoicesIdentifier);
  const sessions = await cftClient
    .listGameSessions({ serverApiId: cftSDK.ServerApiId.of(serverCfg.CFTOOLS_SERVER_API_ID) });
  return sessions.find((e) => e.id === sessionId);
};
const survivorSessionOptionValues = async (CFTOOLS_SERVER_API_ID) => {
  const sessions = await cftClient
    .listGameSessions({ serverApiId: cftSDK.ServerApiId.of(CFTOOLS_SERVER_API_ID) });
  if (!sessions) return null;
  return sessions.map((session) => ({
    name: session.playerName, value: session.id
  }));
};


const handleCFToolsError = (interaction, err) => {
  const { member } = interaction;
  if (err instanceof cftSDK.ResourceNotFound) {
    interaction.editReply(`${ emojis.error } ${ member }, couldn't find specified resource - resource might be unknown to client, or it's invalid`);
  }
  else if (err instanceof cftSDK.GrantRequired) {
    interaction.editReply(`${ emojis.error } ${ member }, missing Grant for resource - please navigate to your CFTools developer application and navigate to the **Grant URL** displayed there to grant access to this resource - this command has been cancelled`);
  }
  else {
    interaction.editReply({ content: `${ emojis.error } ${ member }, encountered an error while fetching data: ${ err.message }` });
  }
};

// Fetch API token, valid for 24 hours, don't export function
const fetchAPIToken = async () => {
  // Getting our token
  let token = await fetch(
    `${ CFTOOLS_API_URL }/auth/register`,
    {
      method: 'POST',
      body: JSON.stringify({
        'application_id': CFTOOLS_API_APPLICATION_ID,
        secret: CFTOOLS_API_SECRET
      }),
      headers: { 'Content-Type': APPLICATION_JSON }
    }
  );
  token = (await token.json()).token;
  return token;
};

let CFTOOLS_API_TOKEN;
const tokenExpirationMS = MS_IN_ONE_HOUR * 23;
const getAPIToken = async () => {
  if (!CFTOOLS_API_TOKEN) {
    // eslint-disable-next-line require-atomic-updates
    CFTOOLS_API_TOKEN = await fetchAPIToken();
    // Update our token every 23 hours
    setInterval(async () => {
      CFTOOLS_API_TOKEN = await fetchAPIToken();
    }, tokenExpirationMS);
  }
  return CFTOOLS_API_TOKEN;
};

// Send a message to online survivor
const messageSurvivor = async (CFTOOLS_SERVER_API_ID, targetSessionId, message) => {
  try {
    const data = await fetch(
      `${ CFTOOLS_API_URL }/server/${ CFTOOLS_SERVER_API_ID }/message-private`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${ await getAPIToken() }`,
          'Content-Type': APPLICATION_JSON
        },
        body: JSON.stringify({
          gamesession_id: targetSessionId,
          content: message
        })
      }
    );
    // Boolean return
    return data?.status === 204;
  }
  catch (err) {
    logger.syserr('Error encountered while sending private message to survivor');
    logger.printErr(err);
    return null;
  }
};

// Broadcast to entire server
const broadcastMessage = async (CFTOOLS_SERVER_API_ID, message) => {
  try {
    const data = await fetch(
      `${ CFTOOLS_API_URL }/server/${ CFTOOLS_SERVER_API_ID }/message-server`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${ await getAPIToken() }`,
          'Content-Type': APPLICATION_JSON
        },
        body: JSON.stringify({ content: message })
      }
    );
    // Boolean return
    return data?.status === 204;
  }
  catch (err) {
    logger.syserr('Error encountered while broadcasting to server');
    logger.printErr(err);
    return null;
  }
};

const kickPlayer = async (
  CFTOOLS_SERVER_API_ID,
  sessionId,
  reason = 'n/a'
) => {
  try {
    const data = await fetch(
      `${ CFTOOLS_API_URL }/server/${ CFTOOLS_SERVER_API_ID }/kick`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${ await getAPIToken() }` },
        body: JSON.stringify({
          gamesession_id: sessionId, reason
        })
      }
    );
    return data?.status === 204;
  }
  catch (err) {
    logger.syserr('Error encounter while POSTing kick');
    logger.printErr(err);
    return null;
  }
};

module.exports = {
  CFTOOLS_API_SECRET,
  CFTOOLS_API_APPLICATION_ID,
  serverConfig,
  serverConfigCommandChoicesIdentifier,
  serverConfigCommandChoices,
  serverConfigCommandOption,
  requiredServerConfigCommandOption,
  getServerConfigCommandOptionValue,
  playerSessionChoicesIdentifier,
  playerSessionOption,
  requiredPlayerSessionOption,
  getPlayerSessionOptionValue,
  survivorSessionOptionValues,
  cftClient,
  handleCFToolsError,
  getAPIToken,
  messageSurvivor,
  broadcastMessage,
  kickPlayer
};
