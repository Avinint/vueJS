import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import {useUserStore} from "./stores/user.js";
import {toast} from "vue3-toastify";
const notify = () => {
    toast("Wow so easy !", {
        autoClose: 1000,
    }); // ToastOptions
}


const pinia = createPinia()

createApp(App)
  .use(router)
  .use(pinia)
  .mount('#app')

const userStore = useUserStore()
