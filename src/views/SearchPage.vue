<script setup lang="ts">
import {
  useDateFormat,
  useDebounceFn,
  useFetch,
  useVirtualList
} from '@vueuse/core'
import { computed, onMounted, watch } from 'vue'
import request, { cancelAllRequest } from '@/api'
import { useMusicPlay } from '@/store/musicPlay'

const store = useMusicPlay()

const searchName = $ref('')
let allItems = $ref<
  {
    name: string
    id: number
    dt: string
    ar: string
  }[]
>([])

let isShowList = $ref<boolean>(true)
let isShowLoading = $ref<boolean>(true)

// 使用代理服务器避免部分接口跨域问题
// const { data } = await useFetch(
//   `${import.meta.env.VITE_APP_URL
//     }/search/hot/detail${
//     import.meta.env.VITE_APP_ENDURL}`
// )
//   .get()
//   .json()
// const hotSearch = data.value?.data

onMounted(() => {
  isShowLoading = false
})

watch(
  () => searchName,
  useDebounceFn(() => {
    if (searchName.length < 1) {
      isShowList = true
      isShowLoading = false
    } else {
      // 避免请求冲突，上一个请求还没回来，下一个又来了，就取消上面所有，鬼知道卡了多少个请求
      cancelAllRequest()
      // eslint-disable-next-line no-use-before-define
      searchStart()
      isShowList = false
      isShowLoading = true
    }
  }, 300),
  {
    immediate: true
  }
)

const searchStart = async() => {
  allItems = []
  try {
    const res = await request({
      url:
        `/cloudsearch?keywords=${searchName}&limit=100${import.meta.env.VITE_APP_ENDURL}`,
      method: 'POST'
    })
    res?.result?.songs?.forEach((item: any) => {
      allItems.push({
        name: item.name,
        dt: useDateFormat(item.dt, 'mm:ss').value,
        id: item.id,
        ar: item?.ar
          ?.map((item: any) => item.name)
          .toString()
          .replace(',', '、')
      })
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
  }
  isShowLoading = false
}

const filteredList = computed(() => allItems)
const { list, containerProps, wrapperProps } = useVirtualList(filteredList, {
  itemHeight: 22
})

// 添加歌曲并立即播放，两者只会触发其一
const addSong = async(id: number, name: string) => {
  const song = await request({
    url: `/song/url?id=${id}${import.meta.env.VITE_APP_ENDURL}`,
    method: 'GET'
  })
  const { data } = await useFetch(`/api/search?keywords=${name}&limit=1`)
    .get()
    .json()
  const data2 = song?.data[0]
  store.addSongAndPlay({
    id: data2.id,
    url: data2.url,
    name,
    size: data2.size,
    type: data2.type,
    pic: data.value?.result?.songs[0]?.album?.artist?.img1v1Url,
    singer: data.value?.result?.songs[0]?.artists
      ?.map((item: any) => item.name)
      .toString()
      .replace(',', '、')
  })
}
// 添加歌曲
const addPush = async(id: number, name: string) => {
  const song = await request({
    url: `/song/url?id=${id}${import.meta.env.VITE_APP_ENDURL}`,
    method: 'GET'
  })
  const { data } = await useFetch(`/api/search?keywords=${name}&limit=1`)
    .get()
    .json()
  const data2 = song?.data[0]
  store.addSong({
    id: data2.id,
    url: data2.url,
    name,
    size: data2.size,
    type: data2.type,
    pic: data.value?.result?.songs[0]?.album?.artist?.img1v1Url,
    singer: data.value?.result?.songs[0]?.artists
      ?.map((item: any) => item.name)
      .toString()
      .replace(',', '、')
  })
}
</script>

<template>
  <div h-full w-full text-neutral-700 p-x-2 class="lg:w-70% lg:mx-15%">
    <div h-24 flex justify-center items-center>
      <div flex items-center w-100 lg:w-150 rounded-full border border-sky-300>
        <div w-10 flex justify-center items-center text-blue-300 h-10>
          <div i-system-uicons:search text-3xl />
        </div>
        <input
          v-model="searchName" type="text" class="inp" w-90 focus:outline-none lg:w-150 placeholder:italic placeholder:text-slate-400 p-2 sm:text-sm
        >
      </div>
    </div>
    <div v-show="!isShowList" text-zinc-500 h-10 flex border-b-1 border-zinc-300 space-x-4 items-center justify-between>
      <div class="w-1/10" ml justify-self-start>
        排序
      </div>
      <div class="w-1/10" justify-self-start>
        添加
      </div>
      <div class="w-3/10" justify-self-start>
        歌曲
      </div>
      <div class="w-3/10" justify-self-start>
        歌手
      </div>
      <div class="w-2/10" justify-self-start>
        时长
      </div>
    </div>
    <el-skeleton v-show="isShowLoading" :rows="20" animated />
    <div v-show="!isShowList && !isShowLoading" v-bind="containerProps as any" class="h-[calc(100%-8.5rem)]">
      <div v-bind="wrapperProps">
        <div
          v-for="item in list" :key="item.index" h-10 flex border-b-1 border-zinc-200 space-x-4 last-of-type:pb-3
          items-center overflow-y-hidden justify-between hover:bg-blue-100 @click="addSong(item.data.id, item.data.name)"
        >
          <div class="w-1/10" ml justify-self-start>
            {{ item.index + 1 }}
          </div>
          <div class="w-1/10" h-5 @click.stop="addPush(item.data.id, item.data.name)">
            <div cursor-pointer justify-self-start text-lg i-mdi:cards-heart-outline />
          </div>
          <div class="w-3/10" justify-self-start>
            {{ item.data.name }}
          </div>
          <div class="w-3/10" justify-self-start>
            {{ item.data.ar }}
          </div>
          <div class="w-2/10" justify-self-start>
            {{ item.data.dt }}
          </div>
        </div>
      </div>
    </div>
    <div v-show="isShowList" overflow-y-auto class="p-x-15%">
      <h2 text-2xl text-sky-400>
        热搜列表
      </h2>
      <!-- <p
        v-for="item in hotSearch"
        :key="item.score"
        mt-3
        border-b-1
        border-zinc-400
      >
        {{ item.searchWord }} - {{ item.content }}
      </p> -->
      <p mt-3 border-b-1 border-zinc-400>
        由于接口原因只能用上面搜索框。
        <br>
        第一次搜索可能后端没反应过来，之后就行了。
        <br>
        然后就是点击播放的时间长是因为接口返回问题
        <br>
        可能是部署在vercel上的问题吧，谁知道呢
      </p>
    </div>
  </div>
</template>

<style scoped>
.inp {
  background: none;
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
