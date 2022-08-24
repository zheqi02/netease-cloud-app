<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { watchEffect } from 'vue'
import { useMusicPlay } from '@/store/musicPlay'

const { musicLyric, musicName, currentData, currentTime, currentH } = storeToRefs(useMusicPlay())

let arr = $ref<{
  time: number
  key: string
  active: boolean
}[]>([])

const translateY = $computed(() => `${currentH.value}px`)

watchEffect(() => {
  const a = musicLyric.value
  for (let i = 0, len = a.length; i < len; i++) {
    if (a[i].time >= currentData.value - 1500) {
      a.forEach((e) => {
        e.active = false
      })
      a[i].active = true
      break
    }
  }
  arr = a
})

// setInterval(() => {
//   if (currentData.value > 10000)
//     currentH.value -= 13
// }, 1000)

const toLy = () => {
  // TODO: 点击歌词跳转对应进度逻辑，还有个滑块的逻辑
  // ...
}
</script>

<template>
  <div w-full h-full text-center>
    <div m-auto prose>
      <h2 border-b-1>
        {{ musicName }}
      </h2>
    </div>
    <article overflow-y-auto h-68vh m-auto prose>
      <section w-full class="translate">
        <p v-for="item in arr" :key="item.key" cursor-pointer :class="{ isActive: item.active }" @click="toLy">
          {{ item.key }}
        </p>
      </section>
    </article>
  </div>
</template>

<style scoped >
.isActive {
  color: red;
}

.translate {
  /* TODO: 建议改成滚动条距离元素位置，可以使用vueuse */
  transform: translateY(v-bind(translateY));
}

/* 整个滚动条 */
::-webkit-scrollbar {
  @apply w-2 h-2;
}

/* 滚动条上的滚动滑块 */
::-webkit-scrollbar-thumb {
  @apply bg-sky-300;
  border-radius: 32px;
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
  @apply bg-zinc-50;
  border-radius: 32px;
}
</style>
