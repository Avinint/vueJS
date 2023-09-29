<template>
  <div
    tabindex="-1"
    aria-hidden="true"
    class="h-modal fixed left-0 right-0 top-0 z-50 flex w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 p-4 backdrop-blur md:inset-0 md:h-full"
  >
    <div class="relative h-full w-full max-w-2xl">
      <div class="relative rounded-lg bg-white shadow">
        <div class="flex items-start justify-between rounded-t border-b p-4">
          <h3
            v-if="props.type == 'delete'"
            class="text-xl font-semibold text-gray-900"
          >
            Suppression
          </h3>
          <h3
            v-else-if="props.type == 'edit'"
            class="text-xl font-semibold text-gray-900"
          >
            Modification
          </h3>
          <h3
            v-else-if="props.type == 'add'"
            class="text-xl font-semibold text-gray-900"
          >
            Ajout
          </h3>
          <Button
            test="TcloseModal"
            couleur="secondary"
            icon="cross"
            borderless
            @click="emit('cancel', $event)"
          />
        </div>
        <div v-if="props.type === 'delete'" class="space-y-6 p-6">
          <slot>Voulez-vous valider la suppression ?</slot>
        </div>
        <div v-else-if="props.type === 'edit'" class="space-y-6 p-6">
          <slot>Voulez-vous valider la modification ?</slot>
        </div>
        <div v-else-if="props.type === 'add'" class="space-y-6 p-6">
          <slot>Voulez-vous valider l'ajout ?</slot>
        </div>
        <div
          class="flex items-center justify-end space-x-2 rounded-b border-t border-gray-200 p-6"
        >
          <Button
            submit
            test="TconfirmModal"
            label="Confirmer"
            class="bg-red-600 hover:bg-red-800"
            @click="emit('confirm', $event)"
          />
          <Button
            test="TcancelModal"
            label="Annuler"
            couleur="secondary"
            @click="emit('cancel', $event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from './Button.vue'

const props = defineProps({
  type: { type: String, default: '' },
})

const emit = defineEmits(['confirm', 'cancel'])
</script>

<style scoped></style>
