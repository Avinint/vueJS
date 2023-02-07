<template>
  <div class="flex">
    <div class="w-1/6">
      <SideNav v-if="router.name !== 'Login'"></SideNav>
    </div>
    <div class="w-5/6">
      <UserList v-if="router.name !== 'Login'"></UserList>
    </div>
  </div>
</template>

<script setup>

import {ref} from "vue";
import {useRouter} from "vue-router";

const router = useRouter()
import SideNav from './../components/SideNav.vue'
import UserList from './../components/User.vue'

</script>

<style scoped>

</style>