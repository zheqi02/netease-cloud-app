import { createRouter, createWebHashHistory } from 'vue-router'

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = []
// 遍历vite提供的接口下的所有路由文件，依次放入routes
const modules: Record<string, any> = import.meta.glob('./modules/*.ts', {
  eager: true
}) // 引入所有路由文件
for (const path in modules) {
  // 将每个路由文件的默认路由放入routes
  routes.push(...modules[path].default)
}

const router = createRouter({
  history: createWebHashHistory(),
  routes // short for `routes: routes`
})

export default router // 导出router
