const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "shuffle",
  category: "Music",
  permission: "",
  description: "Shuffles the queue",
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
    if (player.queue.length < 3) {
      return interaction.reply({
        ephemeral: true,
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
    return interaction.reply({
      ephemeral: false,
      embeds: [
        new MessageEmbed()
          .setColor(client.settings.embed_color)
          .setDescription("🔀 Shuffled the queue."),
      ],
    });
  },
};
