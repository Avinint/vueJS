<template>
  <div tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full backdrop-blur bg-black/50 flex items-center justify-center">
    <div class="relative w-full h-full max-w-2xl ">
      <div class="relative bg-white rounded-lg shadow">
        <div class="flex items-start justify-between p-4 border-b rounded-t">
          <h3 class="text-xl font-semibold text-gray-900">
            {{ props.title }}
          </h3>
          <Button test='TcloseModal' @click="emit('cancel', $event)" type="secondary" icon="cross" borderless/>
        </div>

        <div class="p-6 space-y-6">
          <slot></slot>
        </div>

        <div v-if="props.type === 'classic'" class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b">
          <Button test='TconfirmModal' @click="emit('confirm', $event)" label="Confirmer"/>
          <Button test='TcancelModal' @click="emit('cancel', $event)" label="Annuler" type="secondary"/>
        </div>

        <div v-if="props.type === 'alert'" class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b">
          <Button test='TconfirmModal' @click="emit('confirm', $event)" label="Confirmer" type="danger"/>
          <Button test='TcancelModal' @click="emit('cancel', $event)" label="Annuler" type="secondary"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {withDefaults} from "vue";
  import Button from './Button.vue';

  interface Props {
    title: string
    type: 'classic' | 'alert'
  }

  const emit = defineEmits(['confirm', 'cancel'])

  const props = withDefaults(defineProps<Props>(), {
    title: '',
    type: 'classic'
  })

</script>

<style scoped>

</style>
