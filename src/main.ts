import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import 'normalize.css'

import { ConfigProvider } from 'vant'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(ConfigProvider)
app.mount('#app')
