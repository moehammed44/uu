const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "replay",
  aliases: [],
  category: "Music",
  permission: "",
  description: "Replays the current track",
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
  run: async ({ client, message, player }) => {
    player.pause(true);
    player.seek(0);
    player.pause(false);
    return message.channel.send({
      embeds: [
        new MessageEmbed()
          .setColor(client.settings.embed_color)
          .setDescription(`🔃 Replaying the current track.`),
      ],
    });
  },
};
