const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

module.exports = {
  name: "help",
  aliases: ["h", "cmds", "commands", "cmd"],
  category: "Misc",
  permission: "",
  description: "Shows all the bot's commands",
  usage: "[command]",
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
   * @param {{ client: import("../../../structures/Client"), message: import("discord.js").Message }}
   */
  run: async ({ client, message, args, emojis, guildData }) => {
    if (!args[0]) {
      let commands;
      return message.channel
        .send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setAuthor({
                name: `${client.user.username} Help`,
                url: "https://discord.gg/88R47paNbV",
              })
              .setFooter({
                text: `Requested by ${message.member.user.tag}`,
                iconURL: message.member.displayAvatarURL(),
              })
              .setTimestamp()
              .setDescription(`Hello ${message.member}, I am ${client.user}

A feature rich and easy-to-use music bot with Spotify and SoundCloud support. Find out what I can do using the buttons below, or join our [support server](https://discord.gg/88R47paNbV) for more help!

Music \`:\` *List of music related commands*
Misc \`:\` *List of bot's miscellaneous commands*
Config \`:\` *List of commands to configure ${client.user.username}*

Use the buttons below to select a category!

[Support Server](https://discord.gg/88R47paNbV) | [Invite](https://discord.com/oauth2/authorize?client_id=945411538985046167&permissions=2205281600&scope=bot%20applications.commands) | [Vote](https://top.gg/bot/${client.user.id}/vote)`),
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
              return msg.edit({
                embeds: [
                  new MessageEmbed()
                    .setColor(client.settings.embed_color)
                    .setAuthor({
                      name: `${client.user.username} Help`,
                      url: "https://discord.gg/88R47paNbV",
                    })
                    .setFooter({
                      text: `Requested by ${message.member.user.tag}`,
                      iconURL: message.member.displayAvatarURL(),
                    })
                    .setTimestamp()
                    .setDescription(`Hello ${message.member}, I am ${client.user}

A feature rich and easy-to-use music bot with Spotify and SoundCloud support. Find out what I can do using the buttons below, or join our [support server](https://discord.gg/88R47paNbV) for more help!

Music \`:\` *List of music related commands*
Misc \`:\` *List of bot's miscellaneous commands*
Config \`:\` *List of commands to configure ${client.user.username}*

Use the buttons below to select a category!

[Support Server](https://discord.gg/88R47paNbV) | [Invite](https://discord.com/oauth2/authorize?client_id=945411538985046167&permissions=2205281600&scope=bot%20applications.commands) | [Vote](https://top.gg/bot/${client.user.id}/vote)`),
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
              commands = client.msgcommands
                .filter((c) => c.category === "Music")
                .map((c) => `\`${c.name}\``);
              return msg.edit({
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
              commands = client.msgcommands
                .filter((c) => c.category === "Misc")
                .map((c) => `\`${c.name}\``);
              return msg.edit({
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
              commands = client.msgcommands
                .filter((c) => c.category === "Config")
                .map((c) => `\`${c.name}\``);
              return msg.edit({
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
            return msg?.edit({
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
    let command =
      client.msgcommands.get(args[0].toLowerCase()) ||
      client.msgcommands.find(
        (c) => c.aliases[0] && c.aliases.includes(args[0].toLowerCase())
      );
    if (
      !command ||
      (command.settings.ownerOnly &&
        !client.owners.includes(message.member.id))
    ) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(`${emojis.cross} Unable to find that command!`),
        ],
      });
    }
    let usage = `${guildData.prefix}${command.name} ${
      command.usage ? command.usage : ""
    }`;
    if (args[0].toLowerCase() === "playlist") {
      usage = `${guildData.prefix}playlist addcurrent <playlist-name>,
${guildData.prefix}playlist addqueue <playlist-name>,
${guildData.prefix}playlist create <playlist-name>,
${guildData.prefix}playlist delete <playlist-name>,
${guildData.prefix}playlist view <playlist-name>,
${guildData.prefix}playlist list,
${guildData.prefix}playlist load <playlist-name>,
${guildData.prefix}playlist remove <playlist-name> <track-number>,
${guildData.prefix}playlist shuffle <playlist-name>`;
    }
    return message.channel.send({
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
              name: "Aliases",
              value: `\`\`\`${
                command.aliases[0]
                  ? `${command.aliases.join(", ")}`
                  : `No aliases`
              }\`\`\``,
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
