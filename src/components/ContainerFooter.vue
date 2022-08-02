<script setup lang="ts">
import { useMusicPlay } from '@/store/musicPlay'
import { reactive } from 'vue'
import { useDebounceFn } from '@vueuse/core'

const store = useMusicPlay()

const loopModeList = reactive<
  {
    dataIcon: string
    dataInline: boolean
    isShow: boolean
    title: string
  }[]
>([
  {
    dataIcon: 'i-ic-round-loop',
    dataInline: false,
    isShow: true,
    title: '列表循环'
  },
  {
    dataIcon: 'i-ic:outline-playlist-play',
    dataInline: false,
    isShow: false,
    title: '顺序播放'
  },
  {
    dataIcon: 'i-ic-outline-looks-one',
    dataInline: false,
    isShow: false,
    title: '单曲循环'
  },
  {
    dataIcon: 'i-ic-round-manage-history',
    dataInline: false,
    isShow: false,
    title: '随机播放'
  }
])

const handleClickLoopModeIcon = (index: number) => {
  loopModeList[index].isShow = false
  if (index === loopModeList.length - 1) {
    loopModeList[0].isShow = true
    store.loopMode = loopModeList[0].title
  } else {
    loopModeList[index + 1].isShow = true
    store.loopMode = loopModeList[index + 1].title
  }
}

const airborne = useDebounceFn(val => {
  store.musicDom!.currentTime = (store.musicDom!.duration * val) / 100
}, 100)
document.addEventListener('resize', airborne)

const play = () => {
  if(store.currentTime < 1){
    store.play()
  } else {
    store.playStart()
  }
}

</script>

<template>
  <div
    h-24
    p-y-2
    p-l-4
    border-t-1
    border-zinc-400
    flex
    space-x-16
    lg:justify-between
    lg:pr-64
    items-center
  >
    <div h-full flex>
      <img rounded-lg block w-20 h-full class="img" :src="store.picUrl" />
      <div
        ml-10
        flex
        flex-col
        justify-around
        text-sm
        class="status-text"
        h-full
        w-30
      >
        <div>{{ store.musicName }}</div>
        <div>{{ store.singer }}</div>
      </div>
    </div>
    <div h-full lg:w-200 w-100 flex flex-col justify-center>
      <div flex text-sky-400 justify-center items-center space-x-4 text-3xl>
        <div
          @click="store.prev()"
          cursor-pointer
          hover:text-red-400
          i-ic:round-skip-previous
        ></div>
        <div
          border
          hover:bg-zinc-100
          border-sky-300
          cursor-pointer
          rounded-full
          hover:border-red-400
        >
          <div
            v-show="!store.playing"
            @click="play()"
            hover:text-red-400
            i-ic:round-play-arrow
          ></div>
          <div
            v-show="store.playing"
            @click="store.pause()"
            hover:text-red-400
            i-ic:round-pause
          ></div>
        </div>
        <div
          @click="store.next()"
          cursor-pointer
          hover:text-red-400
          i-ic:round-skip-next
        ></div>
      </div>
      <div flex justify-between items-center>
        <div class="demonstration text-xs mr-5">{{ store.comTimes }}</div>
        <el-slider
          @input="airborne"
          v-model="store.comTime"
          :show-tooltip="false"
        />
        <div class="demonstration text-xs ml-5">{{ store.totalTime }}</div>
      </div>
    </div>
    <div h-full text-sky-400 flex text-xl space-x-4 items-end mb-8 ml-4>
      <div>
        <template v-for="(item, index) in loopModeList" :key="index">
          <div
            v-show="item.isShow"
            :title="item.title"
            @click="handleClickLoopModeIcon(index)"
          >
            <div
              class="iconify text-lg hover:text-red-400 cursor-pointer"
              :class="item.dataIcon"
            ></div>
          </div>
        </template>
      </div>
      <div text-sm text-sky-400 hover:text-red-400 cursor-pointer>词</div>
      <div i-ic:baseline-volume-up></div>
      <!-- <div i-ic:round-volume-off></div> -->
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-slider__button-wrapper) {
  display: none;
}
</style>
