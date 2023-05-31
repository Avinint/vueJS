<template>
  <div>
    <InputLabel>{{ label }}</InputLabel>
    <select :value="props.modelValue" @input="emits('update:modelValue', parseInt($event.target.value))" class="block h-10 w-40 rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500">
      <option v-for="option in options" :value="option.id" :selected="props.selected === option.id">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
  import InputLabel from './InputLabel.vue'
  import {computed, withDefaults} from "vue"

  type SelectOption = {
    id: number,
    label: string,
  }

  interface Props {
    readonly: boolean
    modelValue: number
    label: string
    options: SelectOption[]
    selected: number
  }

  const props = withDefaults(defineProps<Props>(), {
    placeholder: "",
    label: "",
    readonly: false,
    selected: 0
  })

  const emits = defineEmits<{
    (e: 'update:modelValue', item: object): void
  }>()

  const label = computed(() => props.label)
</script>
