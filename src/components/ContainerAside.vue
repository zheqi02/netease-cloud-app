<script setup lang="ts">
import { useMusicPlay } from '@/store/musicPlay'

const store = useMusicPlay()
</script>

<template>
  <div w-200px h-full rounded-bl p-x-2 border-r-1 border-zinc-300>
    <ul w-full h-full overflow-y-auto overflow-x-hidden>
      <div opacity-60 flex mt mb border-b-1 h-8 border-blue-500 justify-between items-center>
        <div text-blue-500>
          播放列表
        </div>
        <button border-r-2 border-t-2 rounded text-blue-500 @click="store.clear()">
          清空
        </button>
      </div>
      <li v-for="item in store.list" :key="item.id" h-8 border-b-1 mt-3 justify-between flex>
        <div text-zinc-700 :class="{ isActive: store.currentName === item.name ? true : false }">
          {{ item.name }}
        </div>
        <button text-zinc-500 mr-2 @click="store.delete(item.name)">
          删除
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* 整个滚动条 */
::-webkit-scrollbar {
  @apply w-2 h-2;
}

/* 滚动条上的滚动滑块 */
::-webkit-scrollbar-thumb {
  @apply bg-sky-200;
  border-radius: 32px;
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
  @apply bg-zinc-50;
  border-radius: 32px;
}

.isActive{
  @apply text-sky-400;
}
</style>
