<template>
  <label
    :for="props.id"
    class="mb-2 block w-3/12 text-sm font-medium text-gray-900"
    ><slot name="label"></slot
  ></label>
  <p class="w-3/12 text-sm text-blue-400">
    <slot name="description">{{ props.description }}</slot>
  </p>
</template>

<script setup>
const props = defineProps(['id'])
</script>
