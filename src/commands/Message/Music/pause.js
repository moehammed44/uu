const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "pause",
  aliases: ["freeze"],
  category: "Music",
  permission: "",
  description: "Pauses the player",
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
  run: async ({ client, message, player, emojis, guildData }) => {
    if (player.paused) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(`${emojis.cross} The player is already paused.`),
        ],
      });
    }
    player.pause(true);
    return message.channel.send({
      embeds: [
        new MessageEmbed()
          .setColor(client.settings.embed_color)
          .setDescription(
            `⏸️ Paused. Type \`${guildData.prefix}resume\` to continue playing.`
          ),
      ],
    });
  },
};
