import { defineStore } from 'pinia'
import { SongData } from './types'

export const useMusicPlay = defineStore('musicPlay', {
  state: (): {
    playing: boolean
    current: number
    list: Set<SongData>
    musicDom: HTMLAudioElement | null
  } => ({
    playing: false,
    current: 0,
    list: new Set(),
    musicDom: new Audio()
  }),
  actions: {
    pause() {},
    play() {},
    next() {},
    prev() {},
    clear() {},
    addSongs(obj: SongData) {
      let flag = true
      this.list.forEach(item => {
        if (item.id === obj.id) 
          flag = false
      })
      flag && this.list.add(obj)
      console.log(this.list)
    }
  }
})
