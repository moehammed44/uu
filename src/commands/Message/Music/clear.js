const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "clear",
  aliases: ["clq", "cl"],
  category: "Music",
  permission: "",
  description: "Clears the queue",
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
    if (!player.queue.length) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(`${emojis.cross} Queue is empty.`),
        ],
      });
    }
    player.queue.clear();
    return message.channel.send({
      embeds: [
        new MessageEmbed()
          .setColor(client.settings.embed_color)
          .setDescription(`${emojis.check} Cleared the queue.`),
      ],
    });
  },
};
