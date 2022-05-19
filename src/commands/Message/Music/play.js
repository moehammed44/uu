const { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
  name: "play",
  aliases: ["p"],
  category: "Music",
  description: "Plays your favourite songs",
  permission: "",
  usage: "<track name/url>",
  cooldown: 5,
  settings: {
    ownerOnly: false,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    activePlayer: false,
    playingPlayer: false,
    DJonly: false,
    voteRequired: false,
  },
  /**
   * @param {{ client: import("../../../structures/Client"), message: import("discord.js").Message, player: import("erela.js").Player }}
   */
  run: async ({ client, message, args, player, emojis }) => {
    const query = args.join(" ");
    if (!query) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${emojis.cross} Use the command again, and this time provide a search query.`
            ),
        ],
      });
    }
    const permissions = message.member.voice.channel.permissionsFor(
      client.user
    );
    if (!permissions.has(Permissions.FLAGS.VIEW_CHANNEL)) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${emojis.cross} I don't have the permission to **view** your voice channel`
            ),
        ],
      });
    }
    if (!permissions.has(Permissions.FLAGS.CONNECT)) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${emojis.cross} I don't have the permission to **connect** to your voice channel`
            ),
        ],
      });
    }
    if (!permissions.has(Permissions.FLAGS.SPEAK)) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${emojis.cross} I don't have the permission to **speak** in your voice channel`
            ),
        ],
      });
    }
    if (
      !message.guild.me.voice.channel &&
      !message.member.voice.channel.joinable
    ) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${emojis.cross} I can't join your voice channel because it's full.`
            ),
        ],
      });
    }
    let res = await client.manager.search({ query }, message.member);
    switch (res.loadType) {
      case "LOAD_FAILED": {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(`${emojis.cross} An unexpected error occured.`),
          ],
        });
      }
      case "NO_MATCHES": {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(`${emojis.cross} No songs found.`),
          ],
        });
      }
      case "SEARCH_RESULT": {
        if (!player) {
          player = client.manager.create({
            guild: message.guild.id,
            voiceChannel: message.member.voice.channel.id,
            textChannel: message.channel.id,
            volume: 100,
            selfDeafen: true,
          });
          player.set("bass", "none");
        }
        if (player.state !== "CONNECTED") player.connect();
        player.queue.add(res.tracks[0]);
        if (!player.playing || !player.queue.current) {
          return player.play();
        } else {
          return message.channel.send({
            embeds: [
              new MessageEmbed()
                .setColor(client.settings.embed_color)
                .setDescription(
                  `Queued [${
                    res.tracks[0].title.length > 64
                      ? res.tracks[0].title.substr(0, 64) + "..."
                      : res.tracks[0].title
                  }](${res.tracks[0].uri}) [\`${message.member.user.tag}\`]`
                ),
            ],
          });
        }
      }
      case "TRACK_LOADED": {
        if (!player) {
          player = client.manager.create({
            guild: message.guild.id,
            voiceChannel: message.member.voice.channel.id,
            textChannel: message.channel.id,
            volume: 100,
            selfDeafen: true,
          });
          player.set("bass", "none");
        }
        if (player.state !== "CONNECTED") player.connect();
        player.queue.add(res.tracks[0]);
        if (!player.playing || !player.queue.current) {
          return player.play();
        } else {
          return message.channel.send({
            embeds: [
              new MessageEmbed()
                .setColor(client.settings.embed_color)
                .setDescription(
                  `Queued [${
                    res.tracks[0].title.length > 64
                      ? res.tracks[0].title.substr(0, 64) + "..."
                      : res.tracks[0].title
                  }](${res.tracks[0].uri}) [\`${message.member.user.tag}\`]`
                ),
            ],
          });
        }
      }
      case "PLAYLIST_LOADED": {
        if (!player) {
          player = client.manager.create({
            guild: message.guild.id,
            voiceChannel: message.member.voice.channel.id,
            textChannel: message.channel.id,
            volume: 100,
            selfDeafen: true,
          });
          player.set("bass", "none");
        }
        if (player.state !== "CONNECTED") player.connect();
        player.queue.add(res.tracks);
        if (
          (!player.playing || !player.queue.current) &&
          player.queue.totalSize === res.tracks.length
        )
          player.play();
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `Queued **${res.tracks.length}** tracks from [${
                  res.playlist.name.length > 64
                    ? res.playlist.name.substr(0, 64) + "..."
                    : res.playlist.name
                }](${query}) [\`${message.member.user.tag}\`]`
              ),
          ],
        });
      }
    }
  },
};
