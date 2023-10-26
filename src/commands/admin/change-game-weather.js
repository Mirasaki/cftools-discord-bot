const { ApplicationCommandOptionType } = require('discord.js');
const { ChatInputCommand } = require('../../classes/Commands');
const {
  requiredServerConfigCommandOption,
  getServerConfigCommandOptionValue,
  postGameLabsAction,
  broadcastMessage
} = require('../../modules/cftClient');

module.exports = new ChatInputCommand({
  permLevel: 'Administrator',
  global: true,
  data: {
    description: 'Change the current in-game weather',
    options: [
      requiredServerConfigCommandOption,
      {
        name: 'overcast',
        description: 'The overcast value to set',
        type: ApplicationCommandOptionType.Number,
        required: true,
        min_value: 0.0000,
        max_value: 1.0000
      },
      {
        name: 'fog',
        description: 'The fog value to set',
        type: ApplicationCommandOptionType.Number,
        required: true,
        min_value: 0.0000,
        max_value: 1.0000
      },
      {
        name: 'rain',
        description: 'The rain value to set',
        type: ApplicationCommandOptionType.Number,
        required: true,
        min_value: 0.0000,
        max_value: 1.0000
      },
      {
        name: 'wind',
        description: 'The wind value to set, in km/h',
        type: ApplicationCommandOptionType.Integer,
        required: true,
        min_value: 0,
        max_value: 100
      },
      {
        name: 'notify-players',
        description: 'Send a global notification to the players, default true',
        type: ApplicationCommandOptionType.Boolean,
        required: false
      }
    ]
  },

  run: async (client, interaction) => {
    // Destructuring
    const { member, options } = interaction;
    const { emojis } = client.container;
    const overcast = options.getNumber('overcast');
    const fog = options.getNumber('fog');
    const rain = options.getNumber('rain');
    const wind = options.getInteger('wind');
    const notifyPlayers = options.getBoolean('notify-players') ?? true;

    // Deferring our reply
    await interaction.deferReply();

    // Resolve options
    const serverCfg = getServerConfigCommandOptionValue(interaction);

    // Performing request
    const res = await postGameLabsAction(
      serverCfg.CFTOOLS_SERVER_API_ID,
      'CFCloud_WorldWeather',
      'world',
      null,
      {
        overcast: { valueFloat: overcast },
        fog: { valueFloat: fog },
        rain: { valueFloat: rain },
        wind: { valueInt: wind }
      }
    );

    if (res !== true) {
      interaction.editReply({ content: `${ emojis.error } ${ member }, invalid response code - weather might not have been updated` });
      return;
    }

    // Resolve weather string
    const overcastStr = overcast.toFixed(2);
    const fogStr = fog.toFixed(2);
    const rainStr = rain.toFixed(2);
    const windStr = wind.toString().padStart(3, '0');
    const weatherStr = `Overcast: ${ overcastStr }\nFog: ${ fogStr }\nRain: ${ rainStr }\nWind: ${ windStr }`;

    // Notify player
    if (notifyPlayers) {
      await broadcastMessage(
        serverCfg.CFTOOLS_SERVER_API_ID,
        'The weather has been changed by an administrator (this might take a while to take effect)'
      );
    }

    // User feedback on success
    interaction.editReply({ content: `${ emojis.success } ${ member }, weather has been changed to:\n\n\`\`\`${ weatherStr }\`\`\`` });
  }
});
