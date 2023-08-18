<script setup lang="ts">
  const props = defineProps({
    marginTop: {type: String, default: '10px'}
  })
</script>

<template>
<p :style="{ marginTop: props.marginTop}">* Champ obligatoire</p>
</template>

<style scoped lang="scss">


</style>