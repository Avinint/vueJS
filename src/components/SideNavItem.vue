<template>
  <router-link
    :to="path"
    class="flex w-full items-center justify-between"
  >
    <div v-if="icon" class="text-red-600" v-html="icon"></div>
    <span class="ml-3 flex-1 whitespace-nowrap">{{ label }}</span>
    <span
      v-if="tag"
      class="ml-3 inline-flex items-center justify-center rounded-full w-5 px-1 text-sm font-medium bg-red-500 text-white"
      >{{ tag }}</span
    >
  </router-link>
</template>

<script setup>
const props = defineProps({
  path: String,
  tag: String,
  icon: String,
  label: String,
})
</script>
