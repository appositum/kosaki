const { stripIndents } = require('common-tags')
const { Command } = require('discord.js-commando')
const MusicManager  = require('../../lib/music-manager')

module.exports = class SkipCommandMusic extends Command {
  constructor(client) {
    super(client, {
      name: 'skip',
      group: 'music',
      aliases: ['skp', 'pular'],
      memberName: 'skip',
      guildOnly: true,
      description: 'Pula a música atual',
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
      await manager.skip()
    }
  }
}