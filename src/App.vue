<template>
  <div class="flex overflow-hidden bg-gray-50 dark:bg-gray-900">
    <SideNav v-if="route.name !== 'Login'" class="min-w-1/4"></SideNav>
    <div class=" w-full h-full bg-gray-50 lg:ml-64 dark:bg-gray-900">
      <NavBar v-if="route.name !== 'Login'"></NavBar>
      <div class="w-full pt-20 px-4 bg-gray-100 h-screen">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
  import SideNav from './components/SideNav.vue'
  import NavBar from "./components/NavBar.vue";
  import {useRoute} from "vue-router";

  const route = useRoute()
</script>
