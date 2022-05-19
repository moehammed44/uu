const { MessageButton, MessageActionRow } = require("discord.js");

module.exports = {
  name: "invite",
  aliases: ["add", "inv"],
  category: "Misc",
  permission: "",
  description: "Gives you the invite link of the bot",
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
            .setLabel("Invite")
            .setURL(
              `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=37088600&scope=bot%20applications.commands`
            )
        ),
      ],
    });
  },
};
