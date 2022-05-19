const { MessageEmbed } = require("discord.js");
const { pagination, duration } = require("../../../util");

module.exports = {
  name: "queue",
  category: "Music",
  permission: "",
  description: "Shows the server's songs queue",
  usage: "",
  cooldown: 5,
  settings: {
    inVoiceChannel: false,
    sameVoiceChannel: false,
    activePlayer: true,
    playingPlayer: true,
    DJonly: false,
    voteRequired: false,
  },
  /**
   * @param {{ client: import("../../../structures/Client"), interaction: import("discord.js").CommandInteraction, player: import("erela.js").Player }}
   */
  run: async ({ client, interaction, player, emojis }) => {
    if (!player.queue.length) {
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(`${emojis.cross} Queue is empty.`),
        ],
      });
    }
    if (player.queue.length <= 10) {
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setAuthor({
              name: "Queue",
              url: "https://discord.gg/MtrfVK5yag",
              iconURL: client.settings.icon,
            })
            .setDescription(
              player.queue
                .map(
                  (track, i) =>
                    `\`${++i}.\` [${
                      track.title.length > 64
                        ? track.title.substr(0, 64) + `...`
                        : track.title
                    }](${track.uri})\n\`${
                      track.isStream
                        ? `\`LIVE\``
                        : duration(track.duration)
                    }\` • Requested By \`${track.requester.user.tag}\`\n`
                )
                .join("\n")
            ),
        ],
      });
    }
    let list = [];
    for (let i = 0; i < player.queue.length; i += 10) {
      let songs = player.queue.slice(i, i + 10);
      list.push(
        songs
          .map(
            (track, index) =>
              `\`${i + ++index}.\` [${
                track.title.length > 64
                  ? track.title.substr(0, 64) + `...`
                  : track.title
              }](${track.uri})\n\`${
                track.isStream ? `\`LIVE\`` : duration(track.duration)
              }\` • Requested By \`${track.requester.user.tag}\`\n`
          )
          .join("\n")
      );
    }
    let embeds = [];
    for (let i = 0; i < list.length; i++) {
      embeds.push(
        new MessageEmbed()
          .setColor(client.settings.embed_color)
          .setAuthor({
            name: "Queue",
            url: "https://discord.gg/TY55HZezsC",
            iconURL: client.settings.icon,
          })
          .setDescription(list[i])
      );
    }
    return pagination(client, interaction, embeds);
  },
};
