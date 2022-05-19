const { MessageEmbed } = require("discord.js");
const { duration } = require("../../../util");

module.exports = {
  name: "grab",
  aliases: ["save"],
  category: "Music",
  permission: "",
  description: "Saves the current track to your Direct Messages",
  usage: "",
  cooldown: 5,
  settings: {
    ownerOnly: false,
    inVoiceChannel: false,
    sameVoiceChannel: false,
    activePlayer: true,
    playingPlayer: true,
    DJonly: false,
    voteRequired: true,
  },
  /**
   * @param {{ client: import("../../../structures/Client"), message: import("discord.js").Message, player: import("erela.js").Player }}
   */
  run: async ({ client, message, player, emojis }) => {
    message.member
      .send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setAuthor({
              name: "Song Saved",
              url: "https://discord.gg/MtrfVK5yag",
              iconURL: client.settings.icon,
            })
            .setFooter({
              text: `Message from ${message.guild.name}`,
              iconURL: message.guild.iconURL({ dynamic: true }),
            })
            .setDescription(
              `[${
                player.queue.current.title.length > 64
                  ? player.queue.current.title.substr(0, 64) + "..."
                  : player.queue.current.title
              }](${player.queue.current.uri})`
            )
            .addFields(
              {
                name: "Artist",
                value: `\`${player.queue.current.author}\``,
              },
              {
                name: "Duration",
                value: player.queue.current.isStream
                  ? `\`LIVE\``
                  : `\`${duration(player.queue.current.duration)}\``,
              },
              {
                name: "Play it",
                value: `\`${client.settings.prefix}play ${player.queue.current.uri}\``,
              }
            ),
        ],
      })
      .then(() =>
        message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription("📭 Check your DMs."),
          ],
        })
      )
      .catch(() =>
        message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(`${emojis.cross} I can't DM you.`),
          ],
        })
      );
  },
};
