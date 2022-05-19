const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "clear",
  category: "Music",
  permission: "",
  description: "Clears the queue",
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
    if (!player.queue.length) {
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(`${emojis.cross} Queue is empty.`),
        ],
      });
    }
    player.queue.clear();
    return interaction.reply({
      ephemeral: false,
      embeds: [
        new MessageEmbed()
          .setColor(client.settings.embed_color)
          .setDescription(`${emojis.check} Cleared the queue.`),
      ],
    });
  },
};
