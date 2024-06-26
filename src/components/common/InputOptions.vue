<template>
  <InputLabel v-if="label">{{ label }}</InputLabel>
  <div v-if="options.length > 0" class="flex flex-wrap gap-2">
    <div class="input-option" v-for="option in options" :key="option.id">
      <label
        class="rounded-lg block border-none bg-neutral-200 px-6 py-3 text-sm text-black drop-shadow-sm peer-checked:bg-sky-600 peer-checked:text-white"
        :class="{'bg-red-600 text-white': selected(option)}"
        :for="`option-${option.id}`"
      >
        <input
          :id="`option-${option.id}`"
          type="checkbox"
          :value="option.id"
          @input="update"
        >
        {{ option.label ?? option.libelle }}
      </label>
    </div>
  </div>
  <p class="text-xs" v-else>Aucun element trouvé.</p>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineProps, watch } from 'vue'
import InputLabel from './InputLabel.vue';

type SelectOption = {
  id: number
  label: string
}

const emits = defineEmits(['update:modelValue'])

const props = defineProps<{
  options: SelectOption[],
  modelValue?: number[],
  label?: string,
  libelle?: string
}>()

const model = ref(props.modelValue ?? [])

watch(props, () => {
  model.value = props.modelValue ?? []
})

function update(event: Event) {
  const value = parseInt((event.target as HTMLInputElement).value)
  for (let i = 0; i < model.value.length; i++) {
    if (value === model.value[i]) {
      model.value.splice(i, 1)
      emits('update:modelValue', model)
      return
    }
  }
  model.value.push(value)
  emits('update:modelValue', model)
}

function selected(option: SelectOption) {
  return model.value.includes(option.id)
}
</script>

<style scoped>
.selected {
  background-color: var(--color-primary);
}

.input-option > label {
  cursor: pointer;
}

.input-option label input[type="checkbox"] {
  opacity: 0;
  position: absolute;
  pointer-events: none;
}
</style>
