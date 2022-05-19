const { MessageButton, MessageActionRow } = require("discord.js");

module.exports = {
  name: "support",
  aliases: [],
  category: "Misc",
  permission: "",
  description: "Gives you the link of our support server",
  usage: "",
  cooldown: 5,
  settings: {
    ownerOnly: false,
    inVoiceChannel: false,
    sameVoiceChannel: false,
    activePlayer: false,
    playingPlayer: false,
    DJonly: false,
    voteRequired: false,
  },
  /**
   * @param {{ message: import("discord.js").Message }}
   */
  run: async ({ message }) => {
    return message.channel.send({
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
