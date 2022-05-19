const { MessageEmbed } = require("discord.js");
const settings = require("../../../../settings");

module.exports = {
  name: "prefix",
  category: "Config",
  permission: "MANAGE_GUILD",
  cooldown: 5,
  description: "To set/reset the prefix of your server",
  usage: "<set symbol> or <reset>",
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
      name: "set",
      description: "Let's you change the prefix of your server",
      type: 1,
      options: [
        {
          name: "symbol",
          description: "What do you want the new prefix to be?",
          type: 3,
          required: true,
        },
      ],
    },
    {
      name: "reset",
      description: "Resets the prefix of your server to the default value",
      type: 1,
    },
  ],
  /**
   * @param {{ client: import("../../../structures/Client"), interaction: import("discord.js").CommandInteraction }}
   */
  run: async ({ client, interaction, emojis, guildData }) => {
    let subcommand = interaction.options.getSubcommand();
    if (subcommand === "set") {
      let prefix = interaction.options.getString("symbol");
      if (prefix.length > 5) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.cross} The length of the prefix shouldn't be longer then \`5\``
              ),
          ],
        });
      }
      if (guildData.prefix === prefix) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.cross} Prefix is already set to \`${prefix}\``
              ),
          ],
        });
      }
      guildData.prefix = prefix;
      guildData.save();
      return interaction.reply({
        ephemeral: false,
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${emojis.check} Successfully set the new prefix to \`${prefix}\``
            ),
        ],
      });
    } else if (subcommand === "reset") {
      if (guildData.prefix === settings.prefix) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.cross} No custom prefix has been set for this server.`
              ),
          ],
        });
      }
      guildData.prefix = settings.prefix;
      guildData.save();
      return interaction.reply({
        ephemeral: false,
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${emojis.check} Successfully reset the prefix to \`${settings.prefix}`
            ),
        ],
      });
    }
  },
};
