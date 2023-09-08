<template>
  <div class="pl-4">
    <HeaderModal :text="title" />
    <div class="mt-6">
      <slot name="content">
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderModal from '@components/common/HeaderModal.vue'

defineProps<{
    title: string
}>()

</script>

<style scoped></style>
