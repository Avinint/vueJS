<template>
  <div tabindex="-1" aria-hidden="true"
    class="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full backdrop-blur bg-black/50 flex items-center justify-center">
    <div :class="'relative max-h-full w-9/12 max-w-' + props.size">
      <div class="relative bg-white rounded-lg shadow">
        <div class="flex items-start justify-between pl-6 py-6 pr-4 border-b rounded-t">
          <h3 class="text-xl text-red-600 uppercase">
            {{ props.title }}
          </h3>
          <slot name="topParams"></slot>
          <div class="flex align-center">
            <slot name="topButtons"></slot>
            <Button test='TcloseModal' @click="emit('cancel', $event)" couleur="secondary" icon="cross" />
          </div>
        </div>
        <div class="p-6 space-y-6">
          <slot></slot>
        </div>

        <div v-if="props.type === 'classic'" class="flex justify-end items-center p-6 space-x-4 rounded-b">
          <slot name="cancel">
            <Button test='TcancelModal' @click="emit('cancel', $event)" :label="cancelButtonText" couleur="secondary"
              class="text-red-600 border border-red-600" />
          </slot>
          <slot name="actions"></slot>
          <Button submit test='TconfirmModal' @click="emit('confirm', $event)" :label="confirmButtonText" couleur="danger"
                  :icon="icon" class="hover:bg-red-800" />
        </div>
        <div v-if="props.type === 'custom'" class="flex justify-end items-center p-6 space-x-2 rounded-b">
          <slot name="buttons">
            <Button submit test='TconfirmModal' @click="emit('confirm', $event)" label="Confirmer"
              class="bg-red-600 hover:bg-red-800" />
            <Button test='TcancelModal' @click="emit('cancel', $event)" :label="cancelButtonText" couleur="secondary" />
          </slot>
        </div>

        <div v-if="props.type === 'visualiser'" class="flex justify-end items-center p-6 space-x-2 rounded-b">
          <Button class="ml-auto mr-0" test='TcancelModal' @click="emit('cancel', $event)" :label="cancelButtonText"
            couleur="secondary" />
        </div>

        <div v-if="props.type === 'alert'" class="flex justify-end items-center p-6 space-x-2 rounded-b">
          <Button test='TcancelModal' @click="emit('cancel', $event)" label="Annuler" couleur="secondary"
            class="border border-red-600" />

          <slot name="actions"></slot>
          <Button submit test='TconfirmModal' @click="emit('confirm', $event)" label="Enregistrer"
                  class="bg-red-600 w-x hover:bg-red-800"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from './Button.vue'

type Props = {
  title: string
  type: 'classic' | 'alert' | 'visualiser' | 'custom' | 'none'
  size: '2xl' | '3xl' | '5xl' | '4xl' | '6xl'
  confirmButtonText: string,
  cancelButtonText: string
  icon?: 'reload' | 'edit' | 'add' | 'export' | 'logout' | 'cross' | 'delete' | 'search' | '',
}

const emit = defineEmits(['confirm', 'cancel', 'delete'])

const props = withDefaults(defineProps<Props>(), {
  title: '',
  type: 'classic',
  size: '2xl',
  confirmButtonText: 'Confirmer',
  cancelButtonText: 'Annuler'
})
</script>

<style scoped></style>
