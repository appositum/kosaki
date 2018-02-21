const request = require('request-promise')
const { stripIndents, oneLine } = require('common-tags')
const { Command } = require('discord.js-commando')

module.exports = class PropostaCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'proposta',
      group: 'utilidade',
      aliases: ['prop', 'pro'],
      memberName: 'proposta',
      description: 'Proposta de exercício feita pelo Grupo',
      details: stripIndents`
        **Exibe um proposta com os seguintes temas**:

        __Temas__       __Descrição__

        \`intro\`       Introdução
        \`cond\`        Instruções de Controle - Condicionais
        \`cycle\`       Instruções de Controle - Ciclos
        \`list\`        Listas e Dicionários
        \`func\`        Funções
        \`file\`        Arquivos
        \`class\`       Classes
      `,
      examples: ['prop intro 1', 'prop class 2', 'prop func 1'],
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
        const proposta = await request.get(repoFileUrl + `/exercicios/${tema}/ex${numero}.txt`)
        await msg.channel.send(`\`\`\`py\n${proposta}\`\`\``)
      }
    } catch(e) {
      if (e.statusCode === 404) {
        msg.channel.send('Desculpa, não consegui encontrar a proposta em questão.')
      }
    }
  }
}