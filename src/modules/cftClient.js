const cftSDK = require('cftools-sdk');
const emojis = require('../../config/emojis.json');

// Destructure our environmental variables
const { CFTOOLS_API_SECRET, CFTOOLS_API_APPLICATION_ID } = process.env;

// Getting our servers config
const serverConfig = require('../../config/servers.js');
const { ApplicationCommandOptionType } = require('discord.js');

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

module.exports = {
  CFTOOLS_API_SECRET,
  CFTOOLS_API_APPLICATION_ID,
  serverConfig,
  serverConfigCommandChoicesIdentifier,
  serverConfigCommandChoices,
  serverConfigCommandOption,
  requiredServerConfigCommandOption,
  getServerConfigCommandOptionValue,
  cftClient,
  handleCFToolsError
};
