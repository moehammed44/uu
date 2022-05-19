const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "loop",
  category: "Music",
  permission: "",
  description: "Loops the current track or queue",
  usage: "",
  cooldown: 5,
  settings: {
    inVoiceChannel: true,
    sameVoiceChannel: true,
    activePlayer: true,
    playingPlayer: true,
    DJonly: true,
    voteRequired: true,
  },
  options: [
    {
      name: "mode",
      description: "What do you want to loop?",
      type: 3,
      required: true,
      choices: [
        { name: "Track", value: "track" },
        { name: "Queue", value: "queue" },
      ],
    },
  ],
  /**
   * @param {{ client: import("../../../structures/Client"), interaction: import("discord.js").CommandInteraction, player: import("erela.js").Player }}
   */
  run: async ({ client, interaction, player }) => {
    let mode = interaction.options.getString("mode");
    if (mode === "track") {
      player.setTrackRepeat(!player.trackRepeat);
      if (player.queueRepeat) player.setQueueRepeat(false);
      return interaction.reply({
        ephemeral: false,
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `🔁 Track loop is now ${
                player.trackRepeat ? "**enabled**" : "**disabled**"
              }`
            ),
        ],
      });
    } else if (mode === "queue") {
      player.setQueueRepeat(!player.queueRepeat);
      if (player.trackRepeat) player.setTrackRepeat(false);
      return interaction.reply({
        ephemeral: false,
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `🔁 Queue loop is now ${
                player.queueRepeat ? "**enabled**" : "**disabled**"
              }`
            ),
        ],
      });
    }
  },
};
