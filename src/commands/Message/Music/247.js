const { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
  name: "247",
  aliases: ["24/7", "24_7", "24h"],
  category: "Music",
  permission: "MANAGE_GUILD",
  description: "Toggles the 24/7 mode on/off",
  usage: "",
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
   * @param {{ client: import("../../../structures/Client"), message: import("discord.js").Message, player: import("erela.js").Player }}
   */
  run: async ({ client, message, player, emojis, guildData }) => {
    if (!guildData.twentyFourSeven.enabled) {
      if (!message.member.voice.channel) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.cross} You must be in a voice channel.`
              ),
          ],
        });
      }
      const permissions = message.member.voice.channel.permissionsFor(
        client.user
      );
      if (!permissions.has(Permissions.FLAGS.VIEW_CHANNEL)) {
        return message.channel.send({
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
        return message.channel.send({
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
        return message.channel.send({
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
        !message.guild.me.voice.channel &&
        !message.member.voice.channel.joinable
      ) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.cross} I can't join your voice channel because it's full.`
              ),
          ],
        });
      }
      guildData.twentyFourSeven.enabled = true;
      guildData.twentyFourSeven.textChannel = message.channel.id;
      guildData.twentyFourSeven.voiceChannel = message.member.voice.channel.id;
      guildData.save();
      if (!player) {
        player = client.manager.create({
          guild: message.guild.id,
          voiceChannel: message.member.voice.channel.id,
          textChannel: message.channel.id,
          volume: 100,
          selfDeafen: true,
        });
        player.set("bass", "none");
        player.connect();
      }
    } else {
      guildData.twentyFourSeven.enabled = false;
      guildData.twentyFourSeven.textChannel = null;
      guildData.twentyFourSeven.voiceChannel = null;
      guildData.save();
      if (player) {
        if (!player.playing || !player.queue.current) {
          setTimeout(() => player.destroy(), 500);
        }
      }
    }
    return message.channel.send({
      embeds: [
        new MessageEmbed()
          .setColor(client.settings.embed_color)
          .setDescription(
            `${emojis.check} 24/7 mode is now ${
              guildData.twentyFourSeven.enabled ? "**enabled**" : "**disabled**"
            }`
          ),
      ],
    });
  },
};
