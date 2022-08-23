import searchPage from '@/views/SearchPage.vue'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'search',
    component: searchPage
  }
]

export default routes
