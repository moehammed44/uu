const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "loop",
  aliases: ["l", "repeat"],
  category: "Music",
  permission: "",
  description: "Loops the current track or queue",
  usage: "",
  cooldown: 5,
  settings: {
    ownerOnly: false,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    activePlayer: true,
    playingPlayer: true,
    DJonly: true,
    voteRequired: true,
  },
  /**
   * @param {{ client: import("../../../structures/Client"), message: import("discord.js").Message, player: import("erela.js").Player }}
   */
  run: async ({ client, message, args, player, emojis }) => {
    if (!args[0]) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${emojis.cross} Invalid loop method!\nValid methods: \`track\`, \`queue\``
            ),
        ],
      });
    }
    if (
      args[0].toLowerCase() === "song" ||
      args[0].toLowerCase() === "s" ||
      args[0].toLowerCase() === "track" ||
      args[0].toLowerCase() === "t"
    ) {
      player.setTrackRepeat(!player.trackRepeat);
      if (player.queueRepeat) player.setQueueRepeat(false);
      return message.channel.send({
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
    } else if (
      args[0].toLowerCase() === "queue" ||
      args[0].toLowerCase() === "q"
    ) {
      player.setQueueRepeat(!player.queueRepeat);
      if (player.trackRepeat) player.setTrackRepeat(false);
      return message.channel.send({
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
    } else {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${emojis.cross} Invalid loop method!\nValid methods: \`track\`, \`queue\``
            ),
        ],
      });
    }
  },
};
