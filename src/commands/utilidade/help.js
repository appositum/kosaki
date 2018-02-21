// Help Modify, Origin https://github.com/Gawdl3y/discord.js-commando/blob/master/src/commands/util/help.js
const { stripIndents, oneLine } = require('common-tags')
const { Command } = require('discord.js-commando')

module.exports = class HelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ajuda',
      group: 'utilidade',
      memberName: 'ajuda',
      aliases: ['ajuda', 'help'],
      description: 'Exibe uma lista de comandos disponíveis ou informações.',
      examples: ['help', 'ajuda exercicio', 'help exercicio'],
      guarded: true,
      details: oneLine`
        Exibe uma lista de comandos disponíveis ou informações detalhadas para um comando especificado.
      `,
      args: [
        {
          key: 'comando',
          prompt: 'Qual comando você quer ver?',
          type: 'string',
          default: ''
        }
      ]
    })
  }

  async run(msg, args) {
    const groups = this.client.registry.groups
    const commands = this.client.registry.findCommands(args.comando, false, msg)
    const showAll = args.comando && args.comando.toLowerCase() === 'all'

    if (args.comando && !showAll) {
      let messages = []
      let help = stripIndents`
      ${oneLine`
        **\`${msg.guild.commandPrefix}${commands[0].name}\`** __**\`${(commands[0].description.length <= 0 )? 'Não possui descrição': commands[0].description}\`**__
        ${commands[0].guildOnly ? '(Apenas usado nesse servidor)': ''}

      `}\n
      **Modo de uso:** ${msg.anyUsage(`${commands[0].name}${commands[0].format ? ` ${commands[0].format}` : ''}`)}
      `
      if (commands[0].aliases.length > 0) help += `\n**Aliases:** ${commands[0].aliases.join(', ')}`
      if (commands[0].details) help += `\n\n${commands[0].details}`
      if (commands[0].examples) help += `\n\n**Exemplos:**\n${commands[0].examples.join('\n')}`
      await msg.channel.send(help)
    } else {
      const messages = []
      try {
        messages.push(await msg.channel.send(stripIndents`
          ${oneLine`
            Para executar esse comando no ${msg.guild || 'any server'},
            use ${Command.usage('command', msg.guild ? msg.guild.commandPrefix : null, this.client.user)}.
            Por exemplo, ${Command.usage('exercicio', msg.guild ? msg.guild.commandPrefix : null, this.client.user)}.
          `}

          __**${showAll ? 'Todos os Comandos' : `Comandos habilitados em ${msg.guild || ''}`}**__

          ${(showAll ? groups : groups.filter(grp => grp.commands.some(cmd => cmd.isUsable(msg))))
            .map(grp => stripIndents`
              __${grp.name}__
              ${(showAll ? grp.commands : grp.commands.filter(cmd => cmd.isUsable(msg)))
                .map(cmd => `**${cmd.name}:** ${cmd.description}`).join('\n')
              }
            `).join('\n\n')
          }
        `, { split: true }))
      } catch(err) {
        return
      }
      return messages
    }
  }
}