const request = require('request-promise')
const { stripIndents, oneLine } = require('common-tags')
const { Command } = require('discord.js-commando')

module.exports = class ExercicioCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'exercicio',
      group: 'utilidade',
      aliases: ['ex', 'exer'],
      memberName: 'exercicio',
      description: 'Resolução dos exercícios do Curso em Vídeo',
      details: oneLine`
      `,
      examples: ['ex 1', 'exer 5', 'exercicio 14'],
      args: [
        {
          key: 'numero',
          prompt: 'Digite o número do exercício que você deseja.',
          type: 'string'
        }
      ]
    })
  }

  async run(msg, args) {
    const { numero } = args
    const repoFileUrl = `https://raw.githubusercontent.com/GO2S/exercicios_cev/master/desafios`

    try {
      const exercicio = await request.get(repoFileUrl + `/desafio${numero}.py`)
      msg.channel.send(`\`\`\`py\n${exercicio}\`\`\``)
    } catch(e) {
      if (e.statusCode === 404) {
        msg.channel.send('Desculpe, não consegui encontrar o exercício em questão.')
      } else {
        console.log(e)
      }
    }
  }
}
