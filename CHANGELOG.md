## [1.10.1](https://github.com/Mirasaki/cftools-discord-bot/compare/v1.10.0...v1.10.1) (2024-03-12)


### Performance Improvements

* use read-only bind mount for config volumes ([990ae04](https://github.com/Mirasaki/cftools-discord-bot/commit/990ae04b198515bf622d11d02deedb600cfd410c))

# [1.10.0](https://github.com/Mirasaki/cftools-discord-bot/compare/v1.9.0...v1.10.0) (2024-03-12)


### Bug Fixes

* dockerignore ignore self ([4fc6983](https://github.com/Mirasaki/cftools-discord-bot/commit/4fc6983ad1206fb424de7555526728357c70f8ed))
* **Docker:** update Dockerfile, docker-compose and .dockerignore ([ab6c4e3](https://github.com/Mirasaki/cftools-discord-bot/commit/ab6c4e374796d791f3a542144108219cdc375db1))


### Features

* add arm64 Dockerfile to devcontainer ([603312b](https://github.com/Mirasaki/cftools-discord-bot/commit/603312b1e09041366bc391c95cba354eccffbd36))

# [1.9.0](https://github.com/Mirasaki/cftools-discord-bot/compare/v1.8.1...v1.9.0) (2024-02-14)


### Features

* **lb:** show server name instead of guild name in embeds ([612072d](https://github.com/Mirasaki/cftools-discord-bot/commit/612072d1428392a458195130f3adbf1644b27bd4))

## [1.8.1](https://github.com/Mirasaki/cftools-discord-bot/compare/v1.8.0...v1.8.1) (2024-02-13)


### Bug Fixes

* catch Chromium browser not being able to initialize ([5f1e295](https://github.com/Mirasaki/cftools-discord-bot/commit/5f1e2955e0f21e2b5bc12ce40b87043681bab424))
* undefined being displayed in k/d leaderboard ([75c7a57](https://github.com/Mirasaki/cftools-discord-bot/commit/75c7a5715d7d1344811ba6b0d8a5ae67a3d24461))
* undefined being displayed in k/d leaderboard ([cc7df86](https://github.com/Mirasaki/cftools-discord-bot/commit/cc7df861355041efa49b3825c0c902d24a9f38c7))
* undefined being displayed in k/d leaderboard ([b9c2222](https://github.com/Mirasaki/cftools-discord-bot/commit/b9c222259bbf9e5fb8717add47936faa2f8aa854))

# [1.8.0](https://github.com/Mirasaki/cftools-discord-bot/compare/v1.7.0...v1.8.0) (2024-01-11)


### Bug Fixes

* dont invalidate unknown interactions ([ed12d11](https://github.com/Mirasaki/cftools-discord-bot/commit/ed12d116edd932f3bf69bcbb3d61d89f8359725f))


### Features

* display prio queue public options ([229199e](https://github.com/Mirasaki/cftools-discord-bot/commit/229199ea6d3a5a138fb2bf2f2917956456832c7a))

# [1.7.0](https://github.com/Mirasaki/cftools-discord-bot/compare/v1.6.0...v1.7.0) (2023-12-21)


### Bug Fixes

* **server-info:** lower mods displayed, avoid max characters rate-limit ([d60bd37](https://github.com/Mirasaki/cftools-discord-bot/commit/d60bd37362d6a0feda73d4ca3ac5c0bd840e3807))
* test and finish up prio queue ([fb17334](https://github.com/Mirasaki/cftools-discord-bot/commit/fb17334e3f1b4221dabb6207ded0ca51be1547a9))


### Features

* include manual prio queue management (requested) ([0994fb3](https://github.com/Mirasaki/cftools-discord-bot/commit/0994fb3cf4b3284d5f27b54d01225e035c55475f))
* schedule shutdown functionality ([858ab97](https://github.com/Mirasaki/cftools-discord-bot/commit/858ab97e9dc82b98b06b77b8e3bffa036fe9168d))

# [1.6.0](https://github.com/Mirasaki/cftools-discord-bot/compare/v1.5.1...v1.6.0) (2023-11-30)


### Features

* allow dynamic events to be included in the kill-feed module ([be0c117](https://github.com/Mirasaki/cftools-discord-bot/commit/be0c11740e62dd4e7f644783fc5c4a55d6d07c1f))

## [1.5.1](https://github.com/Mirasaki/cftools-discord-bot/compare/v1.5.0...v1.5.1) (2023-11-27)


### Bug Fixes

* another breaking player-statistics API change ([9b79a23](https://github.com/Mirasaki/cftools-discord-bot/commit/9b79a23e971c645e391f18fe97261d1fb7a62e1a))

# [1.5.0](https://github.com/Mirasaki/cftools-discord-bot/compare/v1.4.1...v1.5.0) (2023-11-24)


### Bug Fixes

* check watch-list exists before running ([9c5e0de](https://github.com/Mirasaki/cftools-discord-bot/commit/9c5e0debeee61451abb60f1af2a24bfb25dcc548))
* update v2 reference for kdr ([0b72a14](https://github.com/Mirasaki/cftools-discord-bot/commit/0b72a14f55802786ddfe45652841f90a4afcaa21))


### Features

* **leaderboard:** support OVERALL default ranking stat ([e504321](https://github.com/Mirasaki/cftools-discord-bot/commit/e504321bd63ff9abdfde6f2900b380a4761d5107))

## [1.4.1](https://github.com/Mirasaki/cftools-discord-bot/compare/v1.4.0...v1.4.1) (2023-11-17)


### Bug Fixes

* update cftools-sdk to latest, fix player statistics references ([fea3aa7](https://github.com/Mirasaki/cftools-discord-bot/commit/fea3aa7cbc29bf8e8f6c2edf8cb034623c8fb104))

# [1.4.0](https://github.com/Mirasaki/cftools-discord-bot/compare/v1.3.0...v1.4.0) (2023-11-06)


### Bug Fixes

* run webhook functionality before is bot check ([5729608](https://github.com/Mirasaki/cftools-discord-bot/commit/5729608fbbf872c6e5d5bcaf7254e5887d0fd2d9))


### Features

* use cftools link for watch list ([8a0daf3](https://github.com/Mirasaki/cftools-discord-bot/commit/8a0daf3e54e7abb17e12d4cbca125058306f87ce))

# [1.3.0](https://github.com/Mirasaki/cftools-discord-bot/compare/v1.2.0...v1.3.0) (2023-10-26)


### Bug Fixes

* improve description for notify-player option ([287484a](https://github.com/Mirasaki/cftools-discord-bot/commit/287484aca283c19160499a56717df075ae72bc80))
* wrong discord formatting ([d05e2cb](https://github.com/Mirasaki/cftools-discord-bot/commit/d05e2cb2e5dcb4ff1e796b5c144cef6777e1c34a))


### Features

* /change-in-game-time ([8b15500](https://github.com/Mirasaki/cftools-discord-bot/commit/8b15500abc85806ad09860c8bcb0561f5bab8439))
* /kill-player command ([a9a1778](https://github.com/Mirasaki/cftools-discord-bot/commit/a9a1778cfb74d76002a5ce798abfd173cccfd74d))
* /strip-player command, remove all possessions ([219289e](https://github.com/Mirasaki/cftools-discord-bot/commit/219289ead96ae69112e6341dfde0a58d974de0e1))
* /wipe-world-ai command ([bb7d628](https://github.com/Mirasaki/cftools-discord-bot/commit/bb7d6287ac3f43aaccc999c22a0872cf90d3de7c))
* /wipe-world-vehicles ([660e89c](https://github.com/Mirasaki/cftools-discord-bot/commit/660e89c3513dc11ed5dd0a92aec4903785bac5f4))
* add use stormy weather command ([f1081bd](https://github.com/Mirasaki/cftools-discord-bot/commit/f1081bdb6899cf0271ce79a185383478e336083f))
* add use sunny weather command ([9e574ca](https://github.com/Mirasaki/cftools-discord-bot/commit/9e574ca3ff85fcb5b8c456451ba83476674a06ec))
* dedicated category for teleports ([993542b](https://github.com/Mirasaki/cftools-discord-bot/commit/993542b96abd1d64a06b5bbaab2ddbb51134c3c6))
* delayed kill-feed ([8f75378](https://github.com/Mirasaki/cftools-discord-bot/commit/8f75378e56a606925d76df611599d28091ab16b3))
* include POST GameLabs action request ([8072751](https://github.com/Mirasaki/cftools-discord-bot/commit/807275159676d30c14d958e9abce1159a3d12b2f))
* notify player on /heal option/parameter ([c2c10c5](https://github.com/Mirasaki/cftools-discord-bot/commit/c2c10c55c78459c342f985870de177bfbe71c1e2))
* spawn item on coords command ([e57827e](https://github.com/Mirasaki/cftools-discord-bot/commit/e57827e880cc7b8b9224adb0f80cf73507c176d6))
* strip player ([4a3f0d5](https://github.com/Mirasaki/cftools-discord-bot/commit/4a3f0d5c714233bc28db07776ecf93b64c93fa0d))
* use player in command names for ambiguity ([67b539c](https://github.com/Mirasaki/cftools-discord-bot/commit/67b539cb42dd8e00b2df75d4856fe03257879246))

# [1.2.0](https://github.com/Mirasaki/cftools-discord-bot/compare/v1.1.0...v1.2.0) (2023-08-19)


### Bug Fixes

* also add `--no-install-recommends` flag to apt-get update ([60a944d](https://github.com/Mirasaki/cftools-discord-bot/commit/60a944df7c6de4f6b2e5232155463e6983962045))
* check `TELEPORT_LOCATIONS_FILE_NAME` in debug logging ([b9bf854](https://github.com/Mirasaki/cftools-discord-bot/commit/b9bf854514b2c4acca483db04897053be7a65b8c))
* check config uses locations autocomplete handler ([1bc4b96](https://github.com/Mirasaki/cftools-discord-bot/commit/1bc4b9657345e98ed0263dde07661bfd0e38e2ab))
* discriminator deprecation ([e8f0898](https://github.com/Mirasaki/cftools-discord-bot/commit/e8f0898095f62568ed1e276da7eae714072a2e2e))
* docker `apt-get update` add `--no-install-recommends` flag ([db3cf2d](https://github.com/Mirasaki/cftools-discord-bot/commit/db3cf2da55a8bd30b7e2c3c2e20f9d2a61ae2b4c))
* docker-compose env file path ([3047ddb](https://github.com/Mirasaki/cftools-discord-bot/commit/3047ddbd23f23b6bd4cd05445adbc3e2402f8a05))
* global `/teleport-location` command ([78789a6](https://github.com/Mirasaki/cftools-discord-bot/commit/78789a60f1212baef7481db9c3bc8159450cb2f5))
* ignore NODE_ENV in debug log fn ([5e59287](https://github.com/Mirasaki/cftools-discord-bot/commit/5e59287418fa41f370eafbe6e17e83e5889739a4))
* **leaderboard:** use defaults for overall stats ([56c7e62](https://github.com/Mirasaki/cftools-discord-bot/commit/56c7e623456161b894fda7d97db605fcc1f2115b))
* mode kick and heal to Moderator commands ([a713d90](https://github.com/Mirasaki/cftools-discord-bot/commit/a713d908eb814875b364eab7a46653fa0a6ea450))
* **permissions:** return false on no channel in permLvlCheck ([4739f63](https://github.com/Mirasaki/cftools-discord-bot/commit/4739f63afd86da4fadae98694b3c5ef5a7dc5e80))
* remove unused global flag for ctx command ([09b20d7](https://github.com/Mirasaki/cftools-discord-bot/commit/09b20d7e1493378aa9f70804c14fddcfcc723128))
* review pr [#56](https://github.com/Mirasaki/cftools-discord-bot/issues/56) - styling and logic changes ([b3e808f](https://github.com/Mirasaki/cftools-discord-bot/commit/b3e808f00052aa3bf871da0f258836a012670d21))
* switch x and y coordinates ([1140011](https://github.com/Mirasaki/cftools-discord-bot/commit/1140011cc2b306c3a20bfdc232b2c2f4984cf098))
* switch x and y coordinates and check config uses locations ([8fcbfda](https://github.com/Mirasaki/cftools-discord-bot/commit/8fcbfdadf3a9559af36ecb82da25708f3854cf1b))
* switch z-y input coordinates ([8a4264a](https://github.com/Mirasaki/cftools-discord-bot/commit/8a4264adf5c5340f7d82d018fa674ba74e4653f9))
* **test:** rework test mode config resolution ([0ace717](https://github.com/Mirasaki/cftools-discord-bot/commit/0ace7170f71d7bc4eb1f0b6d5613afae9f3a3b2d))
* update feedback unresolved tpLocation ([28a89e2](https://github.com/Mirasaki/cftools-discord-bot/commit/28a89e21eb23a79b77ab0d97317ec4c184229ce1))
* use 12 hours instead of 24 for day/night cycle calc ([b91c182](https://github.com/Mirasaki/cftools-discord-bot/commit/b91c182355a7ce96ac38eecdc0afa5e8f0cd854d))
* wrong day/night cycle acceleration calculation ([2e37dcd](https://github.com/Mirasaki/cftools-discord-bot/commit/2e37dcda14810150dc172a2794fa005587a07c02))
* wrong position for color tag ([baf6fd2](https://github.com/Mirasaki/cftools-discord-bot/commit/baf6fd21c6c4e73de7d59a719ae4a178b16c935b))


### Features

* `/teleport all/multiple player/location` commands ([6f410b8](https://github.com/Mirasaki/cftools-discord-bot/commit/6f410b85f4be70d1e9eb5aa9392b75775b06aa98))
* `/teleport-location` - support custom locations ([83b6c7c](https://github.com/Mirasaki/cftools-discord-bot/commit/83b6c7cda7a54fe897e91aa6f2ad7b2e5bc7deb6))
* add /teleport-to` command ([8d7f91c](https://github.com/Mirasaki/cftools-discord-bot/commit/8d7f91c2d3726f83cc16449b5384d990a11e334c))
* add `LEADERBOARD_DEFAULT_SORTING_STAT` ([9d09ae0](https://github.com/Mirasaki/cftools-discord-bot/commit/9d09ae0570bf4540eb58265e77250da322c545f1))
* add `player` auto complete alias `target-player` ([0db26b5](https://github.com/Mirasaki/cftools-discord-bot/commit/0db26b548d75819358ebcd3d8e3d4e0e38379880))
* add `player` autocomplete handler alias ([8bfe17b](https://github.com/Mirasaki/cftools-discord-bot/commit/8bfe17bcac8c6b164ac22cc885eff3630549e20a))
* add new colors to color config - by TobiasReichel ([1b0077b](https://github.com/Mirasaki/cftools-discord-bot/commit/1b0077b85ef9ddf15ec168c552f038f7fa9d1b26))
* add player steam64 to `/admin-player-list` ([701791a](https://github.com/Mirasaki/cftools-discord-bot/commit/701791abafa9be18a79507964d8f107872c3eea9))
* allow #followUp instead of #editReply in `handleCFToolsError` ([e250f07](https://github.com/Mirasaki/cftools-discord-bot/commit/e250f077b8e552c1793d64579c318a9ddbf2a3e1))
* allow dynamic player auto-complete options ([69c1587](https://github.com/Mirasaki/cftools-discord-bot/commit/69c1587f4cfee0e0d9e089963a39efa07a705409))
* allow users to manually point chromium binary executable ([b8aaa10](https://github.com/Mirasaki/cftools-discord-bot/commit/b8aaa10ea7ac28873a98b43cdb50e2e94508579f))
* conditional `/statistics` hitzones heatmap image ([5b31615](https://github.com/Mirasaki/cftools-discord-bot/commit/5b31615ce1f4bca8e388c2c9bb2f3540f5f5d2d6))
* configurable role ids for Moderators and Administrators ([5524acd](https://github.com/Mirasaki/cftools-discord-bot/commit/5524acdd0ec26c4148ead0d24afabd12887fda69))
* custom option id param for `getPlayerSessionOptionValue` ([0a8a2c3](https://github.com/Mirasaki/cftools-discord-bot/commit/0a8a2c34642fca8b218f3498e215d2ebb8a4909b))
* delayed kill-feed ([3405d96](https://github.com/Mirasaki/cftools-discord-bot/commit/3405d9689469d3206308a071f268610619ef1ab4))
* hide player name history by default, configurable ([e362b09](https://github.com/Mirasaki/cftools-discord-bot/commit/e362b093a7dbabd3e936cffa60a3c7b5152beafb))
* include default Chernarus locations, thanks Frank Black ([03e5d94](https://github.com/Mirasaki/cftools-discord-bot/commit/03e5d94d4e36ec65cd34e8e68885159f3b09a1a2))
* include windows bat files ([d420692](https://github.com/Mirasaki/cftools-discord-bot/commit/d42069281fcb0395576526114183418b873ca5e1))
* introduce debug logging ([f285b9b](https://github.com/Mirasaki/cftools-discord-bot/commit/f285b9b211508e9fc867084acc98f9aa0a2edd4f))
* introduce live Discord > DayZ message feed ([a6978ac](https://github.com/Mirasaki/cftools-discord-bot/commit/a6978ac066c3a44ce5f22bc4b4529cbd660a4438))
* support Chromium/puppeteer in Dockerfile ([3bada7b](https://github.com/Mirasaki/cftools-discord-bot/commit/3bada7b3639a4b06aa64d8e6a336318d27e455e5))
* use single client config import ([4fe5809](https://github.com/Mirasaki/cftools-discord-bot/commit/4fe5809c98f39c3052a4c0f1b1f13dc362522d44))
* watch-list ([1550d35](https://github.com/Mirasaki/cftools-discord-bot/commit/1550d3545cba5beb14a09f42659133b2509e7948))


### Performance Improvements

* **puppeteer:** implement mutex lock and re-use browser instance ([51b0a81](https://github.com/Mirasaki/cftools-discord-bot/commit/51b0a819694cb155d2351a238b8d9cb42cbfca77))

# [1.1.0](https://github.com/Mirasaki/cftools-discord-bot/compare/v1.0.0...v1.1.0) (2023-05-22)


### Bug Fixes

* formatting ([234d2f7](https://github.com/Mirasaki/cftools-discord-bot/commit/234d2f7d44f4759fe81d985e589f838ed1f15b51))
* replace mp4 showcase with gif ([12d490d](https://github.com/Mirasaki/cftools-discord-bot/commit/12d490d85fe397f40abbb4344f915dbfca1cea68))


### Features

* action feature update ([dc47fee](https://github.com/Mirasaki/cftools-discord-bot/commit/dc47fee4d68a7c09b591d8a9e1dfa811a6f7a64e))
* conditional non-global commands ([703b753](https://github.com/Mirasaki/cftools-discord-bot/commit/703b753ac45b590e44cff5ecaf3a0394e4458e06))
* include (refactored) original dayz-leaderboard functionality ([68d6b7c](https://github.com/Mirasaki/cftools-discord-bot/commit/68d6b7ce5988fe23c77e65fdf2cd9e206d4d985c))
* include server config ([8307e81](https://github.com/Mirasaki/cftools-discord-bot/commit/8307e816929df187a1e10727d585a8638dcd3cde))
* minimize config ([98cd316](https://github.com/Mirasaki/cftools-discord-bot/commit/98cd316d67757589ce27ab0aa39499ea7dd83d4e))
* use dedicated `/config` folder ([89b98ad](https://github.com/Mirasaki/cftools-discord-bot/commit/89b98ada79c8f1db23538b631c7c03b84dc74331))

# 1.0.0 (2023-05-21)


### Bug Fixes

* apply template updates to stale ref ([7c44e0c](https://github.com/Mirasaki/cftools-discord-bot/commit/7c44e0c2084fcd48248bf617db6cccaf45b47c01))
