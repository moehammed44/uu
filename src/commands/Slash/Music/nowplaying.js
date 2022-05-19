const { MessageEmbed } = require("discord.js");
const { duration } = require("../../../util");

module.exports = {
  name: "nowplaying",
  category: "Music",
  permission: "",
  description: "Shows what's currently playing",
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
  run: async ({ client, interaction, player }) => {
    const progressbar = () => {
      const percentage = player.position / player.queue.current.duration;
      const progress = Math.round(25 * percentage);
      const emptyProgress = 25 - progress;
      const progressText = "▰".repeat(progress);
      const emptyProgressText = "▱".repeat(emptyProgress);
      return progressText + emptyProgressText;
    };
    return interaction.reply({
      ephemeral: true,
      embeds: [
        new MessageEmbed()
          .setColor(client.settings.embed_color)
          .setDescription(
            `🎵 **Now Playing**\n\n[${
              player.queue.current.title.length > 64
                ? player.queue.current.title.substr(0, 64) + "..."
                : player.queue.current.title
            }](${player.queue.current.uri}) - [\`${
              player.queue.current.requester.user.tag
            }\`]\n\n${progressbar()} \`[${duration(player.position)}/${duration(
              player.queue.current.duration
            )}]\``
          ),
      ],
    });
  },
};
