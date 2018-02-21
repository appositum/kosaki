const request = require('request-promise')
const { stripIndents, oneLine } = require('common-tags')
const { Command } = require('discord.js-commando')

module.exports = class RespostaCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'resposta',
      group: 'utilidade',
      aliases: ['res', 'resp'],
      memberName: 'resposta',
      description: 'Resposta do exercício feita pelo Grupo',
      details: stripIndents`
        **Exibe um resposta dos seguintes temas**:

        __Temas__       __Descrição__

        \`intro\`       Introdução
        \`cond\`        Instruções de Controle - Condicionais
        \`cycle\`       Instruções de Controle - Ciclos
        \`list\`        Listas e Dicionários
        \`func\`        Funções
        \`file\`        Arquivos
        \`class\`       Classes
      `,
      examples: ['res intro 1', 'resposta class 2', 'resp func 1'],
      args: [
        {
          key: 'tema',
          prompt: 'Digite o nome do tema',
          type: 'string'
        },
        {
          key: 'numero',
          prompt: 'Digite o número do exercício que você deseja.',
          type: 'string'
        }
      ]
    })
  }

  async run(msg, args) {
    const { tema, numero } = args
    const repoFileUrl = `https://raw.githubusercontent.com/GO2S/Desafios/master`

    try {
      if (args.tema && args.numero) {
        const resposta = await request.get(repoFileUrl + `/solucoes/${tema}/ex${numero}.py`)
        await msg.channel.send(`\`\`\`py\n${resposta}\`\`\``)
      }
    } catch(e) {
      if (e.statusCode === 404) {
        msg.channel.send('Desculpa, não consegui encontrar a resposta em questão.')
      } else {
        console.log(e)
      }
    }
  }
}
