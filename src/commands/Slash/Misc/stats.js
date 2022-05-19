const { MessageEmbed, Permissions, version } = require("discord.js");
const { formatBytes } = require("../../../util");
const cpuStat = require("cpu-stat");

module.exports = {
  name: "stats",
  category: "Misc",
  permission: "",
  description: "Shows the bot's statistics",
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
    return Promise.all([
      client.cluster.fetchClientValues("channels.cache.size"),
      client.cluster.fetchClientValues("guilds.cache.size"),
      client.cluster.evalOnManager("process.memoryUsage().rss"),
      client.cluster.broadcastEval((c) =>
        c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)
      ),
    ]).then(([channels, guilds, memoryUsage, users]) => {
      return cpuStat.usagePercent((err, percent) => {
        if (err) {
          return console.log(err);
        }
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setAuthor({
                name: "My Statistics",
                url: "https://discord.gg/88R47paNbV",
                iconURL: client.settings.icon,
              })
              .setThumbnail(client.settings.icon)
              .addFields(
                {
                  name: `🏓 Ping`,
                  value: `• \`${Math.round(client.ws.ping)} ms\``,
                  inline: true,
                },
                {
                  name: "🕐 Up since",
                  value: `• <t:${(
                    Date.now() / 1000 -
                    client.uptime / 1000
                  ).toFixed()}:R>`,
                  inline: true,
                },
                {
                  name: `🗄️ Memory`,
                  value: `• \`${formatBytes(memoryUsage)}\``,
                  inline: true,
                },
                {
                  name: "🏘️ Servers",
                  value: `• \`${guilds.reduce((a, b) => a + b, 0)}\``,
                  inline: true,
                },
                {
                  name: "👥 Users",
                  value: `• \`${users.reduce((a, b) => a + b, 0)}\``,
                  inline: true,
                },
                {
                  name: "📁 Channels",
                  value: `• \`${channels.reduce((a, b) => a + b, 0)}\``,
                  inline: true,
                },
                {
                  name: `🔋CPU`,
                  value: `• \`${percent.toFixed(2)}%\``,
                  inline: true,
                },
                {
                  name: `📘 Discord.js`,
                  value: `• \`v${version}\``,
                  inline: true,
                },
                {
                  name: `📗 Node`,
                  value: `• \`${process.version}\``,
                  inline: true,
                }
              ),
          ],
        });
      });
    });
  },
};
