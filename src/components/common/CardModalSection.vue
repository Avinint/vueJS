<template>
  <div v-if="params === false">
    <HeaderModal :text="title" :uppercase="!normalcase" />
    <div class="mt-6">
      <slot name="content">
      </slot>
      <slot></slot>
    </div>
  </div>
  <div v-else>
    <div class="flex">
      <HeaderModal :text="title" :uppercase="!normalcase" />
      <slot name="topParams"></slot>
    </div>
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
  params: { type: Boolean, default: false }
})

</script>

<style scoped></style>
