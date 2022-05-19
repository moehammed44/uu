const { MessageEmbed } = require("discord.js");
const guildSchema = require("../models/Guild");

/**
 * @param {import("../structures/Client")} client
 * @param {import("discord.js").VoiceState} newState
 */

module.exports = async (client, _, newState) => {
  if (
    newState.channel &&
    newState.channel.type === "GUILD_STAGE_VOICE" &&
    newState.guild.me.voice.suppress
  ) {
    return newState.guild.me.voice.setSuppressed(false);
  }
  if (!newState.guild.me.voice.channel) return;
  if (
    client.manager.get(newState.guild.id) &&
    !newState.guild.me.voice.channel.members.filter((m) => !m.user.bot).size
  ) {
    setTimeout(async () => {
      if (
        client.manager.get(newState.guild.id) &&
        !newState.guild.me.voice.channel.members.filter((m) => !m.user.bot).size
      ) {
        let guildData = await guildSchema.findOne({ id: newState.guild.id });
        if (guildData && !guildData.twentyFourSeven.enabled) {
          let channel = client.channels.cache.get(
            client.manager.get(newState.guild.id).textChannel
          );
          if (channel) {
            try {
              channel.send({
                embeds: [
                  new MessageEmbed()
                    .setColor(client.settings.embed_color)
                    .setDescription(
                      `👋 Left the voice channel due to inactivity.`
                    ),
                ],
              });
            } catch {}
          }
          client.manager.get(newState.guild.id).destroy();
        }
      }
    }, 180000);
  }
};
