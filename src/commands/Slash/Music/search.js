const {
  MessageEmbed,
  MessageSelectMenu,
  MessageActionRow,
  Permissions,
} = require("discord.js");

module.exports = {
  name: "search",
  category: "Music",
  permission: "",
  description: "Searches a song",
  usage: "<track name>",
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
  options: [
    {
      name: "query",
      description: "Enter the song's name you want to search",
      type: 3,
      required: true,
    },
  ],
  /**
   * @param {{ client: import("../../../structures/Client"), interaction: import("discord.js").CommandInteraction, player: import("erela.js").Player }}
   */
  run: async ({ client, interaction, player, emojis }) => {
    const search = interaction.options.getString("query");
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
    let res = await client.manager.search(search, interaction.member);
    switch (res.loadType) {
      case "LOAD_FAILED": {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(`${emojis.cross} An unexpected error occured.`),
          ],
        });
      }
      case "NO_MATCHES": {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(`${emojis.cross} No songs found.`),
          ],
        });
      }
      case "PLAYLIST_LOADED": {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.cross} Please use the \`/play\` command to play tracks from a playlist.`
              ),
          ],
        });
      }
    }
    let emojiarray = [
      "1️⃣",
      "2️⃣",
      "3️⃣",
      "4️⃣",
      "5️⃣",
      "6️⃣",
      "7️⃣",
      "8️⃣",
      "9️⃣",
      "🔟",
    ];
    let songoptions = [
      emojiarray.map((emoji, index) => {
        return {
          value: `${index}`,
          label: res.tracks[index].title,
          description: res.tracks[index].author,
          emoji,
        };
      }),
    ];
    let selection = new MessageSelectMenu()
      .setCustomId("search")
      .setPlaceholder("Nothing selected")
      .setMaxValues(10)
      .addOptions(songoptions);
    let trackstoadd = [];
    interaction
      .reply({
        ephemeral: false,
        fetchReply: true,
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              "Select the tracks you want to add to the queue by the menu below."
            ),
        ],
        components: [new MessageActionRow().addComponents(selection)],
      })
      .then((msg) => {
        msg
          .createMessageComponentCollector({ time: 90000 })
          .on("collect", (menu) => {
            if (menu.user.id !== interaction.member.id) {
              return menu.reply({
                ephemeral: true,
                content: "This menu is not for you.",
              });
            }
            if (!interaction.member.voice.channel) {
              return menu.reply({
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
              return menu.reply({
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
            menu.deferUpdate();
            for (const value of menu.values) {
              trackstoadd.push(res.tracks[value]);
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
            player.queue.add(trackstoadd);
            if (!player.playing || !player.queue.current) player.play();
            msg.edit({
              components: [],
              embeds: [
                new MessageEmbed()
                  .setColor(client.settings.embed_color)
                  .setDescription(
                    `Queued ${
                      trackstoadd.length === 1
                        ? `[${
                            res.tracks[menu.values[0]].title.length > 64
                              ? res.tracks[menu.values[0]].title.substr(0, 64) +
                                "..."
                              : res.tracks[menu.values[0]].title
                          }](${res.tracks[menu.values[0]].uri}) [\`${
                            interaction.member.user.tag
                          }\`]`
                        : `**${trackstoadd.length}** tracks`
                    }`
                  ),
              ],
            });
          });
      });
  },
};
