const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "shuffle",
  aliases: ["mix"],
  category: "Music",
  permission: "",
  description: "Shuffles the queue",
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
    if (player.queue.length < 3) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${emojis.cross} Not enough songs in the queue to shuffle.`
            ),
        ],
      });
    }
    player.queue.shuffle();
    return message.channel.send({
      embeds: [
        new MessageEmbed()
          .setColor(client.settings.embed_color)
          .setDescription("🔀 Shuffled the queue."),
      ],
    });
  },
};
