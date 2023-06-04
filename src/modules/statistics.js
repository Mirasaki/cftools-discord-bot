const { stripIndents } = require('common-tags/lib');
const {
  msToHumanReadableTime, titleCase, colorResolver
} = require('../util');
const { createHitZonesHeatMap } = require('./heatmap');
const { AttachmentBuilder } = require('discord.js');

const playerStatisticsCtx = async (cfg, {
  names,
  playtime,
  sessions,
  statistics: {
    kills,
    deaths,
    suicides,
    environmentDeaths,
    infectedDeaths,
    hits,
    longestShot,
    longestKill,
    hitZones,
    killDeathRatio,
    weaponsBreakdown
  }
// eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  // Assigning our stat variables
  const averagePlaytimePerSession = Math.round(playtime / sessions);
  const playtimePerSessionStr = !isNaN(averagePlaytimePerSession) ? msToHumanReadableTime(averagePlaytimePerSession * 1000) : 'n/a';

  // Resolve favorite weapon and it's kill count
  let favoriteWeaponName = 'Knife';
  const highestKills = Object.entries(weaponsBreakdown ?? {}).reduce((acc, [ weaponName, weaponStats ]) => {
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
    const hitZoneHeatMapImg = await createHitZonesHeatMap(cfg, hitZones);
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
  
          **Deaths:** ${ deaths ?? 0 }
          **Hits:** ${ hits ?? 0 }
          **KDRatio:** ${ killDeathRatio ?? 0 }
          **Kills:** ${ kills ?? 0 }
          **Longest Kill:** ${ longestKill ?? 0 } m
          **Longest Shot:** ${ longestShot ?? 0 } m
          **Suicides:** ${ suicides ?? 0 }
          **Environmental Deaths:** ${ environmentDeaths ?? 0 }
          **Infected Deaths:** ${ infectedDeaths ?? 0 }${ cfg.STATISTICS_INCLUDE_ZONES_HEATMAP ? '\n\n**__Hit Zones:__**' : '' }
        `
      }
    ]

  };
};

module.exports = { playerStatisticsCtx };
