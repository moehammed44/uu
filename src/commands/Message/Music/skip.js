const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "skip",
  aliases: ["s", "next"],
  category: "Music",
  permission: "",
  description: "Skips the current track or the provided number of tracks",
  usage: "",
  cooldown: 5,
  settings: {
    ownerOnly: false,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    activePlayer: true,
    playingPlayer: true,
    DJonly: true,
    voteRequired: false,
  },
  /**
   * @param {{ client: import("../../../structures/Client"), message: import("discord.js").Message, player: import("erela.js").Player }}
   */
  run: async ({ client, message, args, player, emojis }) => {
    if (!args[0]) {
      player.stop();
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription("⏭️ Skipped."),
        ],
      });
    }
    if (isNaN(args[0]) || args[0] <= 1 || args[0] > player.queue.length)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(`${emojis.cross} Invalid track.`),
        ],
      });
    player.queue.remove(0, args[0] - 1);
    player.stop();
    return message.channel.send({
      embeds: [
        new MessageEmbed()
          .setColor(client.settings.embed_color)
          .setDescription(`⏭️ Skipped to track **${args[0]}**.`),
      ],
    });
  },
};
