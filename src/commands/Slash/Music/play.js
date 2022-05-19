const { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
  name: "play",
  category: "Music",
  description: "Plays your favourite songs",
  permission: "",
  usage: "<track name/url>",
  cooldown: 5,
  settings: {
    inVoiceChannel: true,
    sameVoiceChannel: true,
    activePlayer: false,
    playingPlayer: false,
    DJonly: false,
    voteRequired: false,
  },
  options: [
    {
      name: "query",
      description: "Enter the song's name or URL you want to play",
      type: 3,
      required: true,
    },
  ],
  /**
   * @param {{ client: import("../../../structures/Client"), interaction: import("discord.js").CommandInteraction, player: import("erela.js").Player }}
   */
  run: async ({ client, interaction, player, emojis }) => {
    let query = interaction.options.getString("query");
    const permissions = interaction.member.voice.channel.permissionsFor(
      client.user
    );
    if (!permissions.has(Permissions.FLAGS.VIEW_CHANNEL)) {
      return interaction.reply({
        ephemeral: true,
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
      return interaction.reply({
        ephemeral: true,
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
      return interaction.reply({
        ephemeral: true,
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
      !interaction.guild.me.voice.channel &&
      !interaction.member.voice.channel.joinable
    ) {
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${emojis.cross} I can't join your voice channel because it's full.`
            ),
        ],
      });
    }
    await interaction.deferReply();
    let res = await client.manager.search({ query }, interaction.member);
    switch (res.loadType) {
      case "LOAD_FAILED": {
        return interaction.followUp({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(`${emojis.cross} An unexpected error occured.`),
          ],
        });
      }
      case "NO_MATCHES": {
        return interaction.followUp({
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
            guild: interaction.guild.id,
            voiceChannel: interaction.member.voice.channel.id,
            textChannel: interaction.channel.id,
            volume: 100,
            selfDeafen: true,
          });
          player.set("bass", "none");
        }
        if (player.state !== "CONNECTED") player.connect();
        player.queue.add(res.tracks[0]);
        if (!player.playing || !player.queue.current) player.play();
        return interaction.followUp({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `Queued [${
                  res.tracks[0].title.length > 64
                    ? res.tracks[0].title.substr(0, 64) + "..."
                    : res.tracks[0].title
                }](${res.tracks[0].uri}) [\`${interaction.member.user.tag}\`]`
              ),
          ],
        });
      }
      case "TRACK_LOADED": {
        if (!player) {
          player = client.manager.create({
            guild: interaction.guild.id,
            voiceChannel: interaction.member.voice.channel.id,
            textChannel: interaction.channel.id,
            volume: 100,
            selfDeafen: true,
          });
          player.set("bass", "none");
        }
        if (player.state !== "CONNECTED") player.connect();
        player.queue.add(res.tracks[0]);
        if (!player.playing || !player.queue.current) player.play();
        return interaction.followUp({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `Queued [${
                  res.tracks[0].title.length > 64
                    ? res.tracks[0].title.substr(0, 64) + "..."
                    : res.tracks[0].title
                }](${res.tracks[0].uri}) [\`${interaction.member.user.tag}\`]`
              ),
          ],
        });
      }
      case "PLAYLIST_LOADED": {
        if (!player) {
          player = client.manager.create({
            guild: interaction.guild.id,
            voiceChannel: interaction.member.voice.channel.id,
            textChannel: interaction.channel.id,
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
        return interaction.followUp({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `Queued \`${res.tracks.length}\` tracks from [${
                  res.playlist.name.length > 64
                    ? res.playlist.name.substr(0, 64) + "..."
                    : res.playlist.name
                }](${query}) [\`${interaction.member.user.tag}\`]`
              ),
          ],
        });
      }
    }
  },
};
