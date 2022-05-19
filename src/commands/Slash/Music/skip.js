const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "skip",
  category: "Music",
  permission: "",
  description: "Skips the current track or the provided number of tracks",
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
  options: [
    {
      name: "position",
      description: "Enter the position you would like to skip to",
      type: 4,
      required: false,
    },
  ],
  /**
   * @param {{ client: import("../../../structures/Client"), interaction: import("discord.js").CommandInteraction, player: import("erela.js").Player }}
   */
  run: async ({ client, interaction, player, emojis }) => {
    const skipTo = interaction.options.getInteger("position");
    if (!skipTo) {
      player.stop();
      return interaction.reply({
        ephemeral: false,
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription("⏭️ Skipped."),
        ],
      });
    }
    if (skipTo <= 1 || skipTo > player.queue.length)
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(`${emojis.cross} Invalid track.`),
        ],
      });
    player.queue.remove(0, skipTo - 1);
    player.stop();
    return interaction.reply({
      ephemeral: false,
      embeds: [
        new MessageEmbed()
          .setColor(client.settings.embed_color)
          .setDescription(`⏭️ Skipped to track **${skipTo}**.`),
      ],
    });
  },
};
