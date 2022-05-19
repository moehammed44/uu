const { MessageEmbed } = require("discord.js");
const { formatBytes } = require("../../../util");
const moment = require("moment");
require("moment-duration-format");

module.exports = {
  name: "node",
  category: "Misc",
  permission: "",
  description: "Shows the audio node's statistics",
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
   * @param {{ client: import("../../../structures/Client"), interaction: import("discord.js").CommandInteraction }}
   */
  run: async ({ client, interaction }) => {
    return interaction.reply({
      ephemeral: true,
      embeds: [
        new MessageEmbed()
          .setColor(client.settings.embed_color)
          .setAuthor({
            name: "Node Statistics",
            url: "https://discord.gg/88R47paNbV",
          })
          .setDescription(
            `\`\`\`nim\n${client.manager.nodes
              .map(
                (node) =>
                  `Node         :: ${node.connected ? "🟢" : "🔴"} ${
                    node.options.identifier
                  }
Memory Usage :: ${formatBytes(
                    node.stats.memory.reservable
                  )} - ${node.stats.cpu.lavalinkLoad.toFixed(2)}%
Connections  :: ${client.manager.players.size}
Uptime       :: ${moment(node.stats.uptime).format(
                    "D[ days], H[ hours], M[ minutes], S[ seconds]"
                  )}`
              )
              .join(
                "\n\n------------------------------------------------------------\n\n"
              )}\`\`\``
          ),
      ],
    });
  },
};
