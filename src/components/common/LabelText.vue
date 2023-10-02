<template>
    <label class="label-text">{{ text }}</label>
</template>

<script setup lang="ts">
defineProps<{
    text: string
}>()
</script>

<style scoped>
.label-text {
  position: relative;
  font-size: 16px;  
  text-transform: uppercase;
  color: #161616;
  display: block;
}
.label-text::before {
  content: "";
  position: absolute;
  background-color: #DE001A;
  width: 20px;
  height: 1px;
  left: -30px;
  top: 50%;
}
</style>