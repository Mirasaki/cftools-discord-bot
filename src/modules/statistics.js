const { stripIndents } = require('common-tags/lib');
const {
  msToHumanReadableTime, titleCase, colorResolver
} = require('../util');
const { createHitZonesHeatMap } = require('./heatmap');
const { AttachmentBuilder } = require('discord.js');

/**
 * @param {import('cftools-sdk').Player} data
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
const playerStatisticsCtx = async (cfg, data) => {
  // Assigning our stat variables
  const {
    names,
    playtime,
    sessions,
    statistics: { dayz: {
      deaths,
      hits,
      kdratio,
      kills,
      longestKill,
      longestShot,
      weapons,
      zones
    } }
  } = data;
  const averagePlaytimePerSession = Math.round(playtime / sessions);
  const playtimePerSessionStr = !isNaN(averagePlaytimePerSession) ? msToHumanReadableTime(averagePlaytimePerSession * 1000) : 'n/a';
  const totalDeaths = Object.values(deaths ?? {}).reduce((acc, val) => acc + val, 0);

  // Resolve favorite weapon and it's kill count
  let favoriteWeaponName = 'Knife';
  const highestKills = Object.entries(weapons ?? {}).reduce((acc, [ weaponName, weaponStats ]) => {
    const weaponKillsIsLower = acc > weaponStats.kills;
    if (!weaponKillsIsLower) favoriteWeaponName = weaponName;
    return weaponKillsIsLower ? acc : weaponStats.kills;
  }, 0);
  const cleanedWeaponName = titleCase(favoriteWeaponName.replace(/_/g, ' '));

  // Reversing the name history array so the latest used name is the first item
  names.reverse();

  // Generate hit zone image
  const files = [];
  if (cfg.STATISTICS_INCLUDE_ZONES_HEATMAP) {
    const hitZoneHeatMapImg = await createHitZonesHeatMap(cfg, zones);
    const file = new AttachmentBuilder(Buffer.from(hitZoneHeatMapImg.buffer)).setName('heatmap.png');
    files.push(file);
  }

  return {
    files,
    embeds: [
      {
        color: colorResolver(),
        title: `Stats for ${ names[0] ?? 'Survivor' }`,
        image: { url: 'attachment://heatmap.png' },
        description: stripIndents`
          Survivor has played for ${ msToHumanReadableTime(playtime * 1000) } - over ${ sessions } total sessions.
          Bringing them to an average of ${ playtimePerSessionStr } per session.
          ${ cfg.STATISTICS_HIDE_PLAYER_NAME_HISTORY !== true && `\n**Name History:** **\`${ names.slice(0, 10).join('`**, **`') || 'None' }\`**` }
          
          **Favorite Weapon:** ${ cleanedWeaponName ?? 'Knife' } with ${ highestKills ?? 0 } kills

          **Deaths:** ${ totalDeaths ?? 0 } (${ deaths.other } PvP)
          **Hits:** ${ hits ?? 0 }
          **KDRatio:** ${ kdratio ?? 0 }
          **Kills:** ${ kills?.players ?? 0 }
          **Longest Kill:** ${ longestKill ?? 0 } m
          **Longest Shot:** ${ longestShot ?? 0 } m
          **Suicides:** ${ deaths.suicides ?? 0 }
          **Environmental Deaths:** ${ deaths.environment ?? 0 }
          **Infected Deaths:** ${ deaths.infected ?? 0 }${ cfg.STATISTICS_INCLUDE_ZONES_HEATMAP ? '\n\n**__Hit Zones:__**' : '' }
        `
      }
    ]
  };
};

module.exports = { playerStatisticsCtx };
