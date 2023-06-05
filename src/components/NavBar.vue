<template>
    <nav
      class="navbar fixed z-10 w-full border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
    >
      <div class="flex h-14 items-center">
        <div class="flex w-full justify-between px-4">
          <breadcrumbs :items="route.meta.breadcrumbs" />
          <Button
            test="Tlogout"
            icon="logout"
            type="secondary"
            label="Déconnexion"
            class="text-red-600 hover:bg-red-100"
            :submit="false"
            @click="logout"
          />
        </div>
      </div>
    </nav>
</template>

<script lang="ts" setup>
import Breadcrumbs from './common/Breadcrumbs.vue'
import Button from './common/Button.vue'

import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@stores/user.js'

const user = useUserStore()

const route = useRoute()
const router = useRouter()

const logout = () => {
  user.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  width: inherit;
}
</style>