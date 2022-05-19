const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const load = require('lodash');

module.exports = {
  name: "serverlist",
  aliases: ["sl"],
  category: "Owner",
  permission: "",
  description: "stats of server",
  usage: "<type> <command>",
  cooldown: 5,
  settings: {
    ownerOnly: true,
    inVoiceChannel: false,
    sameVoiceChannel: false,
    activePlayer: false,
    playingPlayer: false,
    DJonly: false,
    voteRequired: false,
  },
  run: async ({ client, message, args, emojis, guild }) => {
      var color = client.settings.embed_color;
      let own = await guild.fetchOwner()
    const serverlist = client.guilds.cache.map(
        (guild, i) => `• ${guild.name} | \`[ ${guild.id} ]\` | \`[ ${guild.memberCount} ]\` | \`${own}\``,
      );
      const mapping = load.chunk(serverlist, 10);
      const pages = mapping.map((s) => s.join('\n'));
      let page = 0;
  
      const embed2 = new MessageEmbed()
        .setColor(color)
        .setDescription(pages[page])
        .setTitle(`Total Server(s) - \`${client.guilds.cache.size}\``)
  
        .setFooter({
          text: `Page ${page + 1}/${pages.length}`,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        
  
      const but1 = new MessageButton()
        .setCustomId('queue_cmd_but_1')
        .setEmoji('⏭️')
        .setStyle('PRIMARY');
  
      const but2 = new MessageButton()
        .setCustomId('queue_cmd_but_2')
        .setEmoji('⏮️')
        .setStyle('PRIMARY');
  
      const but3 = new MessageButton()
        .setCustomId('queue_cmd_but_3')
        .setEmoji('⏹️')
        .setStyle('DANGER');
  
      const row1 = new MessageActionRow().addComponents([but2, but3, but1]);
  
      const msg = await message.channel.send({
        embeds: [embed2],
        components: [row1],
      });
  
      const collector = message.channel.createMessageComponentCollector({
        filter: (b) => {
          if (b.user.id === message.author.id) return true;
          else {
            b.reply({
              ephemeral: true,
              content: `Only **${message.author.tag}** can use this button, if you want then you've to run the command again.`,
            });
            return false;
          }
        },
        time: 60000 * 5,
        idle: 30e3,
      });
  
      collector.on('collect', async (button) => {
        if (button.customId === 'queue_cmd_but_1') {
          await button.deferUpdate().catch(() => { });
          page = page + 1 < pages.length ? ++page : 0;
  
          const embed3 = new MessageEmbed()
            .setColor(color)
            .setDescription(pages[page])
            .setTitle(`Total Server(s) - \`${client.guilds.cache.size}\``)
            .setFooter({
              text: `Page ${page + 1}/${pages.length}`,
              iconURL: message.author.displayAvatarURL({ dynamic: true }),
            })
            
  
          await msg.edit({
            embeds: [embed3],
            components: [row1],
          });
        } else if (button.customId === 'queue_cmd_but_2') {
          await button.deferUpdate().catch(() => { });
          page = page > 0 ? --page : pages.length - 1;
  
          const embed4 = new MessageEmbed()
            .setColor(color)
            .setDescription(pages[page])
  
            .setFooter({
              text: `Page ${page + 1}/${pages.length}`,
              iconURL: message.author.displayAvatarURL({ dynamic: true }),
            })
            .setTitle(`Total Server(s) - \`${client.guilds.cache.size}\``)
  
          await msg
            .edit({
              embeds: [embed4],
              components: [row1],
            })
            .catch(() => { });
        } else if (button.customId === 'queue_cmd_but_3') {
          await button.deferUpdate().catch(() => { });
          collector.stop();
        } else return;
      });
  
      collector.on('end', async () => {
        await msg.edit({
          components: [],
        });
      });
  }
}