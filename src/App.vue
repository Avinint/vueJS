<template>
  <NavBar v-if="route.name !== 'Login'"></NavBar>
  <div class="flex">
    <SideNav v-if="route.name !== 'Login'"></SideNav>
    <div class="w-full pt-2 px-4">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
  import SideNav from './components/SideNav.vue'
  import NavBar from "./components/NavBar.vue";
  import {useRoute} from "vue-router";

  const route = useRoute()
</script>
