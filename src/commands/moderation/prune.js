const { stripIndents, oneLine } = require('common-tags')
const { Command } = require('discord.js-commando')

module.exports = class BanCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'prune',
      group: 'moderation',
      aliases: ['clear', 'clean', 'delete'],
      memberName: 'prune',
      description: 'Apaga mensagens de determinado canal',
      details: stripIndents`
        Deleta mensagens. Lista de de filtros:

        \`invites\` Mensagens contendo convites
        \`user @user\` Mensagens enviadas por @user
        \`bots\` Mensagens enviadas por bots
        \`links\` Mensagens contendo links
      `,
      args: [
        {
          key: 'limit',
          prompt: 'Quantas mensagens você quer deletar?',
          type: 'integer',
          max: 100
        },
        {
          key: 'filter',
          prompt: 'O que você quer deletar?',
          type: 'string',
          default: '',
          parse: (str) => str.toLowerCase()
        },
        {
          key: 'member',
          prompt: 'Qual o membro tera as mensagens apagadas?',
          type: 'member',
          default: ''
        }
      ]
    })
  }

  async run(msg, args) {
    const { limit, filter, member } = args
    let messageFilter

    if (msg.member.id !== '146367028968554496') {
        return msg.channel.send('Para com isso porra')
    }

    if (!msg.member.hasPermission('MANAGE_MESSAGES')) {
      return msg.channel.send('Error! Você não tem permissão para usar esse comando!')
    } else {
      if (filter) {
        if (filter === 'invites') {
          messageFilter = (msg) => msg.content.search(/(discord\.gg\/.+|discordapp\.com\/invite\/.+)/i) !== -1
        } else if (filter === 'user') {
          if (member) {
            messageFilter = (msg) => msg.author.id === member.user.id
          } else {
            msg.channel.send(`**${msg.author.username}** você dever mencionar o nome do usúario`)
          }
        } else if (filter === 'bots') {
          messageFilter = (msg) => msg.author.bot
        } else if (filter === 'links') {
          messageFilter = (msg) => msg.content.search(/https?:\/\/[^ \/\.]+\.[^ \/\.]+/) !== -1
        } else {
          msg.channel.send(`${msg.author}, Esse filtro não é válido. \`help prune\` para todos os filtros.`)
        }
        const messages = await msg.channel.fetchMessages({limit})
        const messagesToDelete = messages.filter(messageFilter)

        msg.channel.bulkDelete(messagesToDelete.array().reverse()).catch((error) => {
          if (error) return null
        })

        msg.delete()
          .then(msg => console.log(`Deleted messages`))
          .catch(console.error)
        return null
      }
      msg.channel.bulkDelete(limit).catch((error) => {
        if (error) return null
      })
      msg.delete()
        .then(msg => console.log(`Deleted messages`))
        .catch(console.error)
      return null
    }
  }
}
