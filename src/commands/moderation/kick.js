const { stripIndents, oneLine } = require('common-tags')
const { Command } = require('discord.js-commando')

const { GUILD_LOG } = process.env

module.exports = class KickCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'kick',
      group: 'moderation',
      aliases: ['kickhammer'],
      memberName: 'kick',
      description: 'Expulsa determinado usário do servidor',
      details: oneLine`
      `,
      args: [
        {
          key: 'usuario',
          prompt: 'Qual o nome de usuário você deseja expulsar',
          type: 'member'
        },
        {
          key: 'motivo',
          prompt: 'Qual o motivo pelo qual você está expulsando esse usuário',
          type: 'string'
        }
      ]
    })
  }

  async run(msg, args) {
    const { usuario, motivo } = args
    let motivoKick

    if (!motivo) motivoKick = 'Motivo não declarado'
    else motivoKick = motivo

    if (!msg.guild.me.hasPermission('KICK_MEMBERS')) {
      msg.channel.send('Não tenho permissão suficiente para expulsar')
    } else if (!msg.member.hasPermission('KICK_MEMBERS')) {
      msg.channel.send('Você não tem permissão para expulsar membros')
    } else if (!(msg.member.highestRole.position > usuario.highestRole.position || msg.member.id === msg.guild.ownerID)) {
      msg.channel.send(`Você não tem permissão para expulsar ${usuario}`)
    } else {
      await msg.guild.channels.get(GUILD_LOG).send(stripIndents`
        **:passport_control:**  |  **${usuario}** foi expulso do **${msg.guild.name}** por **${msg.author.username}**

        **Razão:**
        \`\`\`${motivoKick}\`\`\`
      `)
      await usuario.send(stripIndents`
        **:passport_control:**  |  Você foi expulso do **${msg.guild.name}** por **${msg.author.username}**

        **Razão:**
        \`\`\`${motivoKick}\`\`\`
      `)
      setTimeout(async () =>{
        await usuario.kick(motivoKick)
      }, 600)
      return
    }
  }
}
