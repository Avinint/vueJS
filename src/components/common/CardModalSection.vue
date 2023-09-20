<template>
  <div>
    <HeaderModal :text="title" :uppercase="!normalcase"/>
    <div class="mt-6">
      <slot name="content">
      </slot>
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import HeaderModal from '@components/common/HeaderModal.vue'

defineProps({
    title: String,
    normalcase: { type: Boolean, default: false },
})

</script>

<style scoped></style>
