<script setup lang="ts">
  const props = defineProps({
    marginTop: {type: String, default: '10px'}
  })
</script>

<template>
<p class="text-sm font-medium text-gray-900 pt-10" :style="{ marginTop: props.marginTop}">* Champ obligatoire</p>
</template>

<style scoped lang="scss">


</style>