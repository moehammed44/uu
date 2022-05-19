const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "djrole",
  aliases: ["dj"],
  category: "Config",
  permission: "MANAGE_GUILD",
  cooldown: 5,
  description: "To set/reset the dj role of your server",
  usage: "<set role> or <reset>",
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
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${emojis.cross} Invalid subcommand!\nValid subcommands: \`set\`, \`reset\``
            ),
        ],
      });
    }
    if (args[0].toLowerCase() === "set") {
      if (!args[1]) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.cross} Use the command again, and this time mention or provide the id of a role.`
              ),
          ],
        });
      }
      let role = message.guild.roles.cache.get(
        message.mentions.roles.first().id || args[1]
      );
      if (!role || role.name === "@everyone" || role.name === "@here") {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(`${emojis.cross} Invalid role!`),
          ],
        });
      }
      if (guildData.djRole === role.id) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.cross} ${role} is already the dj role of this server.`
              ),
          ],
        });
      }
      guildData.djRole = role.id;
      guildData.save();
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${emojis.check} ${role} is now the dj role of this server.`
            ),
        ],
      });
    } else if (args[0].toLowerCase() === "reset") {
      if (!guildData.djRole) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.cross} There's no dj role set for this server.`
              ),
          ],
        });
      }
      guildData.djRole = null;
      guildData.save();
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${emojis.check} The dj role has been reset successfully!`
            ),
        ],
      });
    } else {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${emojis.cross} Invalid subcommand!\nValid subcommands: \`set\`, \`reset\``
            ),
        ],
      });
    }
  },
};
