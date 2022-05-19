const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "autoplay",
  category: "Music",
  permission: "",
  description: "Toggles autoplay on/off",
  usage: "",
  cooldown: 5,
  settings: {
    inVoiceChannel: true,
    sameVoiceChannel: true,
    activePlayer: true,
    playingPlayer: true,
    DJonly: false,
    voteRequired: false,
  },
  /**
   * @param {{ client: import("../../../structures/Client"), interaction: import("discord.js").CommandInteraction, player: import("erela.js").Player }}
   */
  run: async ({ client, interaction, player }) => {
    player.set("autoplay", !player.get("autoplay"));
    return interaction.reply({
      ephemeral: false,
      embeds: [
        new MessageEmbed()
          .setColor(client.settings.embed_color)
          .setDescription(
            `♾️ Autoplay is now ${
              player.get("autoplay") ? "**enabled**" : "**disabled**"
            }`
          ),
      ],
    });
  },
};
