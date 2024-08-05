const cftSDK = require('cftools-sdk');
const emojis = require('../../config/emojis.json');
const { existsSync, readFileSync } = require('fs');

const APPLICATION_JSON = 'application/json';

// Destructure our environmental variables
const { CFTOOLS_API_SECRET, CFTOOLS_API_APPLICATION_ID } = process.env;

// Getting our servers config
const serverConfig = require('../../config/servers.js');
const { ApplicationCommandOptionType } = require('discord.js');
const { MS_IN_ONE_HOUR, CFTOOLS_API_URL } = require('../constants');
const logger = require('@mirasaki/logger');
const { debugLog } = require('../util');

debugLog(`Loaded server config, found ${ serverConfig.length } configurations`);
debugLog('Initialize CFTools API client');

// Creating a unique client for every entry
const cftClient = new cftSDK.CFToolsClientBuilder()
  .withCache()
  .withCredentials(CFTOOLS_API_APPLICATION_ID, CFTOOLS_API_SECRET)
  .build();

// CFTools servers- command option
const serverConfigCommandOptionIdentifier = 'server';
const serverConfigCommandChoices = serverConfig
  .map(({ CFTOOLS_SERVER_API_ID, NAME }) => ({
    name: NAME, value: CFTOOLS_SERVER_API_ID
  }));
