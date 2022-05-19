const { MessageEmbed } = require("discord.js");
const { duration } = require("../../../util");

module.exports = {
  name: "seek",
  aliases: [],
  category: "Music",
  permission: "",
  description: "Seeks to a specific time in the track playing",
  usage: "<time>",
  cooldown: 5,
  settings: {
    ownerOnly: false,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    activePlayer: true,
    playingPlayer: true,
    DJonly: true,
    voteRequired: true,
  },
  /**
   * @param {{ client: import("../../../structures/Client"), message: import("discord.js").Message, player: import("erela.js").Player }}
   */
  run: async ({ client, message, args, player, emojis }) => {
    if (!args[0]) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${emojis.cross} Use the command again, and this provide a duration to seek.`
            ),
        ],
      });
    }
    if (!player.queue.current.isSeekable) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(`${emojis.cross} This track isn't seekable.`),
        ],
      });
    }
    if (!/^[0-5]?[0-9](:[0-5][0-9]){1,2}$/.test(args[0])) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${emojis.cross} You provided an invalid duration. Valid duration e.g. \`1:34\``
            ),
        ],
      });
    }
    let ms = () => {
      return (
        args[0]
          .split(":")
          .map(Number)
          .reduce((a, b) => a * 60 + b, 0) * 1000
      );
    };
    ms = ms();
    if (ms > player.queue.current.duration) {
      return message.channel.send({
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
    return message.channel.send({
      embeds: [
        new MessageEmbed()
          .setColor(client.settings.embed_color)
          .setDescription(`${emojis.check} Seeked to \`${duration(ms)}\``),
      ],
    });
  },
};
