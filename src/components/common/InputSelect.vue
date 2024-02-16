<template>
  <select
    id="TclientSelectAdresse"
    v-model="select"
    class="block rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
    @change="updateValue"
  >
    <option value="">Selectionnez une option</option>
    <option v-for="(option, i) in options" :key="i" :value="option">
      {{ optionLabel(option) }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface LabelCallback<T> {
  (e: T): string
}

const props = defineProps<{
  options: string[]
  modelValue?: string
  optionLabel: LabelCallback<any>
}>()

const select = ref(props.modelValue ?? '')

const emits = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()


function updateValue() {
  emits('update:modelValue', select.value)
}
</script>
