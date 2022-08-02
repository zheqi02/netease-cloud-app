import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/SearchPage.vue')
  }
]

export default routes