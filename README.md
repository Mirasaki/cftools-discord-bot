# cftools-discord-bot

[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
![build](https://img.shields.io/github/actions/workflow/status/mirasaki/cftools-discord-bot/test.yml)
[![CodeFactor](https://www.codefactor.io/repository/github/Mirasaki/cftools-discord-bot/badge)](https://www.codefactor.io/repository/github/Mirasaki/cftools-discord-bot)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Docker Pulls](https://img.shields.io/docker/pulls/mirasaki/cftools-discord-bot)
![version](https://img.shields.io/github/v/release/Mirasaki/cftools-discord-bot)
<!-- ![size](https://img.shields.io/docker/image-size/mirasaki/cftools-discord-bot) -->

This is a Discord bot that fully utilizes the CFTools Data API.

## Table of Contents

- [Showcase](#showcase)
- [Features](#features)
- [Planned Features](#planned-features)
- [Hosting](#hosting)
- [Discord Permissions](#discord-permissions)
- [Installation & Usage](#installation--usage)
  - [Prerequisites](#prerequisites)
  - [Docker](#run-as-a-docker-container-preferred)
  - [Node](#run-as-a-plain-nodejs-app)

---

## Showcase

<details>
<summary>Click to view</summary>

![dm-survivor](./assets/showcase/dm-survivor.gif)
![stats-normal](./assets/showcase/stats_normal.png)
![admin-player-list](./assets/showcase/admin-player-list.png)
![kick](./assets/showcase/kick.gif)
![flagged-player-list](./assets/showcase/flagged-player-list.png)
![server-info](./assets/showcase/server-info.png)

</details>

## Features

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
- Complete leaderboard integration with all available stats
- Display detailed player/individual statistics, supports Steam64, BattlEye GUID, and Bohemia Interactive Id
- Player hit zone % heat maps
- Server info overview
- And best of all, everything is configurable!

## Planned Features

- Public channel that forwards Discord messages to DayZ (configurable module)
- Execute raw RCon commands - I'm looking for someone that is very knowledgeable on available RCon command
- Dedicated Server Status channel, overview with online/offline status
- Manage Priority Queue
- Manage Ban lists
- Manage Whitelists
- Custom GameLab action support

## Hosting

We have partnered with [VYKIX.com](https://portal.vykix.com/aff.php?aff=17) after observing many of our clients using VYKIX services and products. Check them out for affordable and reliable hosting, they bring the **best DayZ hosting experience possible.** 📈

## Discord Permissions

> This is not the permission level required to execute actions or run commands, like User, Moderator or Administrator

Invite the bot to your server by navigating to the following URL (replace `YOUR_CLIENT_ID` with `CLIENT_ID` from the `/config/.env` file):

`https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=0&scope=bot%20applications.commands`

Any command can be used without any Discord permissions, as long as the bot is invited to your server with the `bot` and `applications.commands` scopes. You can use the template url above, or alternatively, generate an invite link in the [Discord Developer Portal](https://discord.com/developers/applications) (Your App > OAuth2 > URL Generator > `scopes: bot + applications.commands`)

`AUTOMATIC_LEADERBOARD_MODULE`: This requires the following permissions in any channel this module is assigned to: `View Channel`, `Read Message History`, `Send Messages`, and `Embed Links`

## Installation & Usage

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

### Run as a Docker container (preferred)

The quickest and easiest way to host/use this bot is by deploying it inside of a [Docker](https://docs.docker.com/engine/install/ "Official Docker Website") container.

> *A [**docker-compose**](https://docs.docker.com/compose/ "View docker-compose documentation") file is included for your convenience*

1. Clone this repository: `git clone https://github.com/Mirasaki/cftools-discord-bot.git`
2. Navigate inside the new folder: `cd cftools-discord-bot`
3. Rename `/config/.env.example` to `.env` and provide your environmental variables
4. Rename `/config/config.example.js` to `config.js` and provide your bot configuration
5. Rename `/config/servers.example.js` to `servers.js` and provide your server configuration
    - Alternatively, you can now use the `docker-compose up` command to finish setting up the project if you have the [Docker Compose CLI](https://docs.docker.com/compose/) installed
6. Build the project: `docker build --tag my-discord-bot .`
7. Start the bot: `docker run -it --env-file .env --name my-discord-bot mirasaki/cftools-discord-bot:main`

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
