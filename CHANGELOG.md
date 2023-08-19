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
