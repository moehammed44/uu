const {
  Collection,
  CommandInteraction,
  MessageComponentInteraction,
  MessageEmbed,
  MessageButton,
  MessageActionRow,
  Permissions,
} = require("discord.js");
const prettyMilliseconds = require("pretty-ms");

module.exports = class Util {
  static async autoplay(client, player) {
    const track = player.get("trackforautoplayfunction");
    const url = `https://www.youtube.com/watch?v=${track.identifier}&list=RD${track.identifier}`;
    let res = await player.search(url, client);
    if (
      !res ||
      res.loadType === "LOAD_FAILED" ||
      res.loadType === "NO_MATCHES" ||
      res.loadType !== "PLAYLIST_LOADED"
    ) {
      try {
        client.channels.cache.get(player.textChannel).send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${
                  client.guilds.cache
                    .get(player.guild)
                    .me.permissions.has(
                      Permissions.FLAGS.USE_EXTERNAL_EMOJIS
                    ) &&
                  client.channels.cache
                    .get(player.textChannel)
                    .permissionsFor(client.user)
                    .has(Permissions.FLAGS.USE_EXTERNAL_EMOJIS) &&
                  client.guilds.cache
                    .get(player.guild)
                    .roles.everyone.permissions.has(
                      Permissions.FLAGS.USE_EXTERNAL_EMOJIS
                    ) &&
                  client.channels.cache
                    .get(player.textChannel)
                    .permissionsFor(
                      client.guilds.cache.get(player.guild).roles.everyone
                    )
                    .has(Permissions.FLAGS.USE_EXTERNAL_EMOJIS)
                    ? "<:cross:944263125333573694>"
                    : "❌"
                } Unable to autoplay from the previous track. Destroyed the player.`
              ),
          ],
        });
      } catch {}
      return player.destroy();
    } else {
      player.queue.add(
        res.tracks[Math.floor(Math.random() * Math.floor(res.tracks.length))]
      );
      return player.play();
    }
  }

  static cooldown(client, member, command) {
    if (!client.cooldowns.has(command.name)) {
      client.cooldowns.set(command.name, new Collection());
    }
    const timestamps = client.cooldowns.get(command.name);
    const cooldownAmount = command.cooldown * 1000;
    if (timestamps.has(member)) {
      const expirationTime = timestamps.get(member) + cooldownAmount;
      if (Date.now() < expirationTime) {
        const timeLeft = (expirationTime - Date.now()) / 1000;
        return Math.round(timeLeft) + 1 === 1
          ? "a second"
          : `${Math.round(timeLeft) + 1} seconds`;
      } else {
        timestamps.set(member, Date.now());
        setTimeout(() => timestamps.delete(member), cooldownAmount);
      }
    } else {
      timestamps.set(member, Date.now());
      setTimeout(() => timestamps.delete(member), cooldownAmount);
    }
  }

  static duration(ms) {
    return prettyMilliseconds(ms, {
      colonNotation: true,
      secondsDecimalDigits: 0,
    });
  }

  static formatBytes(bytes) {
    if (bytes === 0) return "0 B";
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    return `${(
      bytes / Math.pow(1024, Math.floor(Math.log(bytes) / Math.log(1024)))
    ).toFixed(2)} ${sizes[Math.floor(Math.log(bytes) / Math.log(1024))]}`;
  }

  static async getChannel(client, channelId) {
    let channels = await client.cluster.broadcastEval(
      (c, ctx) => {
        let channel =
          c.channels.cache.get(ctx) || c.channels.fetch(ctx).catch(() => {});
        if (channel) {
          return channel;
        } else {
          return null;
        }
      },
      { context: channelId }
    );
    for (let i = 0; i < channels.length; i++) {
      if (channels[i]) return channels[i];
    }
  }

  static async getGuild(client, guildId) {
    let guilds = await client.cluster.broadcastEval(
      (c, ctx) => {
        let guild =
          c.guilds.cache.get(ctx) || c.guilds.fetch(ctx).catch(() => {});
        if (guild) {
          return guild;
        } else {
          return null;
        }
      },
      { context: guildId }
    );
    for (let i = 0; i < guilds.length; i++) {
      if (guilds[i]) return guilds[i];
    }
  }

  static async getUser(client, userId) {
    let users = await client.cluster.broadcastEval(
      (c, ctx) => {
        let user = c.users.cache.get(ctx) || c.users.fetch(ctx).catch(() => {});
        if (user) {
          return user;
        } else {
          return null;
        }
      },
      { context: userId }
    );
    for (let i = 0; i < users.length; i++) {
      if (users[i]) return users[i];
    }
  }

  static async pagination(ctx, embeds) {
    let currentPage = 0;
    if (
      ctx instanceof CommandInteraction ||
      ctx instanceof MessageComponentInteraction
    ) {
      ctx
        .reply({
          ephemeral: true,
          fetchReply: true,
          embeds: [
            new MessageEmbed(embeds[0]).setFooter({
              text: `Page 1/${embeds.length}`,
            }),
          ],
          components: [
            new MessageActionRow().addComponents(
              new MessageButton()
                .setStyle("SECONDARY")
                .setCustomId("1")
                .setLabel("First")
                .setDisabled(true),
              new MessageButton()
                .setStyle("SECONDARY")
                .setCustomId("2")
                .setLabel("Back")
                .setDisabled(true),
              new MessageButton()
                .setStyle("SECONDARY")
                .setCustomId("3")
                .setLabel("Next"),
              new MessageButton()
                .setStyle("SECONDARY")
                .setCustomId("4")
                .setLabel("Last")
            ),
          ],
        })
        .then((message) => {
          const collector = message.createMessageComponentCollector({
            time: 300000,
          });
          collector.on("collect", (b) => {
            if (b.user.id !== ctx.member.id) {
              return b.reply({
                ephemeral: true,
                content: "These buttons are not for you.",
              });
            }
            b.deferUpdate();
            switch (b.customId) {
              case "1": {
                currentPage = 0;
                return ctx.editReply({
                  embeds: [
                    new MessageEmbed(embeds[currentPage]).setFooter({
                      text: `Page 1/${embeds.length}`,
                    }),
                  ],
                  components: [
                    new MessageActionRow().addComponents(
                      message.components[0].components[0].setDisabled(true),
                      message.components[0].components[1].setDisabled(true),
                      message.components[0].components[2].setDisabled(false),
                      message.components[0].components[3].setDisabled(false)
                    ),
                  ],
                });
              }
              case "2": {
                --currentPage;
                return ctx.editReply({
                  embeds: [
                    new MessageEmbed(embeds[currentPage]).setFooter({
                      text: `Page ${currentPage + 1}/${embeds.length}`,
                    }),
                  ],
                  components: [
                    currentPage === 0
                      ? new MessageActionRow().addComponents(
                          message.components[0].components[0].setDisabled(true),
                          message.components[0].components[1].setDisabled(true),
                          message.components[0].components[2].setDisabled(
                            false
                          ),
                          message.components[0].components[3].setDisabled(false)
                        )
                      : new MessageActionRow().addComponents(
                          ...message.components[0].components.map((c) =>
                            c.setDisabled(false)
                          )
                        ),
                  ],
                });
              }
              case "3": {
                currentPage++;
                return ctx.editReply({
                  embeds: [
                    new MessageEmbed(embeds[currentPage]).setFooter({
                      text: `Page ${currentPage + 1}/${embeds.length}`,
                    }),
                  ],
                  components: [
                    currentPage === embeds.length - 1
                      ? new MessageActionRow().addComponents(
                          message.components[0].components[0].setDisabled(
                            false
                          ),
                          message.components[0].components[1].setDisabled(
                            false
                          ),
                          message.components[0].components[2].setDisabled(true),
                          message.components[0].components[3].setDisabled(true)
                        )
                      : new MessageActionRow().addComponents(
                          ...message.components[0].components.map((c) =>
                            c.setDisabled(false)
                          )
                        ),
                  ],
                });
              }
              case "3": {
                currentPage++;
                return ctx.editReply({
                  embeds: [
                    new MessageEmbed(embeds[currentPage]).setFooter({
                      text: `Page ${currentPage + 1}/${embeds.length}`,
                    }),
                  ],
                  components: [
                    new MessageActionRow().addComponents(
                      message.components[0].components[0].setDisabled(false),
                      message.components[0].components[1].setDisabled(false),
                      message.components[0].components[2].setDisabled(true),
                      message.components[0].components[3].setDisabled(true)
                    ),
                  ],
                });
              }
            }
            collector.on("end", () => {
              return ctx?.editReply({
                components: [
                  new MessageActionRow().addComponents(
                    ...message?.components[0].components.map((c) =>
                      c.setDisabled(true)
                    )
                  ),
                ],
              });
            });
          });
        });
    } else {
      ctx.channel
        .send({
          embeds: [
            new MessageEmbed(embeds[0]).setFooter({
              text: `Page 1/${embeds.length}`,
            }),
          ],
          components: [
            new MessageActionRow().addComponents(
              new MessageButton()
                .setStyle("SECONDARY")
                .setCustomId("1")
                .setLabel("First")
                .setDisabled(true),
              new MessageButton()
                .setStyle("SECONDARY")
                .setCustomId("2")
                .setLabel("Back")
                .setDisabled(true),
              new MessageButton()
                .setStyle("SECONDARY")
                .setCustomId("3")
                .setLabel("Next"),
              new MessageButton()
                .setStyle("SECONDARY")
                .setCustomId("4")
                .setLabel("Last")
            ),
          ],
        })
        .then((message) => {
          const collector = message.createMessageComponentCollector({
            time: 300000,
          });
          collector.on("collect", (b) => {
            if (b.user.id !== ctx.member.id) {
              return b.reply({
                ephemeral: true,
                content: "These buttons are not for you.",
              });
            }
            b.deferUpdate();
            switch (b.customId) {
              case "1": {
                currentPage = 0;
                return message.edit({
                  embeds: [
                    new MessageEmbed(embeds[currentPage]).setFooter({
                      text: `Page 1/${embeds.length}`,
                    }),
                  ],
                  components: [
                    new MessageActionRow().addComponents(
                      message.components[0].components[0].setDisabled(true),
                      message.components[0].components[1].setDisabled(true),
                      message.components[0].components[2].setDisabled(false),
                      message.components[0].components[3].setDisabled(false)
                    ),
                  ],
                });
              }
              case "2": {
                --currentPage;
                return message.edit({
                  embeds: [
                    new MessageEmbed(embeds[currentPage]).setFooter({
                      text: `Page ${currentPage + 1}/${embeds.length}`,
                    }),
                  ],
                  components: [
                    currentPage === 0
                      ? new MessageActionRow().addComponents(
                          message.components[0].components[0].setDisabled(true),
                          message.components[0].components[1].setDisabled(true),
                          message.components[0].components[2].setDisabled(
                            false
                          ),
                          message.components[0].components[3].setDisabled(false)
                        )
                      : new MessageActionRow().addComponents(
                          ...message.components[0].components.map((c) =>
                            c.setDisabled(false)
                          )
                        ),
                  ],
                });
              }
              case "3": {
                currentPage++;
                return message.edit({
                  embeds: [
                    new MessageEmbed(embeds[currentPage]).setFooter({
                      text: `Page ${currentPage + 1}/${embeds.length}`,
                    }),
                  ],
                  components: [
                    currentPage === embeds.length - 1
                      ? new MessageActionRow().addComponents(
                          message.components[0].components[0].setDisabled(
                            false
                          ),
                          message.components[0].components[1].setDisabled(
                            false
                          ),
                          message.components[0].components[2].setDisabled(true),
                          message.components[0].components[3].setDisabled(true)
                        )
                      : new MessageActionRow().addComponents(
                          ...message.components[0].components.map((c) =>
                            c.setDisabled(false)
                          )
                        ),
                  ],
                });
              }
              case "3": {
                currentPage++;
                return message.edit({
                  embeds: [
                    new MessageEmbed(embeds[currentPage]).setFooter({
                      text: `Page ${currentPage + 1}/${embeds.length}`,
                    }),
                  ],
                  components: [
                    new MessageActionRow().addComponents(
                      message.components[0].components[0].setDisabled(false),
                      message.components[0].components[1].setDisabled(false),
                      message.components[0].components[2].setDisabled(true),
                      message.components[0].components[3].setDisabled(true)
                    ),
                  ],
                });
              }
            }
          });
          collector.on("end", () => {
            return message?.edit({
              components: [
                new MessageActionRow().addComponents(
                  ...message?.components[0].components.map((c) =>
                    c.setDisabled(true)
                  )
                ),
              ],
            });
          });
        });
    }
  }
  static trimArray(array, maxLen = 10) {
    if (array.length > maxLen) {
      const len = array.length - maxLen;
      array = array.slice(0, maxLen);
      array.push(`\nAnd **${len}** more...`);
    }
    return array.join("\n");
  }
};
