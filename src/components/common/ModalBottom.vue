<template>
  <div class="modal-bottom bg-white border-b">
      <div class="flex justify-between items-center border-b h-16">
        <slot name="title" />
        <Button class="mr-4" test='TcloseModal' @click="emit('close', $event)" couleur="secondary" icon="cross" borderless />
    </div>
    <div class="p-4">
        <slot name="content" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from './Button.vue';
import { defineEmits } from 'vue';

const emit = defineEmits(['close'])
</script>

<style scoped>
.modal-bottom {
  position: fixed;
  z-index: 100;
  bottom: 0;
  right: 0;
  border-radius: 8px 8px 0px 0px;
  width: 100%;
  max-width: calc(100vw - 320px);
  box-shadow: 0px 0px 15px rgb(99, 99, 99);
}

.modal-bottom-title {
  height: 60px;
  border-bottom: 1px solid gray;
}

@media screen and (max-width: 1024px) {
  .modal-bottom {
    max-width: calc(100vw - 32px);
  }
}
</style>
