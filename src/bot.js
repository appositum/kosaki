require('dotenv').config()

const path = require('path')
const { CommandoClient, FriendlyError } = require('discord.js-commando')
const { PREFIX_COMMAND, TOKEN, OWNER_ID } = process.env

const client = new CommandoClient({
  commandPrefix: PREFIX_COMMAND,
  unknownCommandResponse: false,
  owner: OWNER_ID,
  disableEveryone: true
})

client
  .on('error', console.error)
  .on('warn', console.warn)
  .on('debug', console.log)
  .on('ready', () => {
    console.log(`Logado como ${client.user.username}#${client.user.discriminator} (${client.user.id})`)
    client.user.setGame(`Use ${PREFIX_COMMAND}ajuda`)
  })
  .on('disconnect', () => {
    console.warn('Disconnected!')
  })
  .on('reconnecting', () => {
    console.warn('Reconnecting...')
  })
  .on('commandError', (cmd, err) => {
    if (err instanceof FriendlyError) return
    console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err)
  })

client.registry
  .registerDefaultTypes().registerGroups([
    ['diversao', 'Diversão'],
    ['utilidade', 'Utilidades'],
    ['moderation', 'Moderação'],
    ['music', 'Música']
  ])
  .registerDefaultGroups()
  .registerDefaultCommands({
    help: false,
    prefix: false,
    ping: false,
    commandState: false,
    eval_: false
  })
  .registerCommandsIn(path.join(__dirname, 'commands'))

client.login(TOKEN)
