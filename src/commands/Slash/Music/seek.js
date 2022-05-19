const { MessageEmbed } = require("discord.js");
const { duration } = require("../../../util");

module.exports = {
  name: "seek",
  category: "Music",
  permission: "",
  description: "Seeks to a specific time in the track playing",
  usage: "<time>",
  cooldown: 5,
  settings: {
    inVoiceChannel: true,
    sameVoiceChannel: true,
    activePlayer: true,
    playingPlayer: true,
    DJonly: true,
    voteRequired: true,
  },
  options: [
    {
      name: "time",
      description: "Enter the timestamp you would like to seek to. Ex - 1:34",
      type: 3,
      required: true,
    },
  ],
  /**
   * @param {{ client: import("../../../structures/Client"), interaction: import("discord.js").CommandInteraction, player: import("erela.js").Player }}
   */
  run: async ({ client, interaction, player, emojis }) => {
    if (!player.queue.current.isSeekable) {
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(`${emojis.cross} This track isn't seekable.`),
        ],
      });
    }
    const time = interaction.options.getString("time");
    if (!/^[0-5]?[0-9](:[0-5][0-9]){1,2}$/.test(time)) {
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${emojis.cross} You provided an invalid duration. Valid duration e.g. \`1:34\``
            ),
        ],
      });
    }
    const ms = () => {
      return (
        time
          .split(":")
          .map(Number)
          .reduce((a, b) => a * 60 + b, 0) * 1000
      );
    };
    ms = ms();
    if (ms > player.queue.current.duration) {
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${emojis.cross} The duration you provided exceeds the duration of the current track.`
            ),
        ],
      });
    }
    player.seek(ms);
    return interaction.reply({
      ephemeral: false,
      embeds: [
        new MessageEmbed()
          .setColor(client.settings.embed_color)
          .setDescription(`${emojis.check} Seeked to \`${duration(ms)}\``),
      ],
    });
  },
};
