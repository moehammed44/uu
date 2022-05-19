const guildSchema = require("../models/Guild");

/**
 * @param {import("discord.js").TextChannel} channel
 */

module.exports = async (_, channel) => {
  let guildData = await guildSchema.findOne({ id: channel.guild.id });
  if (guildData) {
    if (guildData.botChannel && channel.id === guildData.botChannel) {
      guildData.botChannel = null;
      guildData.save();
    }
    if (
      guildData.twentyFourSeven &&
      (channel.id === guildData.twentyFourSeven.textChannel ||
        channel.id === guildData.twentyFourSeven.voiceChannel)
    ) {
      guildData.twentyFourSeven.enabled = false;
      guildData.twentyFourSeven.textChannel = null;
      guildData.twentyFourSeven.voiceChannel = null;
      guildData.save();
    }
  }
};
