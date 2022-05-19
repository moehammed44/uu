const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "previous",
  category: "Music",
  permission: "",
  description: "Plays the previous track",
  usage: "",
  cooldown: 5,
  settings: {
    inVoiceChannel: true,
    sameVoiceChannel: true,
    activePlayer: true,
    playingPlayer: true,
    DJonly: true,
    voteRequired: false,
  },
  /**
   * @param {{ client: import("../../../structures/Client"), interaction: import("discord.js").CommandInteraction, player: import("erela.js").Player }}
   */
  run: async ({ client, interaction, player, emojis }) => {
    if (!player.queue.previous) {
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(`${emojis.cross} There's no previous track.`),
        ],
      });
    }
    player.queue.unshift(player.queue.previous);
    player.stop();
    return interaction.reply({
      ephemeral: false,
      embeds: [
        new MessageEmbed()
          .setColor(client.settings.embed_color)
          .setDescription(`⏮️ Skipped to the previous track.`),
      ],
    });
  },
};
