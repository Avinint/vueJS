<template>
  <div class="flex items-center">
    <div class="divider"></div>
      <h2 :class="[ uppercase ? 'uppercase': '' , textSize ]" class="ml-4  font-medium">{{ text }}</h2>
  </div>
</template>

<script>
export default {
  name: "HeaderModal",
}
</script>

<script setup>
 defineProps({
   text: String,
   textSize: { type: String, default: 'header-text' },
   uppercase: { type: Boolean, default: false },
 })
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