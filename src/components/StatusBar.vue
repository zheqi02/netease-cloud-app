<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const titlebarMinimize = $ref<null | HTMLElement>(null)
const titlebarMaximize = $ref<null | HTMLElement>(null)
const titlebarClose = $ref<null | HTMLElement>(null)

onMounted(() => {
  titlebarMinimize?.addEventListener('click', () => appWindow.minimize())
  titlebarMaximize?.addEventListener('click', () => appWindow.toggleMaximize())
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
    name: '收藏',
    shortcut: 'C'
  },
  {
    name: '下载',
    shortcut: 'D'
  },
  {
    name: '设置',
    shortcut: 'S'
  }
])

const handlerBar = (shortcut: string) => {
  switch(shortcut) {
    case 'F':
      router.push('/search')
      break
  }
}
</script>

<template>
  <div
    data-tauri-drag-region
    border-b-1
    border-zinc-400
    rounded-tr
    rounded-tl
    flex
    justify-between
    items-center
    h-7
    w-screen
  >
    <div pl-2 flex items-center space-x-4 class="rainbow-text">
      <img rounded h-4 src="/favicon.ico" alt="" />
      <div
        v-for="(item, index) in statusBar"
        :key="index"
        @click="handlerBar(item.shortcut)"
        cursor-pointer
        underline-blue-600
        hover:underline
        hover:underline-offset-2
        text-sm
      >
        {{ item.name }}({{ item.shortcut }})
      </div>
    </div>
    <div flex space-x-4 pr-2>
      <div cursor-pointer ref="titlebarMinimize">
        <div
          text-indigo-600
          hover:text-sky-600
          text-xl
          i-fluent:minimize-24-regular
        ></div>
      </div>
      <div cursor-pointer ref="titlebarMaximize">
        <div text-indigo-700 hover:text-sky-600 i-uil:window-maximize></div>
      </div>
      <div cursor-pointer ref="titlebarClose">
        <div text-indigo-800 hover:text-sky-600 i-ion:close-round></div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
