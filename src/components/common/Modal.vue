<template>
  <div tabindex="-1" aria-hidden="true"
    class="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full backdrop-blur bg-black/50 flex items-center justify-center">
    <div :class="'relative max-h-full w-300 max-w-'+props.size">
      <div class="relative bg-white rounded-lg shadow p-4">
        <div class="flex items-start justify-between p-4 border-b rounded-t">
          <h3 class="text-xl font-semibold text-gray-900">
            {{ props.title }}
          </h3>
          <div class="flex align-center">
            <Button v-if="delete_button" test='TcloseModal' @click="emit('delete')" couleur="danger" borderless label="Supprimer le créneau"/>
            <Button test='TcloseModal' @click="emit('cancel', $event)" couleur="secondary" icon="cross" borderless />
          </div>
        </div>
        <div class="p-6 space-y-6">
          <slot></slot>
        </div>
        <div v-if="props.type === 'classic'"
          class="flex justify-end items-center p-6 space-x-2 border-t border-gray-200 rounded-b">
          <Button submit test='TconfirmModal' @click="emit('confirm', $event)" label="Confirmer"
            class="bg-red-600 hover:bg-red-800" />
          <Button test='TcancelModal' @click="emit('cancel', $event)" label="Annuler" couleur="secondary" />
        </div>

        <div v-if="props.type === 'visualiser'"
          class="flex justify-end items-center p-6 space-x-2 border-t border-gray-200 rounded-b">
          <Button class="ml-auto mr-0" test='TcancelModal' @click="emit('cancel', $event)" label="Annuler"
            couleur="secondary" />
        </div>

        <div v-if="props.type === 'alert'"
          class="flex justify-end items-center p-6 space-x-2 border-t border-gray-200 rounded-b">
          <Button submit test='TconfirmModal' @click="emit('confirm', $event)" label="Confirmer"
            class="bg-red-600 w-x hover:bg-red-800" />
          <Button test='TcancelModal' @click="emit('cancel', $event)" label="Annuler" couleur="secondary" />
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import Button from './Button.vue'

type Props = {
  title: string
  type: 'classic' | 'alert' | 'visualiser'
  size: '2xl' | '3xl' | '5xl'
  delete_button?: boolean,
}

const emit = defineEmits(['confirm', 'cancel', 'delete'])

const props = withDefaults(defineProps<Props>(), {
  title: '',
  type: 'classic',
  size: '2xl',
})
</script>

<style scoped></style>
