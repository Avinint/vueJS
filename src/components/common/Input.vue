<template>
  <div class="flex" :class="inline ? 'items-center' : 'flex-col'">
    <InputLabel :required="required" v-if="label" :for="id">{{ label }}</InputLabel>
    <div class="w-full">
      <input
        :readonly="readonly"
        :id="id"
        @input="inputValidation"
        :value="value"
        :type="type"
        :required="required"
        :pattern="pattern"
        :minlength="minLength"
        :maxlength="maxLength"
        :disabled="disabled"
        class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
        :placeholder="placeholder"
      />
      <p v-html="error"></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputLabel from './InputLabel.vue'
import { computed, onMounted, ref } from 'vue'

interface Props {
  modelValue?: string | number
  defaultValue?: string
  placeholder?: string
  test?: string
  label?: string
  readonly?: boolean
  inline?: boolean
  pattern?: string
  minLength?: number
  maxLength?: number
  type?: string
  id?: string
  validation?: Function[]
  valid?: boolean
  required: boolean
  disabled?: boolean
}


const props = withDefaults(defineProps<Props>(), {
  readonly: false,
  inline: false,
  valid: false,
  required: false,
  disabled: false
})

const value = computed(() => props.modelValue || props.defaultValue || null);

onMounted(() => {
  if (props.defaultValue) {
    inputValidation();
  }
})

const emits = defineEmits<{
  (e: 'update:modelValue', text: string | number): void
  (e: 'update:valid', valid: boolean): void
}>()

const inputValidation = (event: any = {}) => {
  const val = event.target?.value || value.value

  error.value = ''
  emits('update:valid', true)
  if (props.validation) {
    props.validation.forEach((func: Function) => {
      try {
        if (func.name === 'codePinValidation') {
          func(val, props.required)
        } else {
          func(val)
        }

      } catch (e) {
        error.value += e + '<br>'
        emits('update:valid', false)
      }
    })
  }
  if(typeof(props.modelValue) === 'number')
    emits('update:modelValue', parseInt(val));
  else emits('update:modelValue', val)
}

const label = computed(() => props.label)
const error = ref('')
</script>

<style>
input:disabled {
  background-color: rgb(235, 235, 235);
  color: rgb(190, 190, 190);
}
</style>