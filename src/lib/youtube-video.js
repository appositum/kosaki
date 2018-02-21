// Thanks yeager-j for this
// https://github.com/yeager-j/content-bot
module.exports =  class YouTubeVideo {
  constructor(video, message) {
    this._video = video
    this._message = message
    this._title = video.title
  }

  get title() {
    return this._title
  }

  set title(value) {
    this._title = value
  }
  get message() {
    return this._message
  }

  set message(value) {
    this._message = value
  }
  get video() {
    return this._video
  }

  set video(value) {
    this._video = value
  }

  get link() {
    return `https://youtube.com/watch?v=${this.video.id}`
  }

  get requestedBy() {
    return this.message.member.displayName
  }

  get videoLength() {
    return this.video.durationSeconds
  }
}