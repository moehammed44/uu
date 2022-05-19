const { MessageEmbed, Permissions } = require("discord.js");
const { pagination, duration } = require("../../../util");
const playlistSchema = require("../../../models/Playlist");
const { TrackUtils } = require("erela.js");

module.exports = {
  name: "playlist",
  category: "Misc",
  permission: "",
  description: "All playlist commands",
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
  options: [
    {
      name: "addcurrent",
      description: "Adds the currently playing song in your saved playlist",
      type: 1,
      options: [
        {
          name: "playlist-name",
          description: "In which playlist would you like to add the song to?",
          type: 3,
          required: true,
        },
      ],
    },
    {
      name: "addqueue",
      description: "Adds the whole queue in your saved playlist",
      type: 1,
      options: [
        {
          name: "playlist-name",
          description: "In which playlist would you like to add the queue to?",
          type: 3,
          required: true,
        },
      ],
    },
    {
      name: "create",
      description: "Creates a new saved playlist",
      type: 1,
      options: [
        {
          name: "playlist-name",
          description: "What should be the name of the playlist?",
          type: 3,
          required: true,
        },
      ],
    },
    {
      name: "delete",
      description: "Deletes your saved playlist",
      type: 1,
      options: [
        {
          name: "playlist-name",
          description: "Which playlist you would like to delete?",
          type: 3,
          required: true,
        },
      ],
    },
    {
      name: "view",
      description: "Shows all the tracks of your saved playlist",
      type: 1,
      options: [
        {
          name: "playlist-name",
          description: "Which playlist's tracks you would like to view?",
          type: 3,
          required: true,
        },
      ],
    },
    {
      name: "list",
      description: "Shows a list of your saved playlists",
      type: 1,
    },
    {
      name: "play",
      description: "To play your saved playlist",
      type: 1,
      options: [
        {
          name: "playlist-name",
          description: "Which playlist you would like to play?",
          type: 3,
          required: true,
        },
      ],
    },
    {
      name: "remove",
      description: "Removes a track from your saved playlist",
      type: 1,
      options: [
        {
          name: "playlist-name",
          description:
            "From which playlist you would like to remove the track from?",
          type: 3,
          required: true,
        },
        {
          name: "track",
          description:
            "Track's number which you would like to remove from your saved playlist",
          type: 4,
          required: true,
        },
      ],
    },
    {
      name: "shuffle",
      description: "Shuffles the tracks of your saved playlist",
      type: 1,
      options: [
        {
          name: "playlist-name",
          description: "Which playlist's tracks you would like to shuffle?",
          type: 3,
          required: true,
        },
      ],
    },
  ],
  /**
   * @param {{ client: import("../../../structures/Client"), interaction: import("discord.js").CommandInteraction }}
   */
  run: async ({ client, interaction, player, emojis }) => {
    let subcommand = interaction.options.getSubcommand();
    if (subcommand === "addcurrent") {
      if (!player || !player.queue.current) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(`${emojis.check} There's nothing playing.`),
          ],
        });
      }
      let name = interaction.options.getString("playlist-name");
      let fetchList = await playlistSchema.findOne({
        userId: interaction.member.id,
        name: name.toLowerCase(),
      });
      if (!fetchList) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(`${emojis.cross} This playlist doesn't exsists!`),
          ],
        });
      }
      await playlistSchema.updateOne(
        {
          userId: interaction.member.id,
          name: name.toLowerCase(),
        },
        {
          $push: {
            tracks: {
              title: player.queue.current.title,
              uri: player.queue.current.uri,
              isStream: player.queue.current.isStream,
              duration: player.queue.current.duration,
            },
          },
        }
      );
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${emojis.check} Successfully added the current track in \`${name}\``
            ),
        ],
      });
    } else if (subcommand === "addqueue") {
      if (!player || !player.queue.current) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(`${emojis.cross} There's nothing playing.`),
          ],
        });
      }
      if (!player.queue.length) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(`${emojis.cross} The queue is empty!`),
          ],
        });
      }
      let name = interaction.options.getString("playlist-name");
      let fetchList = await playlistSchema.findOne({
        userId: interaction.member.id,
        name: name.toLowerCase(),
      });
      if (!fetchList) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(`${emojis.cross} This playlist doesn't exsists!`),
          ],
        });
      }
      let oldtracks = fetchList.tracks;
      if (!Array.isArray(oldtracks)) oldtracks = [];
      const newtracks = [];
      for (const track of player.queue) {
        newtracks.push({
          title: track.title,
          uri: track.uri,
          isStream: track.isStream,
          duration: track.duration,
        });
      }
      let newqueue = oldtracks.concat(newtracks);
      await playlistSchema.updateOne(
        {
          userId: interaction.member.id,
          name: name.toLowerCase(),
        },
        {
          $set: {
            tracks: newqueue,
          },
        }
      );
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${emojis.check} Successfully added the current queue in \`${name}\``
            ),
        ],
      });
    } else if (subcommand === "create") {
      let name = interaction.options.getString("playlist-name");
      if (name.length > 10) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.cross} The length of the name is too long!`
              ),
          ],
        });
      }
      let playlist = await playlistSchema.findOne({
        userId: interaction.member.id,
        name: name.toLowerCase(),
      });
      if (playlist) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.cross} A playlist with this name already exsists!`
              ),
          ],
        });
      }
      let fetchList = await playlistSchema.find({
        userId: interaction.member.id,
      });
      if (fetchList.length >= 25) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.cross} You can't create any more playlists!`
              ),
          ],
        });
      }
      if (player && player.queue.current) {
        const tracks = [];
        tracks.push({
          title: player.queue.current.title,
          uri: player.queue.current.uri,
          isStream: player.queue.current.isStream,
          duration: player.queue.current.duration,
        });
        for (const track of player.queue) {
          tracks.push({
            title: track.title,
            uri: track.uri,
            isStream: track.isStream,
            duration: track.duration,
          });
        }
        new playlistSchema({
          userId: interaction.member.id,
          name: name.toLowerCase(),
          tracks,
        }).save();
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${
                  emojis.check
                } Successfully created \`${name.toLowerCase()}\` and added ${
                  tracks.length === 1
                    ? `\`1\` track`
                    : `\`${tracks.length}\` tracks`
                } to it!`
              ),
          ],
        });
      } else {
        new playlistSchema({
          userId: interaction.member.id,
          name: name.toLowerCase(),
          tracks: [],
        }).save();
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.check} Successfully created \`${name.toLowerCase()}\``
              ),
          ],
        });
      }
    } else if (subcommand === "delete") {
      let name = interaction.options.getString("playlist-name");
      let fetchList = await playlistSchema.findOne({
        userId: interaction.member.id,
        name: name.toLowerCase(),
      });
      if (!fetchList) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(`${emojis.cross} This playlist doesn't exsists!`),
          ],
        });
      }
      await playlistSchema.deleteOne({
        userId: interaction.member.id,
        name: name.toLowerCase(),
      });
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${emojis.check} Successfully deleted \`${name.toLowerCase()}\``
            ),
        ],
      });
    } else if (subcommand === "view") {
      let name = interaction.options.getString("playlist-name");
      let fetchList = await playlistSchema.findOne({
        userId: interaction.member.id,
        name: name.toLowerCase(),
      });
      if (!fetchList) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(`${emojis.cross} This playlist doesn't exsists!`),
          ],
        });
      }
      let tracks = fetchList.tracks;
      if (!tracks.length) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.cross} There are no tracks in the playlist!`
              ),
          ],
        });
      }
      if (tracks.length <= 10) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setAuthor({
                name: `${name.toLowerCase()} - (${tracks.length})`,
                url: "https://discord.gg/88R47paNbV",
                iconURL: client.settings.icon,
              })
              .setDescription(
                tracks
                  .map(
                    (track, i) =>
                      `\`${++i}.\` [${
                        track.title.length > 64
                          ? track.title.substr(0, 64) + "..."
                          : track.title
                      }](${track.uri}) - \`${
                        track.isStream ? `\`LIVE\`` : duration(track.duration)
                      }\`\n`
                  )
                  .join("\n")
              ),
          ],
        });
      }
      let list = [];
      for (let i = 0; i < tracks.length; i += 10) {
        let songs = tracks.slice(i, i + 10);
        list.push(
          songs
            .map(
              (track, index) =>
                `\`${i + ++index}.\` [${
                  track.title.length > 64
                    ? track.title.substr(0, 64) + "..."
                    : track.title
                }](${track.uri}) - \`${
                  track.isStream ? `\`LIVE\`` : duration(track.duration)
                }\`\n`
            )
            .join("\n")
        );
      }
      let limit = list.length;
      let embeds = [];
      for (let i = 0; i < limit; i++) {
        embeds.push(
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setAuthor({
              name: `${name.toLowerCase()} - (${tracks.length})`,
              url: "https://discord.gg/88R47paNbV",
              iconURL: client.settings.icon,
            })
            .setDescription(list[i])
        );
      }
      return pagination(client, interaction, embeds);
    } else if (subcommand === "list") {
      let fetchList = await playlistSchema.find({
        userId: interaction.member.id,
      });
      if (!fetchList || !fetchList.length) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(`${emojis.cross} You don't have any playlists!`),
          ],
        });
      }
      let embed = new MessageEmbed()
        .setColor(client.settings.embed_color)
        .setAuthor({
          name: `${interaction.member.user.username}'s playlists`,
          url: "https://discord.gg/88R47paNbV",
          iconURL: interaction.member.displayAvatarURL({ dynamic: true }),
        })
        .setFooter({
          text: `Total playlists: ${fetchList.length}`,
        });
      let i = 0;
      for (const item in fetchList) {
        embed.addField(
          `${++i}. ${fetchList[item].name}`,
          `**Songs:** \`${fetchList[item].tracks.length}\``,
          true
        );
      }
      return interaction.reply({
        ephemeral: true,
        embeds: [embed],
      });
    } else if (subcommand === "play") {
      if (!interaction.member.voice.channel) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.cross} You must be in a voice channel.`
              ),
          ],
        });
      }
      if (
        interaction.guild.me.voice.channel &&
        !interaction.guild.me.voice.channel.equals(
          interaction.member.voice.channel
        )
      ) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.cross} You must be in the same voice channel as ${client.user}.`
              ),
          ],
        });
      }
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
      let name = interaction.options.getString("playlist-name");
      let fetchList = await playlistSchema.findOne({
        userId: interaction.member.id,
        name: name.toLowerCase(),
      });
      if (!fetchList) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(`${emojis.cross} This playlist doesn't exsists!`),
          ],
        });
      }
      if (!fetchList.tracks[0]) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(`${emojis.cross} This playlist has no tracks!`),
          ],
        });
      }
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
      for (const track of fetchList.tracks) {
        const resolvedTrack = TrackUtils.buildUnresolved(
          {
            title: track.title,
            uri: track.uri,
            isStream: track.isStream,
            duration: track.duration,
          },
          interaction.member
        );
        player.queue.add(resolvedTrack);
      }
      if (!player.playing || !player.queue.current) {
        player.play();
      }
      return interaction.reply({
        ephemeral: false,
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${emojis.check} Successfully loaded ${
                fetchList.tracks.length === 1
                  ? `\`1\` track`
                  : `\`${fetchList.tracks.length}\` tracks`
              } from \`${name.toLowerCase()}\``
            ),
        ],
      });
    } else if (subcommand === "remove") {
      let name = interaction.options.getString("playlist-name");
      let track = interaction.options.getInteger("track");
      let fetchList = await playlistSchema.findOne({
        userId: interaction.member.id,
        name: name.toLowerCase(),
      });
      if (!fetchList) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(`${emojis.cross} This playlist doesn't exsists!`),
          ],
        });
      }
      let tracks = fetchList.tracks;
      if ((tracks.length === 1 && track <= 1) || track > tracks.length) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(`${emojis.cross} Invalid track!`),
          ],
        });
      }
      tracks.splice(track - 1, 1);
      await playlistSchema.updateOne(
        {
          userId: interaction.member.id,
          name: name.toLowerCase(),
        },
        {
          $set: {
            tracks: tracks,
          },
        }
      );
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${emojis.check} Removed track \`${
                track + 1
              }\` from \`${name.toLowerCase()}\``
            ),
        ],
      });
    } else if (subcommand === "shuffle") {
      let name = interaction.options.getString("playlist-name");
      let fetchList = await playlistSchema.findOne({
        userId: interaction.member.id,
        name: name.toLowerCase(),
      });
      if (!fetchList) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(`${emojis.cross} This playlist doesn't exsists!`),
          ],
        });
      }
      let oldtracks = fetchList.tracks;
      if (!Array.isArray(oldtracks) || oldtracks.length < 3) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.cross} The playlist must have at least \`3\` songs to shuffle it!`
              ),
          ],
        });
      }
      let tracks = () => {
        let j, x, i;
        for (i = oldtracks.length - 1; i > 0; i--) {
          j = Math.floor(Math.random() * i + 1);
          x = oldtracks[i];
          oldtracks[i] = oldtracks[j];
          oldtracks[j] = x;
        }
        return oldtracks;
      };
      await playlistSchema.updateOne(
        {
          userId: interaction.member.id,
          name: name.toLowerCase(),
        },
        {
          $set: {
            tracks,
          },
        }
      );
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `🔀 Successfully shuffled the tracks in \`${name.toLowerCase()}\``
            ),
        ],
      });
    }
  },
};
