<template>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.3/flowbite.min.css" rel="stylesheet" />
  <div class="w-6/6">
    <router-view></router-view>
  </div>
</template>

<script setup>
  import {useRouter} from "vue-router";


  const router = useRouter()
</script>