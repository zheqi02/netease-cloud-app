import { createApp } from 'vue'
import App from './App.vue'

import { createPinia } from 'pinia'
import router from './router'

import 'uno.css'
import '@unocss/reset/tailwind.css'
import 'element-plus/es/components/message/style/css'

const app = createApp(App)
app.use(createPinia()).use(router)
app.mount('#app')
