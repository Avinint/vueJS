<template>
  <div v-if="route.name === 'Login'">
    <Login/>
  </div>
  <div v-else class="flex overflow-hidden bg-gray-50 dark:bg-gray-900">
    <SideNav  class="min-w-1/4"></SideNav>
    <div class=" w-full h-full bg-gray-50 lg:ml-64 dark:bg-gray-900">
      <NavBar/>
      <div class="w-full pt-20 px-4 bg-gray-100 overflow-auto">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
  import SideNav from './components/SideNav.vue'
  import NavBar from "./components/NavBar.vue";
  import {useRoute} from "vue-router";
  import Login from "./pages/login.vue";

  const route = useRoute()
</script>
