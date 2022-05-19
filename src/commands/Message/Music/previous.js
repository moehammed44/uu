const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "previous",
  aliases: ["playprevious", "back"],
  category: "Music",
  permission: "",
  description: "Plays the previous track",
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
  run: async ({ client, message, player, emojis }) => {
    if (!player.queue.previous) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(`${emojis.cross} There's no previous track.`),
        ],
      });
    }
    player.queue.unshift(player.queue.previous);
    player.stop();
    return message.channel.send({
      embeds: [
        new MessageEmbed()
          .setColor(client.settings.embed_color)
          .setDescription(`⏮️ Skipped to the previous track.`),
      ],
    });
  },
};
