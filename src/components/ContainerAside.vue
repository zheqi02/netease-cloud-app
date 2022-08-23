<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useMusicPlay } from '@/store/musicPlay'

const store = useMusicPlay()
const router = useRouter()
const activeName = $ref('first')

const menu = $ref<
  {
    id: number
    name: string
    active: boolean
  }[]
>([
  {
    id: 1,
    name: '首页',
    active: false
  },
  {
    id: 2,
    name: '分类',
    active: false
  },
  {
    id: 3,
    name: '排行榜',
    active: false
  }
])

const handlerClick = async(id: number) => {
  switch (id) {
    case 1:
      router.push('/')
      break
  }
  menu.forEach((item) => {
    item.active = item.id === id
  })
}

const deleteItem = () => {
  store.delete()
}
</script>

<template>
  <div w-200px h-full rounded-bl p-x-2 border-r-1 border-zinc-400>
    <el-tabs v-model="activeName" stretch class="demo-tabs">
      <el-tab-pane space-y-4 label="首页菜单" name="first">
        <div
          v-for="item in menu"
          :key="item.id"
          flex
          items-center
          border-2
          class="status-text"
          rounded-1
          border-purple-400
          cursor-pointer
          justify-center
          :style="{
            'border-color': item.active ? '#00997799' : '',
            'color': item.active ? '#00997799' : ''
          }"
          @click="handlerClick(item.id)"
        >
          <div>{{ item.name }}</div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="播放列表" name="second">
        <button border rounded @click="store.clear()">
          清空
        </button>
        <ul mt>
          <li v-for="item in store.list" :key="item.id" flex>
            <div>{{ item.name }}</div>
            <button ml-2 border @click="deleteItem">
              删除
            </button>
          </li>
        </ul>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped></style>
