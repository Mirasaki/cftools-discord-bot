const { PermissionsBitField } = require('discord.js');

const config = {
  // Bot activity
  presence: {
    // One of online, idle, invisible, dnd
    status: 'online',
    activities: [
      {
        name: '/help',
        // One of Playing, Streaming, Listening, Watching
        type: 'Listening'
      }
    ]
  },

  // Permission config
  permissions: {
    // Bot Owner, highest permission level (5)
    ownerId: '290182686365188096',

    // Bot developers, second to highest permission level (4)
    developers: [ '625286565375246366' ]
  },

  // Additional permissions that are considered required when generating
  // the bot invite link with /invite
  permissionsBase: [
    PermissionsBitField.Flags.ViewChannel,
    PermissionsBitField.Flags.SendMessages,
    PermissionsBitField.Flags.SendMessagesInThreads
  ],

  // The Discord server invite to your Support server
  supportServerInviteLink: 'https://discord.mirasaki.dev'
};

module.exports = config;
