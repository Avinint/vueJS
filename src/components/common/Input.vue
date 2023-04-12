<template>
  <div class="flex" :class="props.inline ? 'items-center' : 'flex-col'">
    <InputLabel :for="props.id">{{ label }}</InputLabel>
    <input :readonly="props.readonly" :id="props.id" @input="inputValitation" :value="props.modelValue" :type="props.type" :required="props.required" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" :placeholder="props.placeholder">
    <p v-html="error"></p>
  </div>
</template>

<script setup lang="ts">

  import InputLabel from './InputLabel.vue'
  import {computed, ref, withDefaults} from "vue"

  interface Props {
    placeholder: string
    test: string
    readonly?: boolean
    modelValue: string
    label: string
    id?: string
    inline: boolean
    type: string
    validation?: ((val: any) => boolean | string)[]
    valid: boolean
    required: boolean
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
    required: false
  })

  const emits = defineEmits<{
    (e: 'update:modelValue', text: string): void
    (e: 'update:valid', valid: boolean): void
  }>()

  const inputValitation = ($event) => {
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
