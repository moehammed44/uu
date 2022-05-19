const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "resume",
  aliases: ["unpause", "continue"],
  category: "Music",
  permission: "",
  description: "Resumes the player",
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
    if (!player.paused) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(`${emojis.cross} The player isn't paused.`),
        ],
      });
    }
    player.pause(false);
    return message.channel.send({
      embeds: [
        new MessageEmbed()
          .setColor(client.settings.embed_color)
          .setDescription("▶️ Resumed!"),
      ],
    });
  },
};
