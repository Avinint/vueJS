<template>
  <router-link :to="props.link" class="flex items-center w-full justify-between">
    <div v-if="props.icon" v-html="props.icon"></div>
    <span class="flex-1 ml-3 whitespace-nowrap">{{ props.label }}</span>
    <span class="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300" v-if="props.tag">{{ props.tag }}</span>
  </router-link>
</template>

<script setup>
  const props = defineProps({
    link: String,
    tag: String,
    icon: String,
    label: String
  })
</script>
