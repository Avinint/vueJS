<template>
  <div class="flex items-center">
    <div class="divider"></div>
    <h2 class="ml-4 header-text font-medium">{{ text }}</h2>
  </div>
</template>

<script setup lang="ts">
defineProps<{
    text: string
}>()
</script>

<style scoped>
.divider {
  width: 20px;
  height: 1px;
  border: 1px solid #DE001A;
}

.header-text {
  font-family: 'Esphimere', 'sans-serif';
  font-size: 18px;
}
</style>