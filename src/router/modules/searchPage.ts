import type { RouteRecordRaw } from 'vue-router'
import searchPage from '@/views/SearchPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/search',
    name: 'search',
    component: searchPage
  }
]

export default routes