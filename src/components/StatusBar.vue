<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { iconList } from './iconList'

const router = useRouter()
const titlebarMinimize = $ref<null | HTMLElement>(null)
const titlebarMaximize = $ref<null | HTMLElement>(null)
const titlebarClose = $ref<null | HTMLElement>(null)
let maxIcon: string = $ref(iconList[0])

onMounted(() => {
  titlebarMinimize?.addEventListener('click', () => appWindow.minimize())
  titlebarMaximize?.addEventListener('click', async() => {
    appWindow.toggleMaximize()
    const isMin = await appWindow.isMaximized()
    if (isMin) maxIcon = iconList[0]
    else maxIcon = iconList[1]
  })
  titlebarClose?.addEventListener('click', () => appWindow.close())
})

const statusBar = $ref<
  {
    name: string
    shortcut: string
  }[]
>([
  {
    name: '搜索',
    shortcut: 'F'
  },
  {
    name: '排行',
    shortcut: 'P'
  },
  {
    name: '歌单',
    shortcut: 'G'
  },
  {
    name: '收藏',
    shortcut: 'C'
  },
  {
    name: '下载',
    shortcut: 'D'
  },
  {
    name: '设置',
    shortcut: 'T'
  }
])

const handlerBar = (shortcut: string) => {
  switch (shortcut) {
    case 'F':
      router.push('/')
      break
  }
}
</script>

<template>
  <div
    data-tauri-drag-region select-none border-b-1 border-zinc-400 rounded-tr rounded-tl flex justify-between
    items-center h-7 w-screen
  >
    <div pl-2 flex items-center space-x-4 class="rainbow-text">
      <img rounded h-4 src="/favicon.ico" alt="">
      <div
        v-for="(item, index) in statusBar" :key="index" cursor-pointer underline-zinc-500 hover:underline
        hover:underline-offset-2 text-sm @click="handlerBar(item.shortcut)"
      >
        {{ item.name }}({{ item.shortcut }})
      </div>
    </div>
    <div flex space-x-4 pr-2>
      <div ref="titlebarMinimize" cursor-pointer>
        <div text-sky-500 hover:text-sky-600 text-xl i-fluent:minimize-24-regular />
      </div>
      <div ref="titlebarMaximize" cursor-pointer>
        <div text-sky-600 hover:text-sky-600 :class="maxIcon" />
      </div>
      <div ref="titlebarClose" cursor-pointer>
        <div text-sky-700 hover:text-sky-600 i-ion:close-round />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
