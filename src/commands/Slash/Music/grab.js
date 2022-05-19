const { MessageEmbed } = require("discord.js");
const { duration } = require("../../../util");

module.exports = {
  name: "grab",
  category: "Music",
  permission: "",
  description: "Saves the current track to your Direct Messages",
  usage: "",
  cooldown: 5,
  settings: {
    inVoiceChannel: false,
    sameVoiceChannel: false,
    activePlayer: true,
    playingPlayer: true,
    DJonly: false,
    voteRequired: true,
  },
  /**
   * @param {{ client: import("../../../structures/Client"), interaction: import("discord.js").CommandInteraction, player: import("erela.js").Player }}
   */
  run: async ({ client, interaction, player, emojis }) => {
    interaction.member
      .send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setAuthor({
              name: "Song Saved",
              url: "https://discord.gg/88R47paNbV",
              iconURL: client.settings.icon,
            })
            .setFooter({
              text: `Message from ${interaction.guild.name}`,
              iconURL: interaction.guild.iconURL({ dynamic: true }),
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
      .then(() => {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription("📭 Check your DMs."),
          ],
        });
      })
      .catch(() => {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(`${emojis.cross} I can't DM you.`),
          ],
        });
      });
  },
};
