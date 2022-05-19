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
 * @param {import("discord.js").Message} message
 */

module.exports = async (client, message) => {
  if (!message.inGuild() || message.author.bot) return;
  let guildData = async () => {
    if (await guildSchema.findOne({ id: message.guild.id })) {
      return await guildSchema.findOne({ id: message.guild.id });
    } else {
      return new guildSchema({ id: message.guild.id }).save();
    }
  };
  guildData = await guildData();
  let { prefix } = guildData;
  let emojis;
  if (
    message.guild.me.permissions.has(Permissions.FLAGS.USE_EXTERNAL_EMOJIS) &&
    message.channel
      .permissionsFor(client.user)
      .has(Permissions.FLAGS.USE_EXTERNAL_EMOJIS) &&
    message.guild.roles.everyone.permissions.has(
      Permissions.FLAGS.USE_EXTERNAL_EMOJIS
    ) &&
    message.channel
      .permissionsFor(message.guild.roles.everyone)
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
  if (
    message.content === `<@!${client.user.id}>` ||
    message.content === `<@${client.user.id}>`
  ) {
    return message.channel.send({
      content: `My prefix here is \`${prefix}\`
Type \`${prefix}help\` for a list of my commands.
For any help, join our support server. https://discord.gg/88R47paNbV`,
    });
  }
  if (
    client.owners.includes(message.member.id) &&
    !message.content.startsWith(prefix)
  )
    prefix = "";
  const escapeRegex = (newprefix) => {
    return newprefix.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
  };
  const mentionprefix = new RegExp(
    `^(<@!?${client.user.id}>|${escapeRegex(prefix)})`
  );
  if (!mentionprefix.test(message.content)) return;
  const [, content] = message.content.match(mentionprefix);
  const args = message.content.slice(content.length).trim().split(/ +/);
  const cmd = args.length > 0 ? args.shift().toLowerCase() : null;
  const command =
    client.msgcommands.get(cmd) ||
    client.msgcommands.find(
      (cmds) => cmds.aliases && cmds.aliases.includes(cmd)
    );
  if (command) {
    if (
      command.settings.ownerOnly &&
      !client.owners.includes(message.member.id)
    )
      return;
    if (
      !message.channel
        .permissionsFor(client.user)
        .has(Permissions.FLAGS.VIEW_CHANNEL)
    )
      return;
    if (
      !message.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES) ||
      !message.channel
        .permissionsFor(client.user)
        .has(Permissions.FLAGS.SEND_MESSAGES)
    ) {
      return message.member
        .send({
          content: `I don't have \`SEND_MESSAGES\` permission which is required to execute the \`${command.name}\` command in \`${message.guild.name}\`.`,
        })
        .catch(() => {});
    }
    if (
      !message.guild.me.permissions.has(Permissions.FLAGS.EMBED_LINKS) ||
      !message.channel
        .permissionsFor(client.user)
        .has(Permissions.FLAGS.EMBED_LINKS)
    ) {
      return message.channel.send({
        content: `I don't have \`EMBED_LINKS\` permission which is required to execute the \`${command.name}\` command!`,
      });
    }
    if (guildData.botChannel) {
      if (
        message.channel.id !== guildData.botChannel &&
        !message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) &&
        !client.owners.includes(message.member.id)
      ) {
        return message.channel.send({
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
      command.permission &&
      !message.member.permissions.has(command.permission) &&
      !client.owners.includes(message.member.id)
    ) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${emojis.cross} You must have the \`${command.permission}\` permission to use this command!`
            ),
        ],
      });
    }
    if (command.settings.inVoiceChannel && !message.member.voice.channel) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(`${emojis.cross} You must be in a voice channel.`),
        ],
      });
    }
    if (
      command.settings.sameVoiceChannel &&
      message.guild.me.voice.channel &&
      !message.guild.me.voice.channel.equals(message.member.voice.channel)
    ) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${emojis.cross} You must be in the same voice channel as ${client.user}.`
            ),
        ],
      });
    }
    let player = client.manager.get(message.guild.id);
    if (command.settings.activePlayer && !player) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(`${emojis.cross} There's nothing playing.`),
        ],
      });
    }
    if (command.settings.playingPlayer && !player.queue.current) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(`${emojis.cross} There's nothing playing.`),
        ],
      });
    }
    if (command.settings.DJonly && guildData.djRole) {
      let role = message.guild.roles.cache.get(guildData.djRole);
      if (role) {
        if (
          !message.member.roles.cache.has(guildData.djRole) &&
          !message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) &&
          !message.member.voice.channel.members.filter((m) => !m.user.bot)
            .size !== 1 &&
          !client.owners.includes(message.member.id)
        ) {
          return message.channel.send({
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
      let voted = await client.topggapi.hasVoted(message.member.id);
      if (!voted && !client.owners.includes(message.member.id)) {
        return message.channel.send({
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
      cooldown(client, message.member.id, command) &&
      !client.owners.includes(message.member.id)
    ) {
      let timeLeft = cooldown(client, message.member.id, command);
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(client.settings.embed_color)
            .setDescription(
              `${emojis.cross} Please wait for ${timeLeft} before reusing the \`${command.name}\` command!`
            ),
        ],
      });
    }
    command.run({ client, message, args, player, emojis, guildData });
  }
};
