const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "ping",
  aliases: ["latency"],
  category: "Misc",
  permission: "",
  description: "Shows the bot's latency",
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
    return message.channel
      .send({
        content: "Getting the latency...",
      })
      .then((msg) => {
        msg.edit({
          content: null,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `\`\`\`nim\nGateway Ping :: ${
                  client.ws.ping
                } ms \nREST Ping    :: ${
                  msg.createdTimestamp - message.createdTimestamp
                } ms \`\`\``
              ),
          ],
        });
      });
  },
};
