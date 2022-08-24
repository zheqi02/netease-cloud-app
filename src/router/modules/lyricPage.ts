import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/lyric',
    name: 'lyric',
    component: () => import('@/views/LyricPage.vue')
  }
]

export default routes
