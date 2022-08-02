import { defineStore } from 'pinia'
import { SongData } from './types'

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
    loopMode: 'listLoop',
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
    play() {
      if (this.musicDom) {
        this.musicDom.src = this.list[this.current].url
        this.musicDom.play()
        this.playing = true
        this.timer = setInterval(() => {
          this.currentTime = this.musicDom!.currentTime
          this.duration = this.musicDom!.duration
          if (this.currentTime === this.duration) {
            switch (this.loopMode) {
              case 'listLoop':
                this.next()
                break
              case 'singleLoop':
                this.musicDom!.currentTime = 0
                this.musicDom!.play()
                break
              case 'shuffle':
                this.shuffle()
                break
              case 'endLoop':
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
          this.comTimes = `${minu < 10 ? '0' + minu : minu}:${
            sec < 10 ? '0' + sec : sec
          }`
          this.totalTime = `${totalMinu < 10 ? '0' + totalMinu : totalMinu}:${
            totalSec < 10 ? '0' + totalSec : totalSec
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
      this.list = []
      this.current = 0
      this.pause()
    },
    addSongs(obj: SongData) {
      let flag = true
      this.list.forEach(item => {
        if (item.id === obj.id) flag = false
      })
      flag && this.list.unshift(obj)
    },
    addSongAndPlay(obj: SongData) {
      this.addSongs(obj)
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
      if (state.list.length < 1)
        return 'https://tva4.sinaimg.cn/large/0072Vf1pgy1foxkc9gjl2j31hc0u0h7m.jpg'
      return state.list[state.current].pic
    }
  }
})
