require('dotenv').config()

// Thanks yeager-j for this
// https://github.com/yeager-j/content-bot
const ytdl = require('ytdl-core')
const YouTube = require('simple-youtube-api')
const YouTubeVideo = require('./youtube-video')
const _ = require('underscore')

const { YOUTUBE_KEY } = process.env

let instance = null

module.exports = class MusicManager {
  constructor() {
    if (!instance) {
      instance = this
    }

    this._queue = []
    this.dispatcher = null
    this.connection = null
    this.currentSong = null
    this.message = null
    this.yt = new YouTube(YOUTUBE_KEY)

    return instance
  }

  async setUpVideo(message, query) {
    this.message = message

    if (!message.member.voiceChannel) {
      this.respond('Você precisa estar em um canal de voz!')
      return
    }

    try {
      let results = await this.yt.searchVideos(query)
      let song = new YouTubeVideo(results[0], message)
      this.connection = await message.member.voiceChannel.join()
      this.addToQueue(song)
      if (!this.currentSong) {
        await this.play(song)
      }
    } catch (e) {
      this.respond('Sou incapaz de tocar essa música por alguma razão idiota.')
      console.log(e)
    }
  }

  async play(song) {
    this.currentSong = song
    this.respond(`**Tocando agora** ${song.title}\n**Adicionado por ** ${song.requestedBy}`)

    let stream = ytdl(`http://youtube.com/watch?v=${song.video.id}`, { audioonly: true })
    this.dispatcher = this.connection.playStream(stream)
      .on('end', () => {
        this.queue.shift()

        if (this.queue.length > 0) {
          setTimeout(() => this.play(this.queue[0]), 400)
        } else {
          this.respond('AAAAH!!! Terminou a playlist. Tchau pessoal.')
          this.currentSong = null
          this.connection.disconnect()
        }
      })
  }

  addToQueue(song) {
    this.respond(`Adicionado **${song.title}** para a playlist.`)
    this.queue.push(song)
  }

  skip() {
    if (this.currentSong && this.queue.length > 1) {
      this.respond(`Pulando ${this.currentSong.title}`)
      this.dispatcher.end()
    } else if (this.queue.length === 1) {
      this.respond('A fila está vazia! Parar...')
      this.stop()
    } else {
      this.respond('Não há um vídeo tocando!')
    }
  }

  pause() {
    this.dispatcher.pause()
  }

  resume() {
    this.dispatcher.resume()
  }

  stop() {
    if (this.currentSong) {
      this.queue = []
      this.dispatcher.end()
      this.currentSong = null
    }
  }

  respond(response) {
    if (this.message) {
      this.message.channel.send(response)
    }
  }

  shuffle() {
    let clone = this.queue.slice()
    clone.splice(0, 1)
    clone = _.shuffle(clone)

    let newArr = [this.queue[0]]
    clone.forEach(c => newArr.push(c))
    this.respond('Embaralhando a lista.')

    this.queue = newArr
  }

  get queue() {
    return this._queue
  }

  set queue(value) {
    this._queue = value
  }
}