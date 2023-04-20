import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'

const pinia = createPinia()
const app = createApp(App)

dayjs.locale('fr')
app.config.globalProperties.$dayjs = dayjs

app.use(router).use(pinia).mount('#app')
