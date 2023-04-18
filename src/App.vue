<template>
  <div v-if="route.name === 'Login'">
    <Login />
  </div>
  <div v-else class="flex overflow-hidden bg-gray-50 dark:bg-gray-900">
    <SideNav class="min-w-1/4"></SideNav>
    <div class="h-full w-full bg-gray-50 dark:bg-gray-900 lg:ml-64">
      <NavBar />
      <div class="min-h-screen w-full overflow-auto bg-white px-4 pt-20">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import SideNav from './components/SideNav.vue'
import NavBar from './components/NavBar.vue'
import { useRoute } from 'vue-router'
import Login from './pages/login.vue'

const route = useRoute()
</script>
