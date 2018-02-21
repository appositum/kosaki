const { stripIndents } = require('common-tags')
const { Command } = require('discord.js-commando')
const MusicManager  = require('../../lib/music-manager')

module.exports = class ShuffleCommandMusic extends Command {
  constructor(client) {
    super(client, {
      name: 'shuffle',
      group: 'music',
      aliases: ['sffle', 'misturar'],
      memberName: 'shuffle',
      guildOnly: true,
      description: 'Mistura a playlist',
      details: stripIndents`
        Em breve
      `
    })
  }

  hasPermission(msg) {
    return msg.member.hasPermission('MANAGE_CHANNELS')
  }

  async run(msg) {
    let manager = new MusicManager()
    await manager.shuffle()
  }
}