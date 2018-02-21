const { stripIndents, oneLine } = require('common-tags')
const { Command } = require('discord.js-commando')

module.exports = class DiceCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'dice',
      group: 'diversao',
      memberName: 'dice',
      aliases: ['roll', 'dados'],
      description: 'Rola um dado de 6 lados',
      details: oneLine`
        Esse comando rola um número aleatório. Por padrão é 1d6
      `,
      examples: ['dice', 'rolldice <numero>']
    })
  }

  run(msg) {
    const roll = Math.floor(Math.random() * 6) + 1
    return msg.say(`Você rolou ${roll}`)
  }
}