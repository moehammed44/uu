const {
  MessageEmbed,
  MessageButton,
  MessageActionRow,
  Permissions,
} = require("discord.js");

module.exports = {
  name: "volume",
  category: "Music",
  permission: "",
  description: "To check or change the player's volume",
  usage: "[volume]",
  cooldown: 5,
  settings: {
    inVoiceChannel: false,
    sameVoiceChannel: false,
    activePlayer: true,
    playingPlayer: true,
    DJonly: false,
    voteRequired: false,
  },
  options: [
    {
      name: "amount",
      description: "Enter a new volume between 1-100",
      type: 4,
      required: false,
    },
  ],
  /**
   * @param {{ client: import("../../../structures/Client"), interaction: import("discord.js").CommandInteraction, player: import("erela.js").Player }}
   */
  run: async ({ client, interaction, player, emojis, guildData }) => {
    const vol = interaction.options.getInteger("amount");
    if (!vol) {
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(`The current volume is **${player.volume}%**`),
        ],
      });
    }
    if (!interaction.member.voice.channel) {
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(`${emojis.cross} You must be in a voice channel.`),
        ],
      });
    }
    if (
      interaction.guild.me.voice.channel &&
      !interaction.guild.me.voice.channel.equals(
        interaction.member.voice.channel
      )
    )
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${emojis.cross} You must be in the same voice channel as ${client.user}.`
            ),
        ],
      });
    if (guildData.djRole) {
      if (
        !interaction.member.roles.cache.has(guildData.djRole) &&
        !interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) &&
        interaction.member.voice.channel.members.filter((m) => !m.user.bot)
          .size !== 1 &&
        !client.owners.includes(interaction.member.id)
      ) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.cross} You must have the <@&${guildData.djRole}> to use this command!`
              ),
          ],
        });
      }
    }
    let voted = await client.topggapi.hasVoted(interaction.member.id);
    if (!voted && !client.owners.includes(interaction.member.id)) {
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${emojis.cross} You must vote me first to use this command!`
            ),
        ],
        components: [
          new MessageActionRow().addComponents(
            new MessageButton()
              .setStyle("LINK")
              .setLabel("Vote")
              .setURL(`https://top.gg/bot/${client.user.id}/vote`)
          ),
        ],
      });
    }
    if (vol < 1 || vol > 100) {
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${emojis.cross} Use the command again, and this time enter a volume amount between \`1 - 100\``
            ),
        ],
      });
    }
    if (player.volume === vol) {
      return interaction.reply({
        ephemeral: true,
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${emojis.cross} Volume is already set to **${vol}%**`
            ),
        ],
      });
    }
    player.setVolume(vol);
    return interaction.reply({
      ephemeral: false,
      embeds: [
        new MessageEmbed()
          .setColor(client.settings.embed_color)
          .setDescription(`${emojis.check} Volume is now set to **${vol}%**`),
      ],
    });
  },
};
