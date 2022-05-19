const { MessageButton, MessageActionRow } = require("discord.js");

module.exports = {
  name: "vote",
  aliases: [],
  category: "Misc",
  permission: "",
  description: "Gives you the link to vote the bot",
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
   * @param {{ client: import("../../../structures/Client"), message: import("discord.js").Message }}
   */
  run: async ({ client, message }) => {
    return message.channel.send({
      content: "\u200b",
      components: [
        new MessageActionRow().addComponents(
          new MessageButton()
            .setStyle("LINK")
            .setLabel("Vote")
            .setURL(`https://top.gg/bot/${client.user.id}/vote`)
        ),
      ],
    });
  },
};
