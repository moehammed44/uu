const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "replay",
  category: "Music",
  permission: "",
  description: "Replays the current track",
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
  run: async ({ client, interaction, player }) => {
    player.pause(true);
    player.seek(0);
    player.pause(false);
    return interaction.reply({
      ephemeral: false,
      embeds: [
        new MessageEmbed()
          .setColor(client.settings.embed_color)
          .setDescription(`🔃 Replaying the current track.`),
      ],
    });
  },
};
