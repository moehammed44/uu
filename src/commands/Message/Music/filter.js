const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "filter",
  aliases: [],
  category: "Music",
  permission: "",
  description: "Applys a specfic filter to the player",
  usage: "",
  cooldown: 5,
  settings: {
    ownerOnly: false,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    activePlayer: true,
    playingPlayer: true,
    DJonly: true,
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
              `${emojis.cross} Invalid filter!\nValid filters: \`8d\`, \`bassboost\`, \`deepbass\`, \`karaoke\`, \`nightcore\`, \`pop\`, \`soft\`, \`treblebass\`, \`tremolo\`, \`vaporwave\`, \`vibrato\``
            ),
        ],
      });
    }
    if (args[0].toLowerCase() === "8d") {
      player.eightD = !player.eightD;
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `🎼 8d filter is now ${
                player.eightD ? "**enabled**" : "**disabled**"
              }`
            ),
        ],
      });
    } else if (args[0].toLowerCase() === "bassboost") {
      if (!args[1]) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.cross} Invalid bassboost level!\nValid levels: \`none\`, \`low\`, \`medium\`, \`high\``
              ),
          ],
        });
      }
      if (player.get("bass") === args[1]) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.cross} Bass is already set to \`${args[1]}\``
              ),
          ],
        });
      }
      if (args[1].toLowerCase() === "none") {
        player.reset();
        player.set("bass", "none");
        player.setEQ([
          {
            band: 0,
            gain: 0.25,
          },
          {
            band: 1,
            gain: 0.025,
          },
          {
            band: 2,
            gain: 0.0125,
          },
          {
            band: 3,
            gain: 0,
          },
          {
            band: 4,
            gain: 0,
          },
          {
            band: 5,
            gain: -0.0125,
          },
          {
            band: 6,
            gain: -0.025,
          },
          {
            band: 7,
            gain: -0.0175,
          },
          {
            band: 8,
            gain: 0,
          },
          {
            band: 9,
            gain: 0,
          },
          {
            band: 10,
            gain: 0.0125,
          },
          {
            band: 11,
            gain: 0.025,
          },
          {
            band: 12,
            gain: 0.25,
          },
          {
            band: 13,
            gain: 0.125,
          },
          {
            band: 14,
            gain: 0.125,
          },
        ]);
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.check} Bassboost filter is now disabled.`
              ),
          ],
        });
      } else if (args[1].toLowerCase() === "low") {
        player.reset();
        player.set("bass", "low");
        player.setEQ([
          {
            band: 0,
            gain: 0.0625,
          },
          {
            band: 1,
            gain: 0.125,
          },
          {
            band: 2,
            gain: -0.125,
          },
          {
            band: 3,
            gain: -0.0625,
          },
          {
            band: 4,
            gain: 0,
          },
          {
            band: 5,
            gain: -0.0125,
          },
          {
            band: 6,
            gain: -0.025,
          },
          {
            band: 7,
            gain: -0.0175,
          },
          {
            band: 8,
            gain: 0,
          },
          {
            band: 9,
            gain: 0,
          },
          {
            band: 10,
            gain: 0.0125,
          },
          {
            band: 11,
            gain: 0.025,
          },
          {
            band: 12,
            gain: 0.375,
          },
          {
            band: 13,
            gain: 0.125,
          },
          {
            band: 14,
            gain: 0.125,
          },
        ]);
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(`${emojis.check} Bass is now set to \`low\``),
          ],
        });
      } else if (args[1].toLowerCase() === "medium") {
        player.reset();
        player.set("bass", "medium");
        player.setEQ([
          {
            band: 0,
            gain: 0.125,
          },
          {
            band: 1,
            gain: 0.25,
          },
          {
            band: 2,
            gain: -0.25,
          },
          {
            band: 3,
            gain: -0.125,
          },
          {
            band: 4,
            gain: 0,
          },
          {
            band: 5,
            gain: -0.0125,
          },
          {
            band: 6,
            gain: -0.025,
          },
          {
            band: 7,
            gain: -0.0175,
          },
          {
            band: 8,
            gain: 0,
          },
          {
            band: 9,
            gain: 0,
          },
          {
            band: 10,
            gain: 0.0125,
          },
          {
            band: 11,
            gain: 0.025,
          },
          {
            band: 12,
            gain: 0.375,
          },
          {
            band: 13,
            gain: 0.125,
          },
          {
            band: 14,
            gain: 0.125,
          },
        ]);
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.check} Bass gain is now set to \`medium\``
              ),
          ],
        });
      } else if (args[1].toLowerCase() === "high") {
        player.reset();
        player.set("bass", "high");
        player.setEQ([
          {
            band: 0,
            gain: 0.1875,
          },
          {
            band: 1,
            gain: 0.375,
          },
          {
            band: 2,
            gain: -0.375,
          },
          {
            band: 3,
            gain: -0.1875,
          },
          {
            band: 4,
            gain: 0,
          },
          {
            band: 5,
            gain: -0.0125,
          },
          {
            band: 6,
            gain: -0.025,
          },
          {
            band: 7,
            gain: -0.0175,
          },
          {
            band: 8,
            gain: 0,
          },
          {
            band: 9,
            gain: 0,
          },
          {
            band: 10,
            gain: 0.0125,
          },
          {
            band: 11,
            gain: 0.025,
          },
          {
            band: 12,
            gain: 0.375,
          },
          {
            band: 13,
            gain: 0.125,
          },
          {
            band: 14,
            gain: 0.125,
          },
        ]);
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.check} Bass gain is now set to \`high\``
              ),
          ],
        });
      } else {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.cross} Invalid bassboost level!\nValid levels: \`none\`, \`low\`, \`medium\`, \`high\``
              ),
          ],
        });
      }
    } else if (args[0].toLowerCase() === "deepbass") {
      player.bassboost = !player.bassboost;
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `🎼 Deepbass filter is now ${
                player.bassboost ? "**enabled**" : "**disabled**"
              }`
            ),
        ],
      });
    } else if (args[0].toLowerCase() === "karaoke") {
      player.karaoke = !player.karaoke;
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `🎼 Karaoke filter is now ${
                player.karaoke ? "**enabled**" : "**disabled**"
              }`
            ),
        ],
      });
    } else if (args[0].toLowerCase() === "nightcore") {
      player.nightcore = !player.nightcore;
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `🎼 Nightcore filter is now ${
                player.nightcore ? "**enabled**" : "**disabled**"
              }`
            ),
        ],
      });
    } else if (args[0].toLowerCase() === "pop") {
      player.pop = !player.pop;
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `🎼 Pop filter is now ${
                player.pop ? "**enabled**" : "**disabled**"
              }`
            ),
        ],
      });
    } else if (args[0].toLowerCase() === "soft") {
      player.soft = !player.soft;
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `🎼 Soft filter is now ${
                player.soft ? "**enabled**" : "**disabled**"
              }`
            ),
        ],
      });
    } else if (args[0].toLowerCase() === "treblebass") {
      player.treblebass = !player.treblebass;
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `🎼 Treblebass filter is now ${
                player.treblebass ? "**enabled**" : "**disabled**"
              }`
            ),
        ],
      });
    } else if (args[0].toLowerCase() === "tremolo") {
      player.tremolo = !player.tremolo;
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `🎼 Tremolo filter is now ${
                player.tremolo ? "**enabled**" : "**disabled**"
              }`
            ),
        ],
      });
    } else if (args[0].toLowerCase() === "vaporwave") {
      player.vaporwave = !player.vaporwave;
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `🎼 Vaporwave filter is now ${
                player.vaporwave ? "**enabled**" : "**disabled**"
              }`
            ),
        ],
      });
    } else if (args[0].toLowerCase() === "vibrato") {
      player.vibrato = !player.vibrato;
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `🎼 Vibrato filter is now ${
                player.vibrato ? "**enabled**" : "**disabled**"
              }`
            ),
        ],
      });
    } else {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${emojis.cross} Invalid filter!\nValid filters: \`8d\`, \`bassboost\`, \`deepbass\`, \`karaoke\`, \`nightcore\`, \`pop\`, \`soft\`, \`treblebass\`, \`tremolo\`, \`vaporwave\`, \`vibrato\``
            ),
        ],
      });
    }
  },
};
