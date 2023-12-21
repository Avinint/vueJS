<template>
  <label
    :for="props.id"
    :class="{required: props.required}"
    class="mb-2 block text-sm font-medium text-gray-900"
    ><slot></slot
  ></label>
</template>

<script setup>
const props = defineProps({ id: String, required: Boolean})
</script>
