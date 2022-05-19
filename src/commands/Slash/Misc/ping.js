const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "ping",
  category: "Misc",
  permission: "",
  description: "Shows the bot's latency",
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
   * @param {{ client: import("../../../structures/Client"), interaction: import("discord.js").CommandInteraction }}
   */
  run: async ({ client, interaction }) => {
    return interaction
      .reply({
        ephemeral: true,
        fetchReply: true,
        content: "Getting the latency...",
      })
      .then((msg) => {
        interaction?.editReply({
          content: null,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `\`\`\`nim\nGateway Ping :: ${
                  client.ws.ping
                } ms \nREST Ping    :: ${
                  msg.createdTimestamp - interaction.createdTimestamp
                } ms \`\`\``
              ),
          ],
        });
      });
  },
};
