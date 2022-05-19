const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "reload",
  aliases: ["r"],
  category: "Owner",
  permission: "",
  description: "Reloads a command",
  usage: "<type> <command>",
  cooldown: 5,
  settings: {
    ownerOnly: true,
    inVoiceChannel: false,
    sameVoiceChannel: false,
    activePlayer: false,
    playingPlayer: false,
    DJonly: false,
    voteRequired: false,
  },
  run: async ({ client, message, args, emojis }) => {
    if (!args[0]) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${emojis.cross} Invalid reload method!\nValid methods: \`message\`, \`slash\``
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
              `${emojis.cross} Please provide the commands's name!`
            ),
        ],
      });
    }
    let cmd =
      client.msgcommands.get(args[1].toLowerCase()) ||
      client.msgcommands.find(
        (c) => c.aliases[0] && c.aliases.includes(args[1].toLowerCase())
      );
    if (!cmd) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(`${emojis.cross} Invalid command!`),
        ],
      });
    }
    if (args[0].toLowerCase() === "message") {
      try {
        await client.cluster.broadcastEval(
          async (c, command) => {
            delete require.cache[
              require.resolve(
                `${process.cwd()}/src/commands/Message/${command.category}/${
                  command.name
                }`
              )
            ];
            c.msgcommands.delete(command.name);
            const pull = require(`${process.cwd()}/src/commands/Message/${
              command.category
            }/${command.name}`);
            c.msgcommands.set(command.name, pull);
          },
          { context: { name: cmd.name, category: cmd.category } }
        );
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.check} Successfully reloaded the message commmand \`${cmd.name}\``
              ),
          ],
        });
      } catch (e) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.cross} Unable to reload the message commmand \`${cmd.name}\`\n${e}`
              ),
          ],
        });
      }
    } else if (args[0].toLowerCase() === "slash") {
      try {
        await client.cluster.broadcastEval(
          async (c, command) => {
            delete require.cache[
              require.resolve(
                `${process.cwd()}/src/commands/Slash/${command.category}/${
                  command.name
                }`
              )
            ];
            c.slscommands.delete(command.name);
            const pull = require(`${process.cwd()}/src/commands/Slash/${
              command.category
            }/${command.name}`);
            c.slscommands.set(command.name, pull);
          },
          { context: { name: cmd.name, category: cmd.category } }
        );
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.check} Successfully reloaded the slash commmand \`${cmd.name}\``
              ),
          ],
        });
      } catch (e) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.cross} Unable to reload the slash commmand \`${cmd.name}\`\n${e}`
              ),
          ],
        });
      }
    } else {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${emojis.cross} Invalid reload method!\nValid methods: \`message\`, \`slash\``
            ),
        ],
      });
    }
  },
};
