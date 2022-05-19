const { MessageEmbed, Permissions } = require("discord.js");
const { pagination, duration } = require("../../../util");
const playlistSchema = require("../../../models/Playlist");
const { TrackUtils } = require("erela.js");

module.exports = {
  name: "playlist",
  aliases: ["pl"],
  category: "Misc",
  permission: "",
  description: "All playlist commands",
  usage: "",
  cooldown: 5,
  settings: {
    ownerOnly: false,
    inVoiceChannel: false,
    sameVoiceChannel: false,
    activePlayer: false,
    playingPlayer: false,
    DJonly: false,
    voteRequired: false,
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
              `${emojis.cross} Invalid subcommand!\nValid subcommands: \`addcurrent\`, \`addqueue\`, \`create\`, \`delete\`, \`view\`, \`list\`, \`load\`, \`remove\`, \`shuffle\``
            ),
        ],
      });
    }
    if (args[0].toLowerCase() === "addcurrent") {
      if (!player || !player.queue.current) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(`${emojis.check} There's nothing playing.`),
          ],
        });
      }
      if (!args[1]) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.cross} Please provide the name of the playlist!`
              ),
          ],
        });
      }
      let fetchList = await playlistSchema.findOne({
        userId: message.member.id,
        name: args[1].toLowerCase(),
      });
      if (!fetchList) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(`${emojis.cross} This playlist doesn't exsists!`),
          ],
        });
      }
      await playlistSchema.updateOne(
        {
          userId: message.member.id,
          name: args[1],
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
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${emojis.check} Successfully added the current track in \`${args[1]}\``
            ),
        ],
      });
    } else if (args[0] === "addqueue") {
      if (!player || !player.queue.current) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(`${emojis.cross} There's nothing playing.`),
          ],
        });
      }
      if (!player.queue.length) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(`${emojis.cross} The queue is empty!`),
          ],
        });
      }
      if (!args[1]) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.cross} Please provide the name of the playlist!`
              ),
          ],
        });
      }
      let fetchList = await playlistSchema.findOne({
        userId: message.member.id,
        name: args[1].toLowerCase(),
      });
      if (!fetchList) {
        return message.channel.send({
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
          userId: message.member.id,
          name: args[1],
        },
        {
          $set: {
            tracks: newqueue,
          },
        }
      );
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${emojis.check} Successfully added the current queue in \`${args[0]}\``
            ),
        ],
      });
    } else if (args[0].toLowerCase() === "create") {
      if (!args[1]) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.cross} Please provide a name for the playlist!`
              ),
          ],
        });
      }
      if (args[1].toLowerCase().length > 10) {
        return message.channel.send({
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
        userId: message.member.id,
        name: args[1].toLowerCase(),
      });
      if (playlist) {
        return message.channel.send({
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
        userId: message.member.id,
      });
      if (fetchList.length >= 25) {
        return message.channel.send({
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
        if (player.queue.current) {
          tracks.push({
            title: player.queue.current.title,
            uri: player.queue.current.uri,
            isStream: player.queue.current.isStream,
            duration: player.queue.current.duration,
          });
        }
        for (const track of player.queue) {
          tracks.push({
            title: track.title,
            uri: track.uri,
            isStream: track.isStream,
            duration: track.duration,
          });
        }
        new playlistSchema({
          userId: message.member.id,
          name: args[1].toLowerCase(),
          tracks,
        }).save();
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${
                  emojis.check
                } Successfully created \`${args[1].toLowerCase()}\` and added ${
                  tracks.length === 1
                    ? `\`1\` track`
                    : `\`${tracks.length}\` tracks`
                } to it!`
              ),
          ],
        });
      } else {
        new playlistSchema({
          userId: message.member.id,
          name: args[1].toLowerCase(),
          tracks: [],
        }).save();
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${
                  emojis.check
                } Successfully created \`${args[1].toLowerCase()}\``
              ),
          ],
        });
      }
    } else if (args[0].toLowerCase() === "delete") {
      if (!args[1]) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.cross} Please provide the name of the playlist!`
              ),
          ],
        });
      }
      let fetchList = await playlistSchema.findOne({
        userId: message.member.id,
        name: args[1].toLowerCase(),
      });
      if (!fetchList) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(`${emojis.cross} This playlist doesn't exsists!`),
          ],
        });
      }
      await playlistSchema.deleteOne({
        userId: message.member.id,
        name: args[1].toLowerCase(),
      });
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${
                emojis.check
              } Successfully deleted \`${args[1].toLowerCase()}\``
            ),
        ],
      });
    } else if (args[0].toLowerCase() === "view") {
      if (!args[1]) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.cross} Please provide the name of the playlist!`
              ),
          ],
        });
      }
      let fetchList = await playlistSchema.findOne({
        userId: message.member.id,
        name: args[1].toLowerCase(),
      });
      if (!fetchList) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(`${emojis.cross} This playlist doesn't exsists!`),
          ],
        });
      }
      let tracks = fetchList.tracks;
      if (!tracks.length) {
        return message.channel.send({
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
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setAuthor({
                name: `${args[1].toLowerCase()} - (${tracks.length})`,
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
                        track.isStream ? `LIVE` : duration(track.duration)
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
                  track.isStream ? `LIVE` : duration(track.duration)
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
              name: `${args[1].toLowerCase()} - (${tracks.length})`,
              url: "https://discord.gg/88R47paNbV",
              iconURL: client.settings.icon,
            })
            .setDescription(list[i])
        );
      }
      return pagination(client, message, embeds);
    } else if (args[0].toLowerCase() === "list") {
      let fetchList = await playlistSchema.find({
        userId: message.member.id,
      });
      if (!fetchList || !fetchList.length) {
        return message.channel.send({
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
          name: `${message.member.user.username}'s playlists`,
          url: "https://discord.gg/88R47paNbV",
          iconURL: message.member.displayAvatarURL({ dynamic: true }),
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
      return message.channel.send({
        embeds: [embed],
      });
    } else if (args[0].toLowerCase() === "play") {
      if (!message.member.voice.channel) {
        return message.channel.send({
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
        message.guild.me.voice.channel &&
        !message.guild.me.voice.channel.equals(message.member.voice.channel)
      ) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.cross} You must be in the same voice channel as ${client.user}.`
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
      if (!args[1]) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.cross} Please provide the name of the playlist!`
              ),
          ],
        });
      }
      let fetchList = await playlistSchema.findOne({
        userId: message.member.id,
        name: args[1].toLowerCase(),
      });
      if (!fetchList) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(`${emojis.cross} This playlist doesn't exsists!`),
          ],
        });
      }
      if (!fetchList.tracks[0]) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(`${emojis.cross} This playlist has no tracks!`),
          ],
        });
      }
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
      for (const track of fetchList.tracks) {
        const resolvedTrack = TrackUtils.buildUnresolved(
          {
            title: track.title,
            uri: track.uri,
            isStream: track.isStream,
            duration: track.duration,
          },
          message.member
        );
        player.queue.add(resolvedTrack);
      }
      if (!player.playing || !player.queue.current) {
        player.play();
      }
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${emojis.check} Successfully loaded ${
                fetchList.tracks.length === 1
                  ? `\`1\` track`
                  : `\`${fetchList.tracks.length}\` tracks`
              } from \`${args[1].toLowerCase()}\``
            ),
        ],
      });
    } else if (args[0].toLowerCase() === "remove") {
      if (!args[1]) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.cross} Please provide the name of the playlist!`
              ),
          ],
        });
      }
      if (!args[2]) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.cross} Please provide the number of the track which you want to remove!`
              ),
          ],
        });
      }
      let fetchList = await playlistSchema.findOne({
        userId: message.member.id,
        name: args[1].toLowerCase(),
      });
      if (!fetchList) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(`${emojis.cross} This playlist doesn't exsists!`),
          ],
        });
      }
      let tracks = fetchList.tracks;
      if (
        isNaN(args[2]) ||
        (tracks.length === 1 && args[2] <= 1) ||
        args[2] > tracks.length
      ) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(`${emojis.cross} Invalid track!`),
          ],
        });
      }
      tracks.splice(args[2] - 1, 1);
      await playlistSchema.updateOne(
        {
          userId: message.member.id,
          name: args[1].toLowerCase(),
        },
        {
          $set: {
            tracks,
          },
        }
      );
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${emojis.check} Removed track \`${
                args[2] + 1
              }\` from \`${args[1].toLowerCase()}\``
            ),
        ],
      });
    } else if (args[0].toLowerCase() === "shuffle") {
      if (!args[1]) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.cross} Please provide the name of the playlist!`
              ),
          ],
        });
      }
      let fetchList = await playlistSchema.findOne({
        userId: message.member.id,
        name: args[1].toLowerCase(),
      });
      if (!fetchList) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(`${emojis.cross} This playlist doesn't exsists!`),
          ],
        });
      }
      let oldtracks = fetchList.tracks;
      if (!Array.isArray(oldtracks) || oldtracks.length < 3) {
        return message.channel.send({
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
      tracks = tracks();
      await playlistSchema.updateOne(
        {
          userId: message.member.id,
          name: args[1].toLowerCase(),
        },
        {
          $set: {
            tracks,
          },
        }
      );
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `🔀 Successfully shuffled the tracks in \`${args[1].toLowerCase()}\``
            ),
        ],
      });
    } else {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${emojis.cross} Invalid subcommand!\nValid subcommands: \`addcurrent\`, \`addqueue\`, \`create\`, \`delete\`, \`view\`, \`list\`, \`play\`, \`remove\`, \`shuffle\``
            ),
        ],
      });
    }
  },
};
