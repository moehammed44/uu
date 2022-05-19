const {
  MessageEmbed,
  MessageButton,
  MessageActionRow,
  Permissions,
} = require("discord.js");
const { cooldown } = require("../util");
const guildSchema = require("../models/Guild");

/**
 * @param {import("../structures/Client")} client
 * @param {import("discord.js").CommandInteraction} interaction
 */

module.exports = async (client, interaction) => {
  if (!interaction.inGuild()) return;
  let guildData = async () => {
    if (await guildSchema.findOne({ id: interaction.guild.id })) {
      return await guildSchema.findOne({ id: interaction.guild.id });
    } else {
      return new guildSchema({ id: interaction.guild.id }).save();
    }
  };
  guildData = await guildData();
  let emojis;
  if (
    interaction.guild.me.permissions.has(
      Permissions.FLAGS.USE_EXTERNAL_EMOJIS
    ) &&
    interaction.channel
      .permissionsFor(client.user)
      .has(Permissions.FLAGS.USE_EXTERNAL_EMOJIS) &&
    interaction.guild.roles.everyone.permissions.has(
      Permissions.FLAGS.USE_EXTERNAL_EMOJIS
    ) &&
    interaction.channel
      .permissionsFor(interaction.guild.roles.everyone)
      .has(Permissions.FLAGS.USE_EXTERNAL_EMOJIS)
  ) {
    emojis = {
      check: "<:check:944263125753004082>",
      cross: "<:cross:944263125333573694>",
    };
  } else {
    emojis = {
      check: "✅",
      cross: "❌",
    };
  }
  interaction.member = interaction.guild.members.cache.get(
    interaction.user.id
  );
  if (interaction.isCommand()) {
    const command = client.slscommands.get(interaction.commandName);
    if (command) {
      if (guildData.botChannel) {
        if (
          interaction.channel.id !== guildData.botChannel &&
          !interaction.member.permissions.has(
            Permissions.FLAGS.ADMINISTRATOR
          ) &&
          !client.owners.includes(interaction.member.id)
        ) {
          return interaction.reply({
            ephemeral: true,
            embeds: [
              new MessageEmbed()
                .setColor(client.settings.embed_color)
                .setDescription(
                  `${emojis.cross} You are allowed to use my commands only in <#${guildData.botChannel}>`
                ),
            ],
          });
        }
      }
      if (
        command.permission !== "" &&
        !interaction.member.permissions.has(command.permission) &&
        !client.owners.includes(interaction.member.id)
      ) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.cross} You must have the \`${command.permission}\` permission to use this command!`
              ),
          ],
        });
      }
      if (
        command.settings.inVoiceChannel &&
        !interaction.member.voice.channel
      ) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.cross} You must be in a voice channel.`
              ),
          ],
        });
      }
      if (
        command.settings.sameVoiceChannel &&
        interaction.guild.me.voice.channel &&
        !interaction.guild.me.voice.channel.equals(
          interaction.member.voice.channel
        )
      ) {
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
      }
      let player = client.manager.get(interaction.guild.id);
      if (command.settings.activePlayer && !player) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(`${emojis.cross} There's nothing playing.`),
          ],
        });
      }
      if (command.settings.playingPlayer && !player.queue.current) {
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(`${emojis.cross} There's nothing playing.`),
          ],
        });
      }
      if (command.settings.DJonly && guildData.djRole) {
        let role = interaction.guild.roles.cache.get(guildData.djRole);
        if (role) {
          if (
            !interaction.member.roles.cache.has(guildData.djRole) &&
            !interaction.member.permissions.has(
              Permissions.FLAGS.ADMINISTRATOR
            ) &&
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
        } else {
          guildData.djRole = null;
          guildData.save();
        }
      }
      if (command.settings.voteRequired) {
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
      }
      if (
        cooldown(client, interaction.member.id, command) &&
        !client.owners.includes(interaction.member.id)
      ) {
        let timeLeft = cooldown(client, interaction.member.id, command);
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
              .setColor(client.settings.embed_color)
              .setDescription(
                `${emojis.cross} Please wait for ${timeLeft} before reusing the \`${command.name}\` command!`
              ),
          ],
        });
      }
      command.run({ client, interaction, player, emojis, guildData });
    }
  }
  if (interaction.isButton()) {
    if (
      interaction.customId === "delete" &&
      client.owners.includes(interaction.user.id)
    ) {
      interaction.message.delete();
    }
  }
};
