<template>
  <div class="flex" :class="props.inline ? 'items-center' : 'flex-col'">
    <InputLabelDescription :for="props.id">
      <template #label>{{ label }}</template>
      <template #description>{{ description }}</template>
    </InputLabelDescription>
    <div class="w-full">
      <input :readonly="props.readonly" :id="props.id" @input="inputValidation" :value="props.modelValue || props.defaultValue" :type="props.type" :required="props.required" :pattern="props.pattern" :minlength="props.minlength" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" :placeholder="props.placeholder">
      <p v-html="error"></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputLabelDescription from './InputLabelDescription.vue'
import { computed, ref, withDefaults, defineEmits, defineProps } from "vue"

interface Props {
  placeholder: string
  test: string
  readonly?: boolean
  modelValue: string
  defaultValue: string
  label: string
  id?: string
  inline: boolean
  type: string
  validation?: ((val: any) => boolean | string)[]
  valid: boolean
  required: boolean,
  pattern: string,
  minlength: number,
  maxlength: number,
  description: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "",
  test: "",
  label: "",
  readonly: false,
  inline: true,
  type: 'text',
  id: "",
  validation: [],
  valid: true,
  required: false,
  description: ""
})

const emits = defineEmits<{
  (e: 'update:modelValue', text: string): void
  (e: 'update:valid', valid: boolean): void
}>()

const inputValidation = ($event) => {
  const val = $event.target.value
  error.value = ""
  emits('update:valid', true)
  props.validation.forEach(func => {
    try {
      func(val)
    } catch (e) {
      error.value += e + "<br>"
      emits('update:valid', false)
    }
  })
  emits('update:modelValue', val)
}

const label = computed(() => props.label)
const error = ref("")
</script>
