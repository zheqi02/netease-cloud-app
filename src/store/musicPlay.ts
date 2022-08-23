import { defineStore } from 'pinia'
import type { SongData } from './types'

export const useMusicPlay = defineStore('musicPlay', {
  state: (): {
    playing: boolean
    loopMode: string
    current: number
    list: SongData[]
    musicDom: HTMLAudioElement | null
    timer: any
    currentTime: number
    duration: number
    comTime: number
    comTimes: string
    totalTime: string
  } => ({
    playing: false,
    loopMode: '列表循环',
    current: 0,
    list: [],
    musicDom: new Audio(),
    timer: null,
    currentTime: 0,
    duration: 0,
    comTime: 0,
    comTimes: '00:00',
    totalTime: '00:00'
  }),
  actions: {
    pause() {
      if (this.musicDom) {
        this.musicDom.pause()
        this.playing = false
        clearInterval(this.timer)
      }
    },
    playStart() {
      if (this.musicDom) {
        this.musicDom.play()
        this.playing = true
      }
    },
    play() {
      if (this.list.length < 1) return
      if (this.musicDom) {
        this.musicDom.src = this.list[this.current].url
        this.musicDom.play()
        this.playing = true
        this.timer = setInterval(() => {
          this.currentTime = this.musicDom!.currentTime
          this.duration = this.musicDom!.duration
          if (this.currentTime === this.duration) {
            switch (this.loopMode) {
              case '列表循环':
                this.next()
                break
              case '单曲循环':
                this.musicDom!.currentTime = 0
                this.musicDom!.play()
                break
              case '随机播放':
                this.shuffle()
                break
              case '顺序播放':
                this.endLoop()
                break
            }
          }
          this.comTime = Math.round((this.currentTime / this.duration) * 100)
          const minu = isNaN(Math.round(this.currentTime / 60))
            ? 0
            : Math.round(this.currentTime / 60)
          const sec = isNaN(Math.round(this.currentTime % 60))
            ? 0
            : Math.round(this.currentTime % 60)
          const totalMinu = isNaN(Math.round(this.duration / 60))
            ? 0
            : Math.round(this.duration / 60)
          const totalSec = isNaN(Math.round(this.duration % 60))
            ? 0
            : Math.round(this.duration % 60)
          this.comTimes = `${minu < 10 ? `0${minu}` : minu}:${
            sec < 10 ? `0${sec}` : sec
          }`
          this.totalTime = `${totalMinu < 10 ? `0${totalMinu}` : totalMinu}:${
            totalSec < 10 ? `0${totalSec}` : totalSec
          }`
        }, 1000)
      }
    },
    shuffle() {
      const index = Math.floor(Math.random() * this.list.length)
      this.current = index
      this.play()
    },
    endLoop() {
      this.current++
      if (this.current !== this.list.length) this.play()
      else this.pause()
    },
    next() {
      this.current++
      if (this.current >= this.list.length) this.current = 0
      this.play()
    },
    prev() {
      this.current--
      if (this.current < 0) this.current = this.list.length - 1
      this.play()
    },
    clear() {
      this.musicDom!.src = ''
      this.musicDom!.currentTime = 0
      this.comTime = 0
      this.list = []
      this.current = 0
      this.pause()
    },
    addSongs(obj: SongData) {
      let flag = true
      this.list.forEach((item) => {
        if (item.id === obj.id) flag = false
      })
      flag && this.list.unshift(obj)
    },
    addSongAndPlay(obj: SongData) {
      let flag = true
      this.list.forEach((item) => {
        if (item.id === obj.id) flag = false
      })
      if (!flag) return
      this.addSongs(obj)
      this.current = 0
      this.play()
    },
    addSong(obj: SongData) {
      let flag = true
      this.list.forEach((item) => {
        if (item.id === obj.id) flag = false
      })
      flag && this.list.push(obj)
    },
    delete(songName: string) {
      this.list = this.list.filter(e => e.name !== songName)
      this.current = 0
      this.play()
    }
  },
  getters: {
    musicName(state) {
      if (state.list.length < 1) return '暂无音乐'
      return state.list[state.current].name
    },
    singer(state) {
      if (state.list.length < 1) return '暂无歌手'
      return state.list[state.current].singer
    },
    picUrl(state) {
      if (state.list.length < 1) return 'https://picsum.photos/200/300'
      return state.list[state.current].pic
    }
  }
})
