<script setup lang="ts">
import { useMusicPlay } from '@/store/musicPlay'

const store = useMusicPlay()
</script>

<template>
  <div h-24 p-y-2 border-t-1 border-zinc-400 flex items-center>
    <img rounded-lg block w-20 h-full class="img" :src="store.picUrl" />
    <div border h-full w-30>
      <div>{{ store.musicName }}</div>
      <div>{{ store.singer }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
