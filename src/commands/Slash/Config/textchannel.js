const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "textchannel",
  category: "Config",
  permission: "MANAGE_GUILD",
  cooldown: 5,
  description: "To set/reset the only channel where the bot should work",
  usage: "<set channel> or <reset>",
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
      description: "Let's you set or change the text channel of your server",
      type: 1,
      options: [
        {
          name: "channel",
          description: "Which channel should be the text channel?",
          type: 7,
          channelTypes: ["GUILD_TEXT"],
          required: true,
        },
      ],
    },
    {
      name: "reset",
      description: "Resets the text channel of your server",
      type: 1,
    },
  ],
  /**
   * @param {{ client: import("../../../structures/Client"), interaction: import("discord.js").CommandInteraction }}
   */
  run: async ({ client, interaction, emojis, guildData }) => {
    let subcommand = interaction.options.getSubcommand();
    if (subcommand === "set") {
      let channel = interaction.options.getChannel("channel");
      if (guildData.botChannel === channel.id) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.cross} Text channel is already set to ${channel}`
              ),
          ],
        });
      }
      guildData.botChannel = channel.id;
      guildData.save();
      return interaction.reply({
        ephemeral: false,
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${emojis.check} Successfully set the text channel to ${channel}`
            ),
        ],
      });
    } else if (subcommand === "reset") {
      if (!guildData.botChannel) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.cross} Unable to find any text channel for this server!`
              ),
          ],
        });
      }
      guildData.botChannel = null;
      guildData.save();
      return interaction.reply({
        ephemeral: false,
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${emojis.check} Successfully reset the text channel!`
            ),
        ],
      });
    }
  },
};
