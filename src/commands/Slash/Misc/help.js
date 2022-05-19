const {
  MessageEmbed,
  MessageButton,
  MessageActionRow,
  Permissions,
} = require("discord.js");

module.exports = {
  name: "help",
  category: "Misc",
  permission: "",
  description: "Shows all the bot's commands",
  usage: "[command]",
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
      name: "command",
      description: "Command's name",
      type: 3,
      required: false,
    },
  ],
  /**
   * @param {{ client: import("../../../structures/Client"), interaction: import("discord.js").CommandInteraction }}
   */
  run: async ({ client, interaction, emojis }) => {
    let cmd = interaction.options.getString("command");
    if (!cmd) {
      let commands;
      return interaction
        .reply({
          ephemeral: true,
          fetchReply: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setAuthor({
                name: `${client.user.username} Help`,
                url: "https://discord.gg/88R47paNbV",
              })
              .setFooter({
                text: `Requested by ${interaction.member.user.tag}`,
                iconURL: interaction.member.displayAvatarURL(),
              })
              .setTimestamp()
              .setDescription(`Hello ${interaction.member}, I am ${client.user}

I am an all in one music bot, with YouTube & Spotify support! Find out what I can do using the buttons below, or join our [support server](https://discord.gg/88R47paNbV) for more help!

Music \`:\` *List of music related commands*
Misc \`:\` *List of bot's miscellaneous commands*
Config \`:\` *List of commands to configure ${client.user.username}*

Use the buttons below to select a category!

[✨ Support Server](https://discord.gg/88R47paNbV) | [Invite ${client.user.username}](https://discord.com/oauth2/authorize?client_id=945411538985046167&permissions=2205281600&scope=bot%20applications.commands)`),
          ],
          components: [
            new MessageActionRow().addComponents(
              new MessageButton()
                .setStyle("SUCCESS")
                .setLabel("Home")
                .setCustomId("home"),
              new MessageButton()
                .setStyle("PRIMARY")
                .setLabel("Music")
                .setCustomId("music"),
              new MessageButton()
                .setStyle("PRIMARY")
                .setLabel("Misc")
                .setCustomId("misc"),
              new MessageButton()
                .setStyle("PRIMARY")
                .setLabel("Config")
                .setCustomId("config")
            ),
          ],
        })
        .then((msg) => {
          const collector = msg.createMessageComponentCollector({
            time: 60000,
          });
          collector.on("collect", (b) => {
            if (b.customId === "home") {
              b.deferUpdate();
              return interaction.editReply({
                embeds: [
                  new MessageEmbed()
                    .setColor(client.settings.embed_color)
                    .setAuthor({
                      name: `${client.user.username} Help`,
                      url: "https://discord.gg/88R47paNbV",
                    })
                    .setFooter({
                      text: `Requested by ${interaction.member.user.tag}`,
                      iconURL: interaction.member.displayAvatarURL(),
                    })
                    .setTimestamp()
                    .setDescription(`Hello ${interaction.member}, I am ${client.user}

I am an all in one music bot, with YouTube & Spotify support! Find out what I can do using the buttons below, or join our [support server](https://discord.gg/88R47paNbV) for more help!

Music \`:\` *List of music related commands*
Misc \`:\` *List of bot's miscellaneous commands*
Config \`:\` *List of commands to configure ${client.user.username}*

Use the buttons below to select a category!

[✨ Support Server](https://discord.gg/88R47paNbV) | [Invite ${client.user.username}](https://discord.com/oauth2/authorize?client_id=945411538985046167&permissions=2205281600&scope=bot%20applications.commands)`),
                ],
                components: [
                  new MessageActionRow().addComponents(
                    new MessageButton()
                      .setStyle("SUCCESS")
                      .setLabel("Home")
                      .setCustomId("home"),
                    new MessageButton()
                      .setStyle("PRIMARY")
                      .setLabel("Music")
                      .setCustomId("music"),
                    new MessageButton()
                      .setStyle("PRIMARY")
                      .setLabel("Misc")
                      .setCustomId("misc"),
                    new MessageButton()
                      .setStyle("PRIMARY")
                      .setLabel("Config")
                      .setCustomId("config")
                  ),
                ],
              });
            } else if (b.customId === "music") {
              b.deferUpdate();
              commands = client.slscommands
                .filter((c) => c.category === "Music")
                .map((c) => `\`${c.name}\``);
              return interaction.editReply({
                embeds: [
                  new MessageEmbed()
                    .setColor(client.settings.embed_color)
                    .setAuthor({
                      name: "Music Commands",
                      url: "https://discord.gg/88R47paNbV",
                    })
                    .setFooter({
                      text: `Total ${commands.length} music commands.`,
                    })
                    .setDescription(commands.join(", ")),
                ],
              });
            } else if (b.customId === "misc") {
              b.deferUpdate();
              commands = client.slscommands
                .filter((c) => c.category === "Misc")
                .map((c) => `\`${c.name}\``);
              return interaction.editReply({
                embeds: [
                  new MessageEmbed()
                    .setColor(client.settings.embed_color)
                    .setAuthor({
                      name: "Misc Commands",
                      url: "https://discord.gg/88R47paNbV",
                    })
                    .setFooter({
                      text: `Total ${commands.length} misc commands.`,
                    })
                    .setDescription(commands.join(", ")),
                ],
              });
            } else if (b.customId === "config") {
              b.deferUpdate();
              commands = client.slscommands
                .filter((c) => c.category === "Config")
                .map((c) => `\`${c.name}\``);
              return interaction.editReply({
                embeds: [
                  new MessageEmbed()
                    .setColor(client.settings.embed_color)
                    .setAuthor({
                      name: "Config Commands",
                      url: "https://discord.gg/88R47paNbV",
                    })
                    .setFooter({
                      text: `Total ${commands.length} config commands.`,
                    })
                    .setDescription(commands.join(", ")),
                ],
              });
            }
          });
          collector.on("end", () => {
            return interaction?.editReply({
              components: [
                new MessageActionRow().addComponents(
                  ...msg?.components[0].components.map((c) =>
                    c.setDisabled(true)
                  )
                ),
              ],
            });
          });
        });
    }
    let command = client.slscommands.get(cmd);
    if (!command) {
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(`${emojis.cross} Unable to find that command!`),
        ],
      });
    }
    let usage = `/${command.name} ${command.usage ? command.usage : ""}`;
    if (cmd.toLowerCase() === "playlist") {
      usage = `/playlist addcurrent <playlist-name>,
/playlist addqueue <playlist-name>,
/playlist create <playlist-name>,
/playlist delete <playlist-name>,
/playlist view <playlist-name>,
/playlist list,
/playlist load <playlist-name>,
/playlist remove <playlist-name> <track-number>,
/playlist shuffle <playlist-name>`;
    }
    return interaction.reply({
      ephemeral: true,
      embeds: [
        new MessageEmbed()
          .setColor(client.settings.embed_color)
          .setFooter({ text: `Join our support server for more help` })
          .setDescription(
            `\`\`\`fix
- [] = Optional
- <> = Required
- Do not type these when using commands!
\`\`\``
          )
          .addFields(
            {
              name: "Name",
              value: `\`\`\`${command.name}\`\`\``,
              inline: true,
            },
            {
              name: "Description",
              value: `\`\`\`${command.description}\`\`\``,
              inline: true,
            },
            {
              name: "Category",
              value: `\`\`\`${command.category}\`\`\``,
              inline: true,
            },
            {
              name: "Usage",
              value: `\`\`\`${usage}\`\`\``,
              inline: true,
            },
            {
              name: "Cooldown",
              value: `\`\`\`${command.cooldown} seconds\`\`\``,
              inline: true,
            },
            {
              name: "Permission",
              value: `\`\`\`${
                command.permission
                  ? command.permission
                  : "No specific permission is needed"
              }\`\`\``,
              inline: true,
            }
          ),
      ],
      components: [
        new MessageActionRow().addComponents(
          new MessageButton()
            .setStyle("LINK")
            .setLabel("Support Server")
            .setURL("https://discord.gg/88R47paNbV")
        ),
      ],
    });
  },
};
