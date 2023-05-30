<template>
  <div v-if="route.name === 'Login'">
    <Login />
  </div>
  <div v-else class="main-wrapper overflow-hidden bg-gray-50 dark:bg-gray-900">
    <SideNav class="main-sidebar min-w-1/4"></SideNav>
    <div class="main-content h-full w-full bg-gray-50 dark:bg-gray-900">
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

<style scoped>
.main-wrapper {
  display: table;
}

.main-sidebar {
  display: none;
}

.main-content {
  display: table-cell;
  max-width: 100vw;
  overflow: hidden;
}

@media screen and (min-width: 1024px) {
  .main-sidebar {
    min-width: 16rem;
    display: table-cell;
  }

  .main-content {
    width: calc(100vw - 16rem);
    max-width: calc(100vw - 16rem);
  }
}
</style>
