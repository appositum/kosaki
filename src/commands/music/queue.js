const { stripIndents } = require('common-tags')
const { Command } = require('discord.js-commando')
const MusicManager  = require('../../lib/music-manager')

module.exports = class QueueCommandMusic extends Command {
  constructor(client) {
    super(client, {
      name: 'queue',
      group: 'music',
      aliases: ['queue', 'playlist', 'lista'],
      memberName: 'queue',
      guildOnly: true,
      description: 'Mostra a playlist',
      details: stripIndents`
        Em breve
      `
    })
  }

  async run(msg) {
    let manager = new MusicManager()
    msg.channel.send('', {
      'embed': {
        'title': 'Lista de músicas a tocar',
        'fields': (() => {
          let fields = []

          manager.queue.forEach(song => {
            fields.push({
              'name': song.title,
              'value': `Requested By: ${song.requestedBy}`
            })
          })

          return fields
        })()
      }
    })
  }
}