<template>
  <UserList v-if="router.name !== 'Login'"></UserList>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
import SideNav from './../components/SideNav.vue'
import UserList from './../components/User.vue'
</script>

<style scoped></style>
