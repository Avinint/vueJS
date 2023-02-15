<template>
  <div class="flex">
    <SideNav v-if="route.name !== 'Login'" class="min-w-1/4"></SideNav>
    <div class="flex flex-col w-full">
      <NavBar v-if="route.name !== 'Login'"></NavBar>
      <div class="w-full pt-2 px-4 bg-gray-100 h-screen">
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
