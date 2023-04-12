<template>
  <label
    :for="props.id"
    class="mb-2 block w-1/2 text-sm font-medium text-gray-900"
    ><slot></slot
  ></label>
</template>

<script setup>
const props = defineProps(['id'])
</script>
