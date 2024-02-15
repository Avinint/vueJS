<template>
    <nav
      class="navbar fixed z-10 w-full border-b border-gray-200 bg-white"
    >
      <div class="flex h-14 items-end">
        <div class="flex w-full justify-between px-4 pb-2">
          <breadcrumbs :items="route.meta.breadcrumbs" />
          <div class="flex items-center">
            <div class="relative">
              <span ref="nav" @click="openMenu()" class="material-symbols-outlined cursor-pointer">more_horiz</span>
              <div v-if="dropdownList" class="absolute right-0">
                <div class="w-60 h-20 border border-slate-400 rounded-lg z-10 bg-white p-2 text-sm">
                  <router-link to="/preferences-et-confidentialite">
                    <p class="p-2 hover:bg-slate-100">Préférences et confidentialité</p>
                  </router-link>
                </div>
              </div>
            </div>
            <Button
              test="Tlogout"
              icon="logout"
              couleur="secondary"
              label="Déconnexion"
              class="text-red-600 hover:bg-red-100 ml-10"
              :submit="false"
              @click="logout"
            />
          </div>
        </div>
      </div>
    </nav>
</template>

<script lang="ts" setup>
import Breadcrumbs from './common/Breadcrumbs.vue'
import Button from './common/Button.vue'

import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@stores/user.js'

const user = useUserStore()
const route = useRoute()
const router = useRouter()
const dropdownList = ref(false)
const nav = ref(null)

onMounted(() => {
  document.addEventListener("click", (e) => {
    if (e.target === nav.value || e.target.parentNode === nav.value) return
    dropdownList.value = false
  })
})

const logout = () => {
  user.logout()
  router.push('/login')
}

const openMenu = () => {
  dropdownList.value = !dropdownList.value
}
</script>

<style scoped>
.navbar {
  width: inherit;
}
</style>