<template>
  <NavBar v-if="router.currentRoute._value.name !== 'Login'"></NavBar>
  <div class="flex">

    <SideNav v-if="router.currentRoute._value.name !== 'Login'"></SideNav>
    <div class="w-full pt-2 px-4">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
  import SideNav from './components/SideNav.vue'
  import NavBar from "./components/NavBar.vue";
  import {useRouter} from "vue-router";

  const router = useRouter()
  console.log(router)
</script>
