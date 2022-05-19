const { MessageEmbed } = require("discord.js");
const { formatBytes } = require("../../../util");
const moment = require("moment");
require("moment-duration-format");

module.exports = {
  name: "node",
  aliases: [],
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
   * @param {{ client: import("../../../structures/Client"), message: import("discord.js").Message }}
   */
  run: async ({ client, message }) => {
    return message.channel.send({
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
                    node.stats.memory.allocated
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
