<script setup lang="ts">
import {
  useVirtualList,
  useDateFormat,
  useFetch,
  useDebounceFn
} from '@vueuse/core'
import request from '@/api'
import { computed, watch, onMounted } from 'vue'

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
const { data } = await useFetch('/api/search/hot/detail').get().json()
const hotSearch = data.value?.data

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
      isShowList = false
      isShowLoading = true
      searchStart()
    }
  }, 350),
  {
    immediate: true
  }
)

const searchStart = async () => {
  if (searchName.length < 1) {
    return
  }
  allItems = []
  const res = await request({
    url:
      `/cloudsearch?keywords=${searchName}&limit=100` +
      import.meta.env.VITE_APP_ENDURL,
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
  isShowList = false
  isShowLoading = false
}

const filteredList = computed(() => allItems)
const { list, containerProps, wrapperProps } = useVirtualList(filteredList, {
  itemHeight: 22
})
</script>

<template>
  <div h-full w-full class="lg:w-70% lg:mx-15%">
    <div h-24 flex justify-center items-center>
      <div flex items-center w-70 lg:w-115 rounded border-2 border-sky-200>
        <input
          type="text"
          class="inp"
          v-model="searchName"
          w-60
          lg:w-100
          border-r-1
          border-pink-200
          placeholder:italic
          placeholder:text-slate-400
          focus:outline-none
          focus:border-sky-500
          focus:ring-sky-500
          focus:ring-1
          sm:text-sm
        />
        <div
          text-xl
          text-green-600
          w-10
          lg:w-15
          cursor-pointer
          i-material-symbols:search-rounded
          @click="searchStart"
        ></div>
      </div>
    </div>
    <div
      h-10
      flex
      border-b-1
      border-zinc-200
      space-x-4
      items-center
      justify-between
      v-show="!isShowList"
    >
      <div class="w-1/15" ml justify-self-start>排序</div>
      <div justify-self-start>收藏</div>
      <div class="w-1/5" justify-self-start>歌曲</div>
      <div class="w-1/5" justify-self-start>歌手</div>
      <div class="w-1/5" justify-self-start>时长</div>
    </div>
    <el-skeleton :rows="20" animated v-show="isShowLoading" />
    <div
      v-show="!isShowList && !isShowLoading"
      v-bind="(containerProps as any)"
      class="h-[calc(100%-8.5rem)]"
    >
      <div v-bind="wrapperProps">
        <div
          v-for="item in list"
          :key="item.index"
          h-10
          flex
          border-b-1
          border-zinc-200
          space-x-4
          items-center
          justify-between
        >
          <div class="w-1/15" ml justify-self-start>{{ item.index + 1 }}</div>
          <div justify-self-start text-lg i-mdi:cards-heart-outline></div>
          <div class="w-1/5" justify-self-start>{{ item.data.name }}</div>
          <div class="w-1/5" justify-self-start>
            {{ item.data.ar }}
          </div>
          <div class="w-1/5" justify-self-start>{{ item.data.dt }}</div>
        </div>
      </div>
    </div>
    <div v-show="isShowList" overflow-y-auto class="p-x-15%">
      <h2 text-2xl text-sky-400>热搜列表</h2>
      <p
        mt-3
        border-b-1
        border-zinc-400
        v-for="item in hotSearch"
        :key="item.score"
      >
        {{ item.searchWord }} - {{ item.content }}
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
