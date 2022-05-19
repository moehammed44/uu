const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "filter",
  category: "Music",
  permission: "",
  description: "Applys a specfic filter to the player",
  usage: "",
  cooldown: 5,
  settings: {
    inVoiceChannel: true,
    sameVoiceChannel: true,
    activePlayer: true,
    playingPlayer: true,
    DJonly: true,
    voteRequired: false,
  },
  options: [
    {
      name: "8d",
      description: "Toggles the 8d filter on/off",
      type: 1,
    },
    {
      name: "bassboost",
      description: "Changes the bass gain",
      type: 1,
      options: [
        {
          name: "level",
          description: "Choose a level",
          type: 3,
          required: true,
          choices: [
            { name: "None", value: "none" },
            { name: "Low", value: "low" },
            { name: "Medium", value: "medium" },
            { name: "High", value: "high" },
          ],
        },
      ],
    },
    {
      name: "deepbass",
      description: "Toggles the deepbass filter on/off",
      type: 1,
    },
    {
      name: "nightcore",
      description: "Toggles the nightcore filter on/off",
      type: 1,
    },
    {
      name: "pop",
      description: "Toggles the pop filter on/off",
      type: 1,
    },
    {
      name: "soft",
      description: "Toggles the soft filter on/off",
      type: 1,
    },
    {
      name: "treblebass",
      description: "Toggles the treblebass filter on/off",
      type: 1,
    },
    {
      name: "tremolo",
      description: "Toggles the tremolo filter on/off",
      type: 1,
    },
    {
      name: "vaporwave",
      description: "Toggles the vaporwave filter on/off",
      type: 1,
    },
    {
      name: "vibrato",
      description: "Toggles the vibrato filter on/off",
      type: 1,
    },
  ],
  /**
   * @param {{ client: import("../../../structures/Client"), interaction: import("discord.js").CommandInteraction, player: import("erela.js").Player }}
   */
  run: async ({ client, interaction, player, emojis }) => {
    const subcommand = interaction.options.getSubcommand();
    if (subcommand === "8d") {
      player.eightD = !player.eightD;
      return interaction.reply({
        ephemeral: false,
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
    } else if (subcommand === "bassboost") {
      const level = interaction.options.getString("level");
      if (player.get("bass") === level) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.cross} Bass is already set to \`${level}\``
              ),
          ],
        });
      }
      if (level === "none") {
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
        return interaction.reply({
          ephemeral: false,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.check} Bassboost filter is now disabled.`
              ),
          ],
        });
      } else if (level === "low") {
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
        return interaction.reply({
          ephemeral: false,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.check} Bass gain is now set to \`low\``
              ),
          ],
        });
      } else if (level === "medium") {
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
        return interaction.reply({
          ephemeral: false,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.check} Bass gain is now set to \`medium\``
              ),
          ],
        });
      } else if (level === "high") {
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
        return interaction.reply({
          ephemeral: false,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.check} Bass gain is now set to \`high\``
              ),
          ],
        });
      }
    } else if (subcommand === "deepbass") {
      player.bassboost = !player.bassboost;
      return interaction.reply({
        ephemeral: false,
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
    } else if (subcommand === "karaoke") {
      player.karaoke = !player.karaoke;
      return interaction.reply({
        ephemeral: false,
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
    } else if (subcommand === "nightcore") {
      player.nightcore = !player.nightcore;
      return interaction.reply({
        ephemeral: false,
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
    } else if (subcommand === "pop") {
      player.pop = !player.pop;
      return interaction.reply({
        ephemeral: false,
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
    } else if (subcommand === "soft") {
      player.soft = !player.soft;
      return interaction.reply({
        ephemeral: false,
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
    } else if (subcommand === "treblebass") {
      player.treblebass = !player.treblebass;
      return interaction.reply({
        ephemeral: false,
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
    } else if (subcommand === "tremolo") {
      player.tremolo = !player.tremolo;
      return interaction.reply({
        ephemeral: false,
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
    } else if (subcommand === "vaporwave") {
      player.vaporwave = !player.vaporwave;
      return interaction.reply({
        ephemeral: false,
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
    } else if (subcommand === "vibrato") {
      player.vibrato = !player.vibrato;
      return interaction.reply({
        ephemeral: false,
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
    }
  },
};
