const { stripIndents } = require('common-tags')
const { Command } = require('discord.js-commando')
const MusicManager  = require('../../lib/music-manager')

module.exports = class StopCommandMusic extends Command {
  constructor(client) {
    super(client, {
      name: 'stop',
      group: 'music',
      aliases: ['stp', 'parar'],
      memberName: 'stop',
      guildOnly: true,
      description: 'Para e disconecta o bot do canal de voz',
      details: stripIndents`
        Em breve
      `
    })
  }

  async run(msg) {
    if (!msg.member.hasPermission('MANAGE_MESSAGES')) {
      return msg.channel.send('Você não tem permissão para usar esse comando!')
    } else {
      let manager = new MusicManager()
      await manager.stop()
    }
  }
}