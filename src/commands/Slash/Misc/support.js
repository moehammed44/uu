const { MessageButton, MessageActionRow } = require("discord.js");

module.exports = {
  name: "support",
  category: "Misc",
  permission: "",
  description: "Gives you the link of our support server",
  usage: "",
  cooldown: 5,
  settings: {
    inVoiceChannel: false,
    sameVoiceChannel: false,
    activePlayer: false,
    playingPlayer: false,
    DJonly: false,
    voteRequired: false,
  },
  /**
   * @param {{ interaction: import("discord.js").CommandInteraction }}
   */
  run: async ({ interaction }) => {
    return interaction.reply({
      ephemeral: true,
      content: "\u200b",
      components: [
        new MessageActionRow().addComponents(
          new MessageButton()
            .setStyle("LINK")
            .setLabel("Support Server")
            .setURL("https://discord.gg/88R47paNbV")
        ),
      ],
    });
  },
};
