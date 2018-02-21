const { stripIndents, oneLine } = require('common-tags')
const { Command } = require('discord.js-commando')

const { GUILD_LOG } = process.env

module.exports = class BanCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ban',
      group: 'moderation',
      aliases: ['banhammer'],
      memberName: 'ban',
      description: 'Bane determinado usário do servidor',
      details: oneLine`
      `,
      args: [
        {
          key: 'usuario',
          prompt: 'Digite o nome de usuário que você deseja banir',
          type: 'member'
        },
        {
          key: 'motivo',
          prompt: 'Digite o motivo da qual você esta banindo esse usuário',
          type: 'string',
          default: ''
        }
      ]
    })
  }

  async run(msg, args) {
    const { usuario, motivo } = args
    let motivoBan

    if (!motivo) motivoBan = 'Motivo não declarado'
    else motivoBan = motivo

    if (!msg.guild.me.hasPermission('BAN_MEMBERS')) {
      msg.channel.send('Não tenho permissão suficiente para banir')
    } else if (!msg.member.hasPermission('BAN_MEMBERS')) {
      msg.channel.send('Você não tem permissão para banir membros')
    } else if (!(msg.member.highestRole.position > usuario.highestRole.position || msg.member.id === msg.guild.ownerID)) {
      msg.channel.send(`Você não tem permissão para banir ${usuario}`)
    } else {
      msg.guild.channels.get(GUILD_LOG).send(stripIndents`
        **:passport_control:**  |  **${usuario}** foi banido do **${msg.guild.name}** por **${msg.author.username}**

        **Razão:**
        \`\`\`${motivoBan}\`\`\`
      `)
      await usuario.send(stripIndents`
        **:passport_control:**  |  Você foi banido do **${msg.guild.name}** por **${msg.author.username}**

        **Razão:**
        \`\`\`${motivoBan}\`\`\`
      `)
      setTimeout(async () =>{
        await msg.guild.ban(usuario, {reason: motivoBan})
      }, 600)
      return
    }
  }
}