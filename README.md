# cftools-discord-bot

[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
![build](https://img.shields.io/github/actions/workflow/status/Mirasaki/cftools-discord-bot/test.yml?branch=main)
[![CodeFactor](https://www.codefactor.io/repository/github/Mirasaki/cftools-discord-bot/badge)](https://www.codefactor.io/repository/github/Mirasaki/cftools-discord-bot)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Docker Pulls](https://img.shields.io/docker/pulls/mirasaki/cftools-discord-bot)
![version](https://img.shields.io/github/v/release/Mirasaki/cftools-discord-bot)

---

This is a Discord bot that fully utilizes the CFTools Data API.

---

## Table of Contents

- [Live Demo](#live-demo)
- [Showcase](#showcase)
- [Documentation](#documentation)
- [Features](#features)
  - [Dynamic Command Handler](#dynamic-command-handler)
  - [Dynamic Component Handler](#dynamic-component-handler)
  - [Dynamic Event Handler](#dynamic-event-handler)
  - [RESTful API](#restful-api)
  - [Others](#others)
- [Notes](#notes)
- [Installation & Usage](#installation--usage)
  - [Prerequisites](#prerequisites)
  - [Docker](#run-as-a-docker-container-preferred)
  - [Node](#run-as-a-plain-nodejs-app)
  - [Updating](#updating)

---

<h2 id="features">Features</h2>

- [dev]
- [dev]

<h2 id="installation--usage">Installation & Usage</h2>

<h3 id="prerequisites">Prerequisites</h3>

- A [Discord Bot account](https://discord.com/developers/applications "Discord Developer Portal")
    1) Head over to the page linked above
    2) Click "New Application" in the top right
    3) Give it a cool name and click "Create"
    4) Click "Bot" in the left hand panel
    5) Click "Add Bot" -> "Yes, do it!"
    6) Click "Reset Token" and copy it to your clipboard, you will need it later

<h3 id="run-as-a-docker-container-preferred">Run as a Docker container (preferred)</h3>

The quickest, and easiest, way to host/use this bot is by deploying it inside of a [Docker](https://docs.docker.com/engine/install/ "Official Docker Website") container.

1. Clone this repository: `git clone https://github.com/Mirasaki/cftools-discord-bot.git`
2. Navigate inside the new folder: `cd cftools-discord-bot`
3. Rename `.env.example` to `.env` and provide your environmental variables
4. Rename `config.example.js` to `config.js` and provide your configuration

    - Alternatively, you can now use the `docker-compose up` command to finish setting up the project if you have the [Docker Compose CLI](https://docs.docker.com/compose/) installed

5. Build the project: `docker build --tag my-discord-bot .`
6. Start the bot: `docker run -it --env-file .env --name my-discord-bot mirasaki/cftools-discord-bot:main`

There's a plethora of Docker scripts included in the `/package.json` file, including a development environment - take a look to get started if you've never used Docker before!

<h3 id="run-as-a-plain-nodejs-app">Run as a plain NodeJS app</h3>

<h4 id="prerequisites">Prerequisites</h4>

- [NodeJS](https://nodejs.org/en/download/ "Node official website") (if you're running as a plain NodeJS app)
    1) Head over to the download page
    2) Download the current build (latest features) available for your OS
    3) Be sure to check the box that says "Automatically install the necessary tools" when you're running the installation wizard

You can also clone this repository or download a release, and host the project directly. You will need [Node/NodeJS](https://nodejs.org/en/ "Node official website") (Be sure to check the box that says "Automatically install the necessary tools" when you're running the installation wizard)

1. Head over to [the download page](https://github.com/Mirasaki/cftools-discord-bot/releases/)
    - Alternatively, clone this repository by using `git clone https://github.com/Mirasaki/cftools-discord-bot.git` and skip to step 4 if you have [Git](https://git-scm.com/downloads "Git Download Section") installed.
2. Download either the `zip` or `zip.gz` source code
3. Extract it using [your favorite zip tool](https://www.rarlab.com/download.htm "It's WinRar, duh")
4. Open a new console/terminal/shell window in the newly created project folder.
5. Run `npm i --include-dev` to install all dependencies, including development dependencies.
6. Rename [`.env.example`](/.env.example "View .env.example file in current repository") to `.env` and configure your environmental variables
7. Rename [`config.example.js`](/config.example.js "View config.example.js file in current repository") to `config.js` and go through your bot configuration
8. Use the command `node .` to start the application, or alternatively:
    - `npm run start` to keep the process alive with [PM2](https://pm2.io/ "PM2 | Official Website"), suitable for production environments. (`npm i -g pm2` to install)
    - `npm run start:dev` if you have `nodemon` installed for automatic restarts on changes, suitable for development environments.

> Open source, self-hosted, and MIT licensed, meaning you're in full control.
