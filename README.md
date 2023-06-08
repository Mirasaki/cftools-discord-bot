<p align="center"><img src="assets/logo.png" alt="CFTools Bot Logo" height="60" style="border-radius:50px"/></p>
<h1 align="center">CFTools Discord Bot</h1>
<p align="center">A Discord bot that fully utilizes the CFTools Data API.</p>

<div align='center'>

  [![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
  ![build](https://img.shields.io/github/actions/workflow/status/mirasaki/cftools-discord-bot/test.yml)
  [![CodeFactor](https://www.codefactor.io/repository/github/Mirasaki/cftools-discord-bot/badge)](https://www.codefactor.io/repository/github/Mirasaki/cftools-discord-bot)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  ![Docker Pulls](https://img.shields.io/docker/pulls/mirasaki/cftools-discord-bot)
  ![version](https://img.shields.io/github/v/release/Mirasaki/cftools-discord-bot)
  <!-- ![size](https://img.shields.io/docker/image-size/mirasaki/cftools-discord-bot) -->

</div>

<p align="center"><a href="/assets/showcase/thumbnail.gif"><img src="assets/showcase/thumbnail.gif" width="75%" style="border-radius:25px;box-shadow:black 2px 2px 25px;width: min(500px, 100%)"/></a>

<!-- <a><img src="http://randojs.com/images/dropShadow.png" width="100%"/></a></p> -->
<br/>

## ⭐ It's free, open-source, and self-host - meaning you're in full control

This project was created and open-sourced by [Mirasaki Development](https://mirasaki.dev). That means it's publicly available for anyone to grab and do whatever with (MIT licensed). This project will never be monetized, every feature will always be free (keep in mind CFTools has premium endpoints). All I need to keep adding new functionality and modules is some GitHub stars. Join the absolute **legends** below by clicking that Star button in the top-right of your screen, it doesn't cost you anything **and** means the world to us ❤️
<br/>

[![Stargazers repo roster for @Mirasaki/cftools-discord-bot](https://reporoster.com/stars/Mirasaki/cftools-discord-bot)](https://github.com/Mirasaki/cftools-discord-bot/stargazers)
<br/>
<br/>

## 📜 Table of Contents

- [Showcase](#showcase)
- [Features](#features)
- [Planned Features](#planned-features)
- [Hosting](#hosting)
- [Discord Permissions](#discord-permissions)
- [Client Permissions](#client-permissions)
- [Server Configuration](#server-configuration)
- [Installation & Usage](#installation-and-usage)
  - [Prerequisites](#prerequisites)
  - [Docker](#run-as-a-docker-container-preferred)
  - [Node](#run-as-a-plain-nodejs-app)

---

<br/>
<h2 id="showcase">🎥 Showcase</h2>

<details>
<summary>Click to view</summary>

![dm-survivor](./assets/showcase/dm-survivor.gif)
![stats-normal](./assets/showcase/stats_normal.png)
![admin-player-list](./assets/showcase/admin-player-list.png)
![kick](./assets/showcase/kick.gif)
![flagged-player-list](./assets/showcase/flagged-player-list.png)
![server-info](./assets/showcase/server-info.png)

</details>

<br/>
<h2 id="features">🤩 Features</h2>

- Discord > DayZ live chat feed - comes with a tag system and is **very** customizable
- Player Lists

  - Public list
  - Admin list with CFTools + Steam links
  - Flagged list for potential troublesome accounts/players

- User-friendly in-game player auto complete
- Broadcast messages to everyone on server
- Direct Message (private) online players
- Heal players
- Kick players
- Spawn items on players
- Teleport players
  - Comes with support for custom (autocomplete enabled) teleport locations (`/teleport-location`), instead of having to provide coordinates (still supported in `/teleport` command)
  - Teleport multiple or all to online player
  - Teleport multiple or all to customizable locations
  - Currently looking for people to contribute, we'd like a strong default configuration for users to utilize. Check out [the config file example](./config/teleport-locations/chernarus.json) and determine if you'd like to contribute, create a pull request or contact me on Discord: Mirasaki#2287
- Complete leaderboard integration with all available stats
- Display detailed player/individual statistics, supports Steam64, BattlEye GUID, and Bohemia Interactive Id
- Player hit zone % heat maps
- Server info overview
- And best of all, everything is configurable!

<br />
<h2 id="planned-features">💡 Planned Features</h2>

- Execute raw RCon commands - I'm looking for someone that is very knowledgeable on available RCon command
- Dedicated Server Status channel, overview with online/offline status
- Manage Priority Queue
- Manage Ban lists
- Manage Whitelists
- Custom GameLab action support

<br/>
<h2 id="hosting">🖥️ Hosting</h2>

We have partnered with [VYKIX.com](https://portal.vykix.com/aff.php?aff=17) after observing many of our clients using VYKIX services and products. Check them out for affordable and reliable hosting, they bring the **best DayZ hosting experience possible.** 📈

<br/>
<h2 id="discord-permissions">🟣 Discord Permissions</h2>

> This is not the permission level required to execute actions or run commands, like User, Moderator or Administrator

Invite the bot to your server by navigating to the following URL (replace `YOUR_CLIENT_ID` with `CLIENT_ID` from the `/config/.env` file):

`https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=0&scope=bot%20applications.commands`

Any command can be used without any Discord permissions, as long as the bot is invited to your server with the `bot` and `applications.commands` scopes. You can use the template url above, or alternatively, generate an invite link in the [Discord Developer Portal](https://discord.com/developers/applications) (Your App > OAuth2 > URL Generator > `scopes: bot + applications.commands`)

`AUTOMATIC_LEADERBOARD_MODULE`: This requires the following permissions in any channel this module is assigned to: `View Channel`, `Read Message History`, `Send Messages`, and `Embed Links`

`DISCORD_TO_DAYZ_LIVE_CHAT_RELAY`: This module requires the privileged Discord "Message Content Intent" (Your App > Bot > Enable `Message Content Intent`). This module also required the following permissions in the channel where Discord messages are relayed from: `View Channel` and `Read Message History`

<br/>
<h2 id="client-permissions">🟢 Client Permissions</h2>

These are permission levels that are used internally by the bot to determine the permission level of any given user and determine which commands they can use. Available permissions levels are:

> *You can modify Moderators, Administrators, Developers and Bot Owners in `/config/config.js`, this is optional*

- 0 - User - This is the default permission levels, everyone has this this - doesn't have access to any dangerous commands
- 1 - Moderator - The moderator permission level has access to moderation commands like `/heal`, `/kick`, and `/ban` in the future. Anyone that has the Discord permissions `Kick Members` and `Ban Members`, or has a role that is defined in the `config#permissions#moderatorRoleIds` is considered a Moderator
- 2 - Administrator - The Administrator permission level is the highest permission level that can be assigned through Discord. Anyone with the Discord permission `Administrator`, or has a role that is defined in the `config#permissions#administratorRoleIds` is considered an Administrator internally and will have access to dangerous/sensitive commands like `/broadcast`, `/dm-survivor`, and `/spawn-item`
- 3 - Server Owner - This is the permission level of your Discord server owner, only 1 person can have this at any given time. Used to make sure server owners have a snowflake permission level internally 🙏 Doesn't currently have any exclusive commands, but you can choose to restrict commands to this permission level as needed
- 4 - Developer - This is for members that develop on the bot, has access to dev utilities like `/eval` and `/exec`. This permission level can do almost everything, including evaluating arbitrary code on your host machine - use with caution!
- 5 - Bot Owner - Bypasses every permission bit and level check, has access to every command and command.

You can modify required permission levels to execute commands in the command files by setting the permLevel property. Let's take a look at an example `/src/commands/` file:

```javascript
module.exports = new ChatInputCommand({
  // Inside of the ChatInputCommand({
  // Can be set to User, Moderator, Administrator, Server Owner, Developer, Bot Owner
  // Support IntelliSense/auto-complete
  permLevel: 'Administrator',
  // ... other properties
  run: async (client, interaction) => {
    // The commands #run/execute function
  }
});
```

<br/>
<h2 id="server-configuration">🛠️ Server Configuration</h2>

All server configuration is done in `config/servers.js`. Multiple servers are supported. The server configuration file is created during the installation and usage steps. Below is detailed information on what the settings do.

```js
  {
    // Server data
    // Global display name in Discord
    NAME: 'My Server 😎',
    // Your server api id - make sure to "grant access" through the link displayed
    // in the cftools developer portal
    CFTOOLS_SERVER_API_ID: 'YOUR_SERVER_API_ID',
    // Your DayZ server IP
    SERVER_IPV4: '0.0.0.0',
    // Your DayZ Game port
    SERVER_PORT: 2302,

    // Command Configuration
    // Include the zones heatmap image in the /statistics command
    // Fixes issues using the command where Chromium dependencies can't be resolved
    STATISTICS_INCLUDE_ZONES_HEATMAP: true,
    // Keep the Puppeteer Chromium browser open - this generates the
    // heatmap WAY faster, but uses more RAM (~+20 MB)
    STATISTICS_KEEP_PUPPETEER_BROWSER_OPEN: true,
    // Played identities are considered sensitive information by default
    // Set this to false if you want a player's in-game name history to be public
    STATISTICS_HIDE_PLAYER_NAME_HISTORY: true,
    // Include mod list in /server-info
    SERVER_INFO_INCLUDE_MOD_LIST: true,

    // Live Discord > DayZ chat feed configuration
    // Requires the privileged "Message Content Intent" (discord.dev > App > Bot > Message Content Intent)
    // Max message length is 256 characters, and a members tags and display name count towards that
    // Enable or disable the chat feed module
    USE_CHAT_FEED: true,
    // The channels where members can send messages that get forwarded to DayZ
    CHAT_FEED_CHANNEL_IDS: [ '806479539110674472' ],
    // List of roles that a member needs to have before their message
    // gets broadcasted to DayZ. Public if empty. With 2 or more role ids,
    // the check operator is AND not OR, meaning all roles defined here are required
    CHAT_FEED_REQUIRED_ROLE_IDS: [],
    // Disable the "(Discord)" prefix in the in-game message
    CHAT_FEED_USE_DISCORD_PREFIX: true,
    // By default displayed the members nickname, can be disabled to
    // display username instead
    CHAT_FEED_USE_DISPLAY_NAME: true,
    // Members messages get forwarded to DayZ once every X
    // Set to false to disable throttling
    CHAT_FEED_MESSAGE_COOLDOWN: 2.5,
    // With the Discord role tag system (next configuration value) you might want to configure the max
    // allowed characters that are displayed for member display names
    CHAT_FEED_MAX_DISPLAY_NAME_LENGTH: 20,
    // List of Discord role tags to display in-game
    // If member has multiple roles the first role tag will be used
    CHAT_FEED_DISCORD_TAGS: [
      {
        roleIds: [ config.permissions.ownerId ],
        displayTag: '[OWNER]'
      },
      {
        roleIds: config.permissions.administratorRoleIds,
        displayTag: '[ADMIN]'
      },
      {
        roleIds: config.permissions.moderatorRoleIds,
        displayTag: '[MOD]'
      },
      {
        // Matches everyone
        roleIds: [],
        displayTag: '[SURVIVOR]',
        enabled: false
      }
    ],

    // Teleport config
    // Should the /teleport-location command be available
    USE_TELEPORT_LOCATIONS: true,
    // Teleport file to use for this server configuration
    // Loaded from /config/teleport-locations/NAME.json
    TELEPORT_LOCATIONS_FILE_NAME: 'chernarus',

    // Global Leaderboard
    // What stat should be used as the default sorting stat,
    // used when a statistic command option isn't provided
    // One of LEADERBOARD_STATS (further down)
    LEADERBOARD_DEFAULT_SORTING_STAT: 'OVERALL',
    // How many players to display - min 10, max 100
    LEADERBOARD_PLAYER_LIMIT: 25,
    // Players to exclude from leaderboard
    LEADERBOARD_BLACKLIST: [
      '6284d7a30873a63f22e34f34',
      'CFTools IDs to exclude from the blacklist',
      'always use commas (,) at the end of the line EXCEPT THE LAST ONE > like so'
    ],
    // What stats should be enabled in the leaderboard
    LEADERBOARD_STATS: [
      'OVERALL',
      'KILLS',
      'KILL_DEATH_RATIO',
      'LONGEST_KILL',
      'PLAYTIME',
      'LONGEST_SHOT',
      'DEATHS',
      'SUICIDES'
    ],

    // Automatic Leaderboard - A module that sets a channel as
    // dedicated, always up-to-date leaderboard feed
    // Should we automatically update/post the leaderboard
    AUTO_LB_ENABLED: true,
    // The id of the channel to post the leaderboard
    AUTO_LB_CHANNEL_ID: '806479539110674472',
    // Time between messages in minutes
    AUTO_LB_INTERVAL_IN_MINUTES: 60,
    // Should we delete our old messages
    // Also deleted other bot messages, like commands
    AUTO_LB_REMOVE_OLD_MESSAGES: true,
    // Amount of players to display on automatic leaderboard
    AUTO_LB_PLAYER_LIMIT: 100,
    // The stat to rank players by in auto leaderboard module
    // One of LEADERBOARD_STATS
    AUTO_LB_STAT: 'SUICIDES'
  }
```

To add a second, or more, servers - copy-paste your entire server block and modify the configuration. Afterwards, make sure your syntax is still valid:

```javascript
[
  {
    ...
  }, <-- Notice the comma - always add this when adding a new server block
  {
    ...
  }
]
```

<br/>
<h2 id="installation-and-usage">🛠️ Installation & Usage</h2>

### Prerequisites

- A CFTools [developer application](https://developer.cftools.cloud/applications)
  - Make sure you navigate to the "Grant URL" that's displayed and authorize access to your server & resources (ban lists for example)
- A [Discord Bot account](https://discord.com/developers/applications "Discord Developer Portal")
    1) Head over to the page linked above
    2) Click "New Application" in the top right
    3) Give it a cool name and click "Create"
    4) Click "Bot" in the left hand panel
    5) Click "Add Bot" -> "Yes, do it!"
    6) Click "Reset Token" and copy it to your clipboard, you will need it later
- [NodeJS](https://nodejs.org/en/download/ "Node official website") (if you're running as a plain NodeJS app)
    1) Head over to the download page
    2) Download the latest LTS build available for your OS
    3) Be sure to check the box that says "Automatically install the necessary tools" when you're running the installation wizard
- [Chromium Browser](https://www.chromium.org/Home/), if you want to use `/statistics` hit-zone heat-maps (can be disabled)
  - Comes with most Windows installations, if not - [download](https://www.chromium.org/getting-involved/download-chromium/) the application
  - `sudo apt-get install chromium-browser` for most Linux distributions, or use your distro's apt-alternative (package manager) - if this doesn't work you might have to point `puppeteer` to your browser executable
  - `brew install chromium && which chromium` on Mac OS

### Run as a Docker container (preferred)

The quickest and easiest way to host/use this bot is by deploying it inside of a [Docker](https://docs.docker.com/engine/install/ "Official Docker Website") container.

> *A [**docker-compose**](https://docs.docker.com/compose/ "View docker-compose documentation") file is included for your convenience*

1. Clone this repository: `git clone https://github.com/Mirasaki/cftools-discord-bot.git`
2. Navigate inside the new folder: `cd cftools-discord-bot`
3. Rename `/config/.env.example` to `.env` and provide your environmental variables
    - Windows users often experience issues with this file, if you're getting errors that the env file can't be found, or `Expected path argument to be of type string` - check out [this timestamped video](https://youtu.be/6rOCUZ8opLM?t=42)
4. Rename `/config/config.example.js` to `config.js` and provide your bot configuration
5. Rename `/config/servers.example.js` to `servers.js` and provide your server configuration
    - Alternatively, you can now use the `docker-compose up` command to finish setting up the project if you have the [Docker Compose CLI](https://docs.docker.com/compose/) installed
6. Build the project: `docker build --tag my-cftools-discord-bot .`
7. Start the bot: `docker run -it --env-file .env --name my-cftools-discord-bot`

### Run as a plain NodeJS app

You can also clone this repository or download a release, and host the project directly. You will need [Node/NodeJS](https://nodejs.org/en/ "Node official website") (Be sure to check the box that says "Automatically install the necessary tools" when you're running the installation wizard)

1. Head over to [the download page](https://github.com/Mirasaki/cftools-discord-bot/releases/)
    - Alternatively, clone this repository by using `git clone https://github.com/Mirasaki/cftools-discord-bot.git` and skip to step 4 if you have [Git](https://git-scm.com/downloads "Git Download Section") installed
2. Download either the `zip` or `zip.gz` source code
3. Extract it using [your favorite zip tool](https://www.rarlab.com/download.htm "It's WinRar, duh")
4. Open a new console/terminal/shell window in the newly created project folder
5. Run `npm install` to install all dependencies
6. Rename [`/config/.env.example`](/config/.env.example "View .env.example file in current repository") to `.env` and configure your environmental variables
7. Rename [`/config/config.example.js`](/config/config.example.js "View config.example.js file in current repository") to `config.js` and go through your bot configuration
8. Rename [`/config/servers.example.js`](/config/servers.example.js "View servers.example.js file in current repository") to `servers.js` and go through your server configuration
9. Use the command `node .` to start the application, or alternatively:
    - `npm run start` to keep the process alive with [PM2](https://pm2.io/ "PM2 | Official Website"), suitable for production environments. (`npm i -g pm2` to install)
    - `npm run start:dev` if you have `nodemon` installed for automatic restarts on changes, suitable for development environments

> Open source, self-hosted, and MIT licensed, meaning you're in full control.

<br/>  
<p align="center"><a href="https://github.com/Mirasaki/cftools-discord-bot#cftools-discord-bot"><img src="http://randojs.com/images/backToTopButton.png" alt="Back to top" height="29"/></a></p>
