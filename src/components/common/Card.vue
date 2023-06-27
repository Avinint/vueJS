<template>
  <div class="rounded-lg border border-gray-200 bg-white p-6" :class="{'shadow': shadow}">
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  shadow: { 
    type: Boolean,
    default: true,
  }
})
</script>

<style scoped></style>
