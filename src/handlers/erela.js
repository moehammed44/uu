const {
  MessageEmbed,
  MessageButton,
  MessageActionRow,
  Permissions,
} = require("discord.js");
const { autoplay, duration } = require("../util");
const guildSchema = require("../models/Guild");

/**
 * @param {import("../structures/Client")} client
 */

module.exports = (client) => {
  client.manager
    .on("trackStart", async (player, track) => {
      player.set("trackforautoplayfunction", track);
      if (player.get("message")) {
        let channel = client.channels.cache.get(player.textChannel);
        if (channel) {
          channel.messages.fetch(player.get("message")).then((msg) => {
            if (msg) {
              msg.delete();
            }
          });
        }
      }
      let channel = client.channels.cache.get(player.textChannel);
      if (channel) {
        try {
          channel
            .send({
              embeds: [
                new MessageEmbed()
                  .setColor(client.settings.embed_color)
                  .setDescription(
                    `▶️ **Started Playing**\n\n[${
                      track.title.length > 64
                        ? track.title.substr(0, 64) + "..."
                        : track.title
                    }](${track.uri}) - [\`${duration(track.duration)}\`] - [\`${
                      track.requester.user.tag
                    }\`]`
                  ),
              ],
              components: [
                new MessageActionRow().addComponents(
                  new MessageButton()
                    .setStyle("SECONDARY")
                    .setCustomId("previous")
                    .setEmoji("964424063273541672"),
                  new MessageButton()
                    .setStyle("SUCCESS")
                    .setCustomId("pauseandresume")
                    .setEmoji("964424063445532714"),
                  new MessageButton()
                    .setStyle("DANGER")
                    .setCustomId("stop")
                    .setEmoji("964424063315509288"),
                  new MessageButton()
                    .setStyle("SECONDARY")
                    .setCustomId("skip")
                    .setEmoji("964424063021903903")
                ),
                new MessageActionRow().addComponents(
                  new MessageButton()
                    .setStyle("PRIMARY")
                    .setCustomId("loop-track")
                    .setEmoji("964424063219040276")
                    .setLabel("Track"),
                  new MessageButton()
                    .setStyle("PRIMARY")
                    .setCustomId("loop-queue")
                    .setEmoji("964424063219040276")
                    .setLabel("Queue")
                ),
              ],
            })
            .then(async (message) => {
              player.set("message", message.id);
              let guildData = await guildSchema.findOne({ id: player.guild });
              message.createMessageComponentCollector().on("collect", (b) => {
                const member = message.guild.members.cache.get(b.user.id);
                let cross;
                if (
                  message.guild.me.permissions.has(
                    Permissions.FLAGS.USE_EXTERNAL_EMOJIS
                  ) &&
                  message.channel
                    .permissionsFor(client.user)
                    .has(Permissions.FLAGS.USE_EXTERNAL_EMOJIS) &&
                  message.guild.roles.everyone.permissions.has(
                    Permissions.FLAGS.USE_EXTERNAL_EMOJIS
                  ) &&
                  message.channel
                    .permissionsFor(client.user)
                    .has(Permissions.FLAGS.USE_EXTERNAL_EMOJIS)
                ) {
                  cross = "<:cross:944263125333573694>";
                } else {
                  cross = "❌";
                }
                if (b.customId === "previous") {
                  if (!member.voice.channel) {
                    return b.reply({
                      ephemeral: true,
                      embeds: [
                        new MessageEmbed()
                          .setColor(client.settings.embed_color)
                          .setDescription(
                            `${cross} You must be in a voice channel.`
                          ),
                      ],
                    });
                  }
                  if (
                    message.guild.me.voice.channel &&
                    !message.guild.me.voice.channel.equals(member.voice.channel)
                  ) {
                    return b.reply({
                      ephemeral: true,
                      embeds: [
                        new MessageEmbed()
                          .setColor(client.settings.embed_color)
                          .setDescription(
                            `${cross} You must be in the same voice channel as ${client.user}.`
                          ),
                      ],
                    });
                  }
                  if (guildData.djRole) {
                    let role = message.guild.roles.cache.get(guildData.djRole);
                    if (role) {
                      if (
                        !member.roles.cache.has(guildData.djRole) &&
                        !member.permissions.has(
                          Permissions.FLAGS.ADMINISTRATOR
                        ) &&
                        member.voice.channel.members.filter((m) => !m.user.bot)
                          .size !== 1 &&
                        !client.owners.includes(member.id)
                      ) {
                        return b.reply({
                          ephemeral: true,
                          embeds: [
                            new MessageEmbed()
                              .setColor(client.settings.embed_color)
                              .setDescription(
                                `${cross} You must have the <@&${guildData.djRole}> to use these buttons!`
                              ),
                          ],
                        });
                      }
                    } else {
                      guildData.djRole = null;
                      guildData.save();
                    }
                  }
                  if (!player.queue.previous) {
                    return b.reply({
                      ephemeral: true,
                      embeds: [
                        new MessageEmbed()
                          .setColor(client.settings.embed_color)
                          .setDescription(
                            `${cross} There's no previous track!`
                          ),
                      ],
                    });
                  }
                  player.queue.unshift(player.queue.previous);
                  player.stop();
                  return b
                    .reply({
                      ephemeral: false,
                      embeds: [
                        new MessageEmbed()
                          .setColor(client.settings.embed_color)
                          .setDescription(
                            `⏮️ \`${member.user.tag}\` has skipped to the previous track`
                          ),
                      ],
                    })
                    .then(() => {
                      setTimeout(() => {
                        b.deleteReply();
                      }, 5000);
                    });
                } else if (b.customId === "pauseandresume") {
                  if (!member.voice.channel) {
                    return b.reply({
                      ephemeral: true,
                      embeds: [
                        new MessageEmbed()
                          .setColor(client.settings.embed_color)
                          .setDescription(
                            `${cross} You must be in a voice channel.`
                          ),
                      ],
                    });
                  }
                  if (
                    message.guild.me.voice.channel &&
                    !message.guild.me.voice.channel.equals(member.voice.channel)
                  ) {
                    return b.reply({
                      ephemeral: true,
                      embeds: [
                        new MessageEmbed()
                          .setColor(client.settings.embed_color)
                          .setDescription(
                            `${cross} You must be in the same voice channel as ${client.user}.`
                          ),
                      ],
                    });
                  }
                  if (guildData.djRole) {
                    let role = message.guild.roles.cache.get(guildData.djRole);
                    if (role) {
                      if (
                        !member.roles.cache.has(guildData.djRole) &&
                        !member.permissions.has(
                          Permissions.FLAGS.ADMINISTRATOR
                        ) &&
                        member.voice.channel.members.filter((m) => !m.user.bot)
                          .size !== 1 &&
                        !client.owners.includes(member.id)
                      ) {
                        return b.reply({
                          ephemeral: true,
                          embeds: [
                            new MessageEmbed()
                              .setColor(client.settings.embed_color)
                              .setDescription(
                                `${cross} You must have the <@&${guildData.djRole}> to use these buttons!`
                              ),
                          ],
                        });
                      }
                    } else {
                      guildData.djRole = null;
                      guildData.save();
                    }
                  }
                  player.pause(!player.paused);
                  b.reply({
                    ephemeral: false,
                    embeds: [
                      new MessageEmbed()
                        .setColor(client.settings.embed_color)
                        .setDescription(
                          `${player.paused ? "⏸️" : "▶️"} \`${
                            member.user.tag
                          }\` has ${
                            player.paused ? "paused" : "resumed"
                          } the player`
                        ),
                    ],
                  }).then(() => {
                    setTimeout(() => {
                      b.deleteReply();
                    }, 5000);
                  });
                } else if (b.customId === "stop") {
                  if (!member.voice.channel) {
                    return b.reply({
                      ephemeral: true,
                      embeds: [
                        new MessageEmbed()
                          .setColor(client.settings.embed_color)
                          .setDescription(
                            `${cross} You must be in a voice channel.`
                          ),
                      ],
                    });
                  }
                  if (
                    message.guild.me.voice.channel &&
                    !message.guild.me.voice.channel.equals(member.voice.channel)
                  ) {
                    return b.reply({
                      ephemeral: true,
                      embeds: [
                        new MessageEmbed()
                          .setColor(client.settings.embed_color)
                          .setDescription(
                            `${cross} You must be in the same voice channel as ${client.user}.`
                          ),
                      ],
                    });
                  }
                  if (guildData.djRole) {
                    let role = message.guild.roles.cache.get(guildData.djRole);
                    if (role) {
                      if (
                        !member.roles.cache.has(guildData.djRole) &&
                        !member.permissions.has(
                          Permissions.FLAGS.ADMINISTRATOR
                        ) &&
                        member.voice.channel.members.filter((m) => !m.user.bot)
                          .size !== 1 &&
                        !client.owners.includes(member.id)
                      ) {
                        return b.reply({
                          ephemeral: true,
                          embeds: [
                            new MessageEmbed()
                              .setColor(client.settings.embed_color)
                              .setDescription(
                                `${cross} You must have the <@&${guildData.djRole}> to use these buttons!`
                              ),
                          ],
                        });
                      }
                    } else {
                      guildData.djRole = null;
                      guildData.save();
                    }
                  }
                  player.destroy();
                  return b
                    .reply({
                      ephemeral: false,
                      embeds: [
                        new MessageEmbed()
                          .setColor(client.settings.embed_color)
                          .setDescription(
                            `⏹️ \`${member.user.tag}\` has stopped the player`
                          ),
                      ],
                    })
                    .then(() => {
                      setTimeout(() => {
                        b.deleteReply();
                      }, 5000);
                    });
                } else if (b.customId === "skip") {
                  if (!member.voice.channel) {
                    return b.reply({
                      ephemeral: true,
                      embeds: [
                        new MessageEmbed()
                          .setColor(client.settings.embed_color)
                          .setDescription(
                            `${cross} You must be in a voice channel.`
                          ),
                      ],
                    });
                  }
                  if (
                    message.guild.me.voice.channel &&
                    !message.guild.me.voice.channel.equals(member.voice.channel)
                  ) {
                    return b.reply({
                      ephemeral: true,
                      embeds: [
                        new MessageEmbed()
                          .setColor(client.settings.embed_color)
                          .setDescription(
                            `${cross} You must be in the same voice channel as ${client.user}.`
                          ),
                      ],
                    });
                  }
                  if (guildData.djRole) {
                    let role = message.guild.roles.cache.get(guildData.djRole);
                    if (role) {
                      if (
                        !member.roles.cache.has(guildData.djRole) &&
                        !member.permissions.has(
                          Permissions.FLAGS.ADMINISTRATOR
                        ) &&
                        member.voice.channel.members.filter((m) => !m.user.bot)
                          .size !== 1 &&
                        !client.owners.includes(member.id)
                      ) {
                        return b.reply({
                          ephemeral: true,
                          embeds: [
                            new MessageEmbed()
                              .setColor(client.settings.embed_color)
                              .setDescription(
                                `${cross} You must have the <@&${guildData.djRole}> to use these buttons!`
                              ),
                          ],
                        });
                      }
                    } else {
                      guildData.djRole = null;
                      guildData.save();
                    }
                  }
                  player.stop();
                  return b
                    .reply({
                      ephemeral: false,
                      embeds: [
                        new MessageEmbed()
                          .setColor(client.settings.embed_color)
                          .setDescription(
                            `⏭️ \`${member.user.tag}\` has skipped the current track`
                          ),
                      ],
                    })
                    .then(() => {
                      setTimeout(() => {
                        b.deleteReply();
                      }, 5000);
                    });
                } else if (b.customId.startsWith("loop")) {
                  if (!member.voice.channel) {
                    return b.reply({
                      ephemeral: true,
                      embeds: [
                        new MessageEmbed()
                          .setColor(client.settings.embed_color)
                          .setDescription(
                            `${cross} You must be in a voice channel.`
                          ),
                      ],
                    });
                  }
                  if (
                    message.guild.me.voice.channel &&
                    !message.guild.me.voice.channel.equals(member.voice.channel)
                  ) {
                    return b.reply({
                      ephemeral: true,
                      embeds: [
                        new MessageEmbed()
                          .setColor(client.settings.embed_color)
                          .setDescription(
                            `${cross} You must be in the same voice channel as ${client.user}.`
                          ),
                      ],
                    });
                  }
                  if (guildData.djRole) {
                    let role = message.guild.roles.cache.get(guildData.djRole);
                    if (role) {
                      if (
                        !member.roles.cache.has(guildData.djRole) &&
                        !member.permissions.has(
                          Permissions.FLAGS.ADMINISTRATOR
                        ) &&
                        member.voice.channel.members.filter((m) => !m.user.bot)
                          .size !== 1 &&
                        !client.owners.includes(member.id)
                      ) {
                        return b.reply({
                          ephemeral: true,
                          embeds: [
                            new MessageEmbed()
                              .setColor(client.settings.embed_color)
                              .setDescription(
                                `${cross} You must have the <@&${guildData.djRole}> to use these buttons!`
                              ),
                          ],
                        });
                      }
                    } else {
                      guildData.djRole = null;
                      guildData.save();
                    }
                  }
                  let mode = b.customId.split("-")[1];
                  if (mode === "track") {
                    player.setTrackRepeat(!player.trackRepeat);
                    if (player.queueRepeat) player.setQueueRepeat(false);
                    b.reply({
                      ephemeral: false,
                      embeds: [
                        new MessageEmbed()
                          .setColor(client.settings.embed_color)
                          .setDescription(
                            `🔁 \`${member.user.tag}\` has ${
                              player.trackRepeat
                                ? "**enabled**"
                                : "**disabled**"
                            } track loop`
                          ),
                      ],
                    }).then(() => {
                      setTimeout(() => {
                        b.deleteReply();
                      }, 5000);
                    });
                  } else {
                    player.setQueueRepeat(!player.queueRepeat);
                    if (player.trackRepeat) player.setTrackRepeat(false);
                    b.reply({
                      ephemeral: false,
                      embeds: [
                        new MessageEmbed()
                          .setColor(client.settings.embed_color)
                          .setDescription(
                            `🔂 \`${member.user.tag}\` has ${
                              player.queueRepeat
                                ? "**enabled**"
                                : "**disabled**"
                            } queue loop`
                          ),
                      ],
                    }).then(() => {
                      setTimeout(() => {
                        b.deleteReply();
                      }, 5000);
                    });
                  }
                }
              });
            });
        } catch {}
      }
    })
    .on("playerMove", (player, _, newChannel) => {
      if (!newChannel) {
        return player.destroy();
      } else {
        player.voiceChannel = newChannel;
        if (player.paused) return;
        player.pause(true);
        setTimeout(() => {
          player.pause(false);
        }, 500);
      }
    })
    .on("queueEnd", async (player) => {
      if (player.get("autoplay")) {
        player.queue.previous = player.get("trackforautoplayfunction");
        return autoplay(client, player);
      }
      let channel = client.channels.cache.get(player.textChannel);
      if (channel) {
        channel.messages.fetch(player.get("message")).then((message) => {
          if (message) {
            message.delete();
          }
        });
      }
      player.set("bass", "none");
      let guildData = await guildSchema.findOne({ id: player.guild });
      if (
        player &&
        !player.queue.current &&
        !guildData.twentyFourSeven.enabled
      ) {
        setTimeout(() => {
          if (
            player &&
            !player.queue.current &&
            !guildData.twentyFourSeven.enabled
          ) {
            player.destroy();
          }
        }, 180000);
      }
    })
    .on("playerDestroy", async (player) => {
      let channel = client.channels.cache.get(player.textChannel);
      if (channel) {
        channel.messages.fetch(player.get("message")).then((message) => {
          if (message) {
            message.delete();
          }
        });
      }
      let guildData = await guildSchema.findOne({ id: player.guild });
      if (guildData.twentyFourSeven.enabled) {
        setTimeout(() => {
          player = client.manager.create({
            guild: player.guild,
            voiceChannel: guildData.twentyFourSeven.voiceChannel,
            textChannel: guildData.twentyFourSeven.textChannel,
            volume: 100,
            selfDeafen: true,
          });
          player.connect();
          player.set("bass", "none");
        }, 500);
      }
    })
    .on("nodeConnect", () => {
      guildSchema.find(
        { "twentyFourSeven.enabled": true },
        async (_, guilds) => {
          for (let data of guilds) {
            let evaled = await client.cluster.evalOnCluster(
              async (c, data) => {
                c.guilds.fetch(data.id).then(async (guild) => {
                  if (guild) {
                    let vc = guild.channels.cache.get(
                      data.twentyFourSeven.voiceChannel
                    );
                    if (vc) {
                      const permissions = vc.permissionsFor(c.user);
                      if (
                        !permissions.has(
                          require("discord.js").Permissions.FLAGS.VIEW_CHANNEL
                        )
                      )
                        return;
                      if (
                        !permissions.has(
                          require("discord.js").Permissions.FLAGS.CONNECT
                        )
                      )
                        return;
                      if (
                        !permissions.has(
                          require("discord.js").Permissions.FLAGS.SPEAK
                        )
                      )
                        return;
                      if (!vc.joinable) return;
                      let tc = guild.channels.cache.get(
                        data.twentyFourSeven.textChannel
                      );
                      if (tc) {
                        if (c.manager.get(guild.id)) return;
                        const player = c.manager.create({
                          guild: guild.id,
                          voiceChannel: vc.id,
                          textChannel: tc.id,
                          volume: 100,
                          selfDeafen: true,
                        });
                        player.connect();
                        player.set("bass", "none");
                      } else {
                        return { success: false, error: "channel" };
                      }
                    } else {
                      return { success: false, error: "channel" };
                    }
                  } else {
                    await require(`${process.cwd()}/models/Guild`).deleteOne({
                      id: data.id,
                    });
                  }
                });
                return { success: true };
              },
              { context: data, cluster: client.cluster.id }
            );
            if (evaled.error === "channel") {
              data.twentyFourSeven.enabled = false;
              data.twentyFourSeven.textChannel = null;
              data.twentyFourSeven.voiceChannel = null;
              data.save();
            }
          }
        }
      );
    });
};
