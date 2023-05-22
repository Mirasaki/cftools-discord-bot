const { colorResolver, msToHumanReadableTime } = require('../util');
const colors = require('../../config/colors.json');
const emojis = require('../../config/emojis.json');
const { stripIndents } = require('common-tags');
const { MS_IN_ONE_DAY } = require('../constants');

const resolveFlags = ({ attributes }) => {
  const flags = [];
  if (attributes?.dlc) flags.push(
    ...Object.entries(attributes.dlcs)
      .filter(([ k, v ]) => v === true)
      .map(([ k, v ]) => `dlc-${ k }`)
  );
  if (attributes.official) flags.push('official');
  if (attributes.modded) flags.push('modded');
  if (attributes.hive) flags.push(`hive-${ attributes.hive }`);
  if (attributes.experimental) flags.push('experimental');
  if (attributes.whitelist) flags.push('whitelist');
  return flags;
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const serverInfoOverviewEmbed = (data, flags, guild) => ({
  color: colorResolver(data.online ? colors.success : colors.error),
  author: {
    name: `#${ data.rank } | ` + data.name + (data.map ? ` (${ data.map })` : ''),
    icon_url: guild.iconURL({ dynamic: true })
  },
  description: stripIndents`
    **IP:** **\`${ data.host?.address ?? '0.0.0.0' }:${ data.host?.gamePort ?? '0000' }\`**
    **Time:** ${ data.environment?.time ?? 'Unknown' }
    **Location:** [${ data.geolocation.country?.code }] ${ data.geolocation?.country?.name ?? 'n/a' }
    **Perspective:** ${ data.environment?.perspectives?.thirdPersonPerspective ? 'First + Third' : 'First Online' }
    **Time Acceleration:**
    🌞 ${ msToHumanReadableTime(MS_IN_ONE_DAY / (data.environment?.timeAcceleration?.general ?? 1)) }
    🌗 ${ msToHumanReadableTime((
    MS_IN_ONE_DAY / 2
  ) / (
    (data.environment?.timeAcceleration?.general ?? 1)
      + (data.environment?.timeAcceleration?.night ?? 1)
  )) }
    **Flags:** \`${ flags.join('`, `') || 'None' }\`
  `,
  fields: [
    {
      name: 'Players',
      value: stripIndents`
        Online: ${ data.status?.players?.online ?? 0 }
        Slots: ${ data.status?.players?.slots ?? 0 }
        Queue: ${ data.status?.players?.queue ?? 0 }
      `,
      inline: true
    },
    {
      name: 'Security',
      value: stripIndents`
        VAC: ${ (data.security?.vac ? emojis.success : emojis.error) ?? 'n/a' }
        BatllEye: ${ (data.security?.battleye ? emojis.success : emojis.error) ?? 'n/a' }
        Password-Protected: ${ (data.security?.password ? emojis.success : emojis.error) ?? 'n/a' }
      `,
      inline: true
    }
  ],
  footer: { text: `DayZ - ${ data.version }` }
});

module.exports = {
  resolveFlags,
  serverInfoOverviewEmbed
};
