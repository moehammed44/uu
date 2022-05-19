const guildSchema = require("../models/Guild");

/**
 * @param {import("discord.js").Role} role
 */

module.exports = async (_, role) => {
  let guildData = await guildSchema.findOne({ id: role.guild.id });
  if (guildData && guildData.djRole && role.id === guildData.djRole) {
    guildData.djRole = null;
    guildData.save();
  }
};
