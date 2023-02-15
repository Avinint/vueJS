import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import {useUserStore} from "./stores/user.js";

const pinia = createPinia()

createApp(App)
  .use(router)
  .use(pinia)
  .mount('#app')

const userStore = useUserStore()
