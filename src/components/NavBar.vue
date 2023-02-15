<template>
  <div>
    <nav class="w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div class="h-14 flex items-center">
        <div class="flex justify-between w-full px-4">
          <breadcrumbs :items="route.meta.breadcrumbs" />
          <Button @click="logout" icon="logout" type="secondary" label="Deconnexion" class="text-red-600 hover:bg-red-100"/>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>

  import Breadcrumbs from "./common/Breadcrumbs.vue";
  import Button from "./common/Button.vue";

  import {useRoute, useRouter} from "vue-router";
  import {useUserStore} from "../stores/user.js";

  const user = useUserStore()

  const route = useRoute()
  const router = useRouter()

  const logout = () => {
    user.logout()
    router.push('/login')
  }

</script>
