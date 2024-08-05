const { stripIndents } = require('common-tags/lib');
const { colorResolver, parseSnakeCaseArray } = require('../util');

// Mapping our emojis
const emojiMap = {
  1: '👑',
  2: ':two:',
  3: ':three:',
  4: ':four:',
  5: ':five:',
  6: ':six:',
  7: ':seven:',
  8: ':eight:',
  9: ':nine:'
};

const getStatisticOptions = (LEADERBOARD_STATS) => [
  {
    name: 'Overall', value: 'OVERALL'
  },
  {
    name: 'Kill Death Ratio', value: 'KILL_DEATH_RATIO'
  },
  {
    name: 'Kills', value: 'KILLS'
  },
  {
    name: 'Longest Kill', value: 'LONGEST_KILL'
  },
  {
    name: 'Longest Shot', value: 'LONGEST_SHOT'
  },
  {
    name: 'Playtime', value: 'PLAYTIME'
  },
  {
    name: 'Deaths', value: 'DEATHS'
  },
  {
    name: 'Suicides', value: 'SUICIDES'
  }
].filter((e) => LEADERBOARD_STATS.includes(e.value));

// Dedicated function for building our embed data
// eslint-disable-next-line sonarjs/cognitive-complexity
const buildLeaderboardEmbedMessages = (
  guild,
  res,
  isDefaultQuery,
  statToGet,
  playerLimit,
  serverCfg
// eslint-disable-next-line sonarjs/cognitive-complexity
) => {
  // Initializing our embed vars
  let description = '';
  let fields = [];

  // Apply player limit variable
  if (playerLimit) res = res.slice(0, playerLimit);

  // Resolve fields for OVERALL leaderboard
  if (isDefaultQuery) {
    description = `Overall Leaderboard for ${ serverCfg.NAME }`;
    fields = res.map((e, index) => {
      const noEmojiFallback = `${ (index + 1).toString() }.`;
      return {
        name: `${ emojiMap[index + 1] || noEmojiFallback } ${ e.name }`,
        value: stripIndents`
            Kills: **${ e.kills ?? 0 }**
            Deaths: **${ e.deaths ?? 0 }**
            KD: **${ e.killDeathRatio ?? '1.00' }**
            LK: **${ e.longestKill ?? '-' }m**
          `,
        inline: true
      };
    });
  }

  // Resolve fields for Statistic leaderboard
  else {
    const parameterMap = {
      'kdratio': 'killDeathRatio',
      'longest_kill': 'longestKill',
      'longest_shot': 'longestShot'
    };
    const appendMap = {
      'kdratio': ' k/d',
      'longest_kill': 'm',
      'longest_shot': 'm',
      'kills': ' kills',
      'deaths': ' deaths',
      'suicides': ' suicides'
    };
    description = `${ parseSnakeCaseArray([ statToGet ])
      .join('')
      .toUpperCase() } Leaderboard for ${ serverCfg.NAME }`;
    fields = res.map((e, index) => {
      return {
        name: `${ (index + 1).toString() }. ${ e.name }`,
        value: `\`\`\`${
          statToGet === 'playtime'
            ? stripIndents`
                ${ Math.floor(e.playtime / 60 / 60) } hours
                ${ Math.floor((e.playtime / 60) % 60) } minutes
              `
            : e[parameterMap[statToGet] || statToGet.toLowerCase()]
        }${ appendMap[statToGet] || '' }\`\`\``,
        inline: true
      };
    });
  }


  // Defining limits and sizes
  const messageEmbedCollection = [];
  let embeds = [];
  const embedFieldLimit = 25;
  const maxPageCharSeize = 6000;
  const LAST_EMBED_FOOTER_TEXT = 'Did you know, you can use /statistics <steam64> to display detailed information on a player?';

  // Variables that reset in next loop
  let currentPage = [];
  let charCount = description.length + LAST_EMBED_FOOTER_TEXT.length; // Account for all scenarios
  let messageCharCount = charCount;

  // Iteration loop that will check if current data can be added
  // to existing page, or create a new one if we would exceed
  // and API limits
  for (let i = 0; i < fields.length; i++) {
    // Definitions
    const currentEntry = fields[i];
    const entryLength = currentEntry.name.length + currentEntry.value.length;
    const newCharCount = charCount + entryLength;
    const newMessageCharCount = messageCharCount + entryLength;

    // Create a new page/embed if adding this entry would cause
    // us to go over allowed maximums
    if (
      currentPage.length === embedFieldLimit
      || newCharCount >= maxPageCharSeize
    ) {
      embeds.push({
        fields: currentPage,
        color: colorResolver(),
        author: {
          name: description,
          iconURL: guild.iconURL({ dynamic: true })
        }
      });

      // Create a new page
      charCount = description.length + LAST_EMBED_FOOTER_TEXT.length;
      messageCharCount += charCount;
      currentPage = [];

      // Create a new message if total char count across
      // all embeds exceeds 6000
      if (newMessageCharCount >= embedFieldLimit) {
        messageEmbedCollection.push(embeds);
        embeds = [];
      }
    }

    // Fits in the character limit
    charCount += entryLength;
    messageCharCount += entryLength;
    currentPage.push(currentEntry);
  }

  // Push the left-over page data into the embeds array
  if (currentPage[0]) {
    embeds.push({
      fields: currentPage,
      color: colorResolver(),
      author: {
        name: description,
        iconURL: guild.iconURL({ dynamic: true })
      }
    });
  }

  // Push remaining embeds into message collection
  if (embeds[0]) messageEmbedCollection.push(embeds);

  // Appending the footer to the last embed
  const lastEmbed = embeds[embeds.length - 1];
  if (lastEmbed) lastEmbed.footer = Math.random() < 0.7
    ? ({ text: LAST_EMBED_FOOTER_TEXT })
    : null;

  return messageEmbedCollection;
};


module.exports = {
  emojiMap,
  getStatisticOptions,
  buildLeaderboardEmbedMessages
};
