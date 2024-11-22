import { createApp } from 'vue'

import './style.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import router from '@/router/index'


const app = createApp(App)

app.use(router)
app.use(createPinia())
app.use(ElementPlus)
app.mount('#app')

// 现在，应用已经启动了！
