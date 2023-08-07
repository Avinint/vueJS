<template>
  <div class="rounded-lg border border-gray-200 bg-white p-6" :class="{'shadow': shadow, 'my-2': my2}">
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  shadow: { 
    type: Boolean,
    default: true,
  },

  my2: {
    type: Boolean,
    default: false,
  }
})
</script>

<style scoped></style>