const serverConfigCommandOption = {
  name: serverConfigCommandOptionIdentifier,
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

debugLog(`Registered ${ serverConfigCommandChoices.length } command server options:`);
debugLog(serverConfigCommandChoices);

// Player Session Option
const playerSessionOptionIdentifier = 'player';
const playerSessionOption = {
  name: playerSessionOptionIdentifier,
  description: 'The in-game player',
  type: ApplicationCommandOptionType.String,
  required: false,
  autocomplete: true
};
const requiredPlayerSessionOption = {
  ...playerSessionOption,
  required: true
};
const getPlayerSessionOptionValue = async (interaction, id = playerSessionOptionIdentifier) => {
  const { options } = interaction;
  const serverCfg = getServerConfigCommandOptionValue(interaction);
  const sessionId = options.getString(id);
  const sessions = await cftClient
    .listGameSessions({ serverApiId: cftSDK.ServerApiId.of(serverCfg.CFTOOLS_SERVER_API_ID) });
  const targetSession = sessions.find((e) => e.id === sessionId);
  debugLog('Resolved command player option:');
  debugLog(targetSession);
  return targetSession;
};
const survivorSessionOptionValues = async (CFTOOLS_SERVER_API_ID) => {
  const sessions = await cftClient
    .listGameSessions({ serverApiId: cftSDK.ServerApiId.of(CFTOOLS_SERVER_API_ID) });
  if (!sessions) return null;
  return sessions.map((session) => ({
    name: session.playerName, value: session.id
  }));
};


// Teleport Location Option
const teleportLocationOptionIdentifier = 'teleport-location';
const teleportLocationOption = {
  name: teleportLocationOptionIdentifier,
  description: 'The pre-configured location to teleport the player to',
  type: ApplicationCommandOptionType.String,
  required: false,
  autocomplete: true
};
const requiredTeleportLocationOption = {
  ...teleportLocationOption,
  required: true
};
const getTeleportLocationOptionValue = (interaction) => {
  const { options } = interaction;
  const serverCfg = getServerConfigCommandOptionValue(interaction);
  if (!serverCfg.USE_TELEPORT_LOCATIONS) return null;

  // Check file
  const tpLocationsFilePath = `./config/teleport-locations/${ serverCfg.TELEPORT_LOCATIONS_FILE_NAME }.json`;
  const tpLocationsFileExists = existsSync(tpLocationsFilePath);
  if (!tpLocationsFileExists) {
    logger.syserr(`Teleport locations file (${ serverCfg.TELEPORT_LOCATIONS_FILE_NAME }) set in the "TELEPORT_LOCATIONS_FILE_NAME" server configuration doesn't exist`);
    return null;
  }

  // Check is ok
  const teleportLocations = getTeleportLocations(serverCfg);
  if (!teleportLocations || !teleportLocations[0]) return null;

  // Resolve
  const tpIndexStr = options.getString(teleportLocationOptionIdentifier);
  const tpIndex = Number(tpIndexStr);
  if (isNaN(tpIndex)) return null;
  const tpLocation = teleportLocations.at(tpIndex);
  return tpLocation ?? null;
};
const getTeleportLocations = (serverCfg) => {
  // Check file
  const tpLocationsFilePath = `./config/teleport-locations/${ serverCfg.TELEPORT_LOCATIONS_FILE_NAME }.json`;
  const tpLocationsFileExists = existsSync(tpLocationsFilePath);
  if (!tpLocationsFileExists) {
    logger.syserr(`Teleport locations file (${ serverCfg.TELEPORT_LOCATIONS_FILE_NAME }) set in the "TELEPORT_LOCATIONS_FILE_NAME" server configuration doesn't exist`);
    return null;
  }

  // Resolve data
  let teleportLocations = [];
  try {
    const jsonDataStr = readFileSync(tpLocationsFilePath);
    const jsonData = JSON.parse(jsonDataStr);
    if (!Array.isArray(jsonData)) throw Error('Expected file contents to be array');
    teleportLocations = jsonData;
  }
  catch (err) {
    logger.syserr('Error encountered while reading file set in the "TELEPORT_LOCATIONS_FILE_NAME" server configuration:');
    logger.printErr(err);
    return null;
  }

  // Return arr
  return teleportLocations;
};

for (const cfg of serverConfig) {
  if (!cfg.TELEPORT_LOCATIONS_FILE_NAME) {
    debugLog(`Skipping registering teleport locations for ${ cfg.NAME }, "TELEPORT_LOCATIONS_FILE_NAME" is disabled`);
    continue;
  }
  debugLog(`Registered ${ getTeleportLocations(cfg).length } teleport locations for server ${ cfg.NAME }:`);
  debugLog(getTeleportLocations(cfg));
}

const handleCFToolsError = (interaction, err, followUpInstead = false) => {
  debugLog('CFTools API Error encountered:');
  debugLog(err);

  const { member } = interaction;
  let str;
  if (err instanceof cftSDK.ResourceNotFound) {
    str = `${ emojis.error } ${ member }, couldn't find specified resource - resource might be unknown to client, or it's invalid`;
  }
  else if (err instanceof cftSDK.GrantRequired) {
    str = `${ emojis.error } ${ member }, missing Grant for resource - please navigate to your CFTools developer application and navigate to the **Grant URL** displayed there to grant access to this resource - this command has been cancelled`;
  }
  else {
    str = `${ emojis.error } ${ member }, unexpected error encountered: ${ err.message }`;
  }

  if (followUpInstead) interaction.followUp(str);
  else interaction.editReply(str);
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
    debugLog('Creating CFTools API token');
    // eslint-disable-next-line require-atomic-updates
    CFTOOLS_API_TOKEN = await fetchAPIToken();
    // Update our token every 23 hours
    setInterval(async () => {
      debugLog('Creating CFTools API token');
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

const postGameLabsAction = async (
  CFTOOLS_SERVER_API_ID,
  actionCode,
  actionContext,
  referenceKey,
  parameters = {}
) => {
  try {
    const body = {
      actionCode,
      actionContext,
      parameters
    };
    if (referenceKey) body.referenceKey = referenceKey;
    const data = await fetch(
      `${ CFTOOLS_API_URL }/server/${ CFTOOLS_SERVER_API_ID }/GameLabs/action`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${ await getAPIToken() }` },
        body: JSON.stringify(body)
      }
    );
    return data?.status === 204;
  }
  catch (err) {
    logger.syserr('Error encounter while POSTing GameLabs action');
    logger.printErr(err);
    return null;
  }
};

const rconCommand = async (
  CFTOOLS_SERVER_API_ID,
  command
) => {
  try {
    const data = await fetch(
      `${ CFTOOLS_API_URL }/server/${ CFTOOLS_SERVER_API_ID }/raw`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${ await getAPIToken() }` },
        body: JSON.stringify({ command })
      }
    );
    return data?.status === 204;
  }
  catch (err) {
    logger.syserr(`Error encounter while executing RCON command "${ command }"`);
    logger.printErr(err);
    return null;
  }
};

const appGrants = async () => {
  try {
    const data = await fetch(
      `${ CFTOOLS_API_URL }/@app/grants`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${ await getAPIToken() }` }
      }
    );
    return data.json();
  }
  catch (err) {
    logger.syserr('Error encounter while fetching app grants');
    logger.printErr(err);
    return null;
  }
};


// Position data isn't currently included in cftools-sdk =(
// JK, FlorianSW added it =)
// const gsmCache = new Map();
// const getGSMList = async (CFTOOLS_SERVER_API_ID) => {
//   // Cache
//   const cacheData = gsmCache.get(CFTOOLS_SERVER_API_ID);
//   if (cacheData) return cacheData;

//   // Fetch
//   let data;
//   try {
//     data = await fetch(
//       `https://data.cftools.cloud/v1/server/${ CFTOOLS_SERVER_API_ID }/GSM/list`,
//       {
//         method: 'GET',
//         headers: { Authorization: `Bearer ${ await getAPIToken() }` }
//       }
//     );
//     // Error responses error on #json()
//     data = (await data.json());
//     data &&= data.sessions ?? [];

//     // Cache and schedule timeout to clear
//     gsmCache.set(CFTOOLS_SERVER_API_ID, data);
//     setTimeout(() => {
//       gsmCache.delete(CFTOOLS_SERVER_API_ID);
//     }, MS_IN_ONE_SECOND * 15);
//   }
//   catch (err) {
//     logger.syserr('Error encounter while fetching GSM list');
//     logger.printErr(err);
//     return null;
//   }
//   return data;
// };

module.exports = {
  CFTOOLS_API_SECRET,
  CFTOOLS_API_APPLICATION_ID,
  serverConfig,
  serverConfigCommandOptionIdentifier,
  serverConfigCommandChoices,
  serverConfigCommandOption,
  requiredServerConfigCommandOption,
  getServerConfigCommandOptionValue,
  playerSessionOptionIdentifier,
  playerSessionOption,
  requiredPlayerSessionOption,
  getPlayerSessionOptionValue,
  survivorSessionOptionValues,
  teleportLocationOptionIdentifier,
  teleportLocationOption,
  requiredTeleportLocationOption,
  getTeleportLocationOptionValue,
  getTeleportLocations,
  cftClient,
  handleCFToolsError,
  getAPIToken,
  messageSurvivor,
  broadcastMessage,
  kickPlayer,
  postGameLabsAction,
  rconCommand,
  appGrants
};
