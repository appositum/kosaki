const { stripIndents } = require('common-tags')
const { Command } = require('discord.js-commando')
const MusicManager  = require('../../lib/music-manager')

module.exports = class PlayCommandMusic extends Command {
  constructor(client) {
    super(client, {
      name: 'play',
      group: 'music',
      aliases: ['ply', 'tocar', 'solta-som-dj'],
      memberName: 'play',
      guildOnly: true,
      description: 'Toca uma musica pelo nome ou link do yotube',
      details: stripIndents`
        Em breve
      `,
      args: [
        {
          key: 'linkOuNome',
          prompt: 'Digita o nome ou link do youtube',
          type: 'string'
        }
      ]
    })
  }

  async run(msg, args) {
    let manager = new MusicManager()
    await manager.setUpVideo(msg, args.linkOuNome)
  }
}