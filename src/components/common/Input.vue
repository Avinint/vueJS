<template>
  <div class="flex" :class="inline ? 'items-center' : 'flex-col'">
    <InputLabel :for="id">{{ label }}</InputLabel>
    <div class="w-full">
      <input :readonly="readonly" :id="id" @input="inputValidation" :value="modelValue || defaultValue" :type="type" :required="required" :pattern="pattern" :minlength="minLength" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" :placeholder="placeholder">
      <p v-html="error"></p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import InputLabel from './InputLabel.vue'
  import {computed, ref} from "vue"

  const props = defineProps({
    modelValue: String,
    defaultValue: String,
    placeholder: String,
    test: String,
    label: String,
    readonly: Boolean,
    inline: Boolean,
    pattern: String,
    minLength: Number,
    maxLength: Number,
    type: {
      type: String,
      default: "text",
    },
    id: String,
    validation: Array,
    valid: Boolean,
    required: Boolean,
  })

  const emits = defineEmits<{
    (e: 'update:modelValue', text: string): void
    (e: 'update:valid', valid: boolean): void
  }>()

  const inputValidation = ($event) => {
    const val = $event.target.value
    error.value = ""
    emits('update:valid', true)
    if(props.validation) {
      props.validation.forEach(func => {
        try {
          func(val)
        } catch (e) {
          error.value += e + "<br>"
          emits('update:valid', false)
        }
      })
    }
    emits('update:modelValue', val)
  }

  const label = computed(() => props.label)
  const error = ref("")

</script>
