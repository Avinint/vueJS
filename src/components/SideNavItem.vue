<template>
  <router-link
    :to="props.path"
    class="flex w-full items-center justify-between"
  >
    <div v-if="props.icon" class="text-red-600" v-html="props.icon"></div>
    <span class="ml-3 flex-1 whitespace-nowrap">{{ props.label }}</span>
    <span
      v-if="props.tag"
      class="ml-3 inline-flex items-center justify-center rounded-full bg-gray-200 px-2 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300"
      >{{ props.tag }}</span
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
