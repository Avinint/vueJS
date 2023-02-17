<template>
  <div class="flex" :class="props.inline ? 'items-center' : 'flex-col'">
    <InputLabel>{{ label }}</InputLabel>
    <input  :readonly="props.readonly" :id="props.id" @input="emits('update:modelValue', $event.target.value)" :value="props.modelValue" :type="props.type" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" :placeholder="props.placeholder" required>
  </div>
</template>

<script setup lang="ts">

  import InputLabel from './InputLabel.vue'
  import {computed, withDefaults} from "vue";

  interface Props {
    placeholder: string
    test: string
    readonly: boolean
    modelValue: string
    label: string
    id?: string,
    inline: boolean
    type: string
  }

  const props = withDefaults(defineProps<Props>(), {
    placeholder: "",
    test: "",
    label: "",
    readonly: false,
    inline: true,
    type: 'text',
    id: ""
  })

  const emits = defineEmits<{
    (e: 'update:modelValue', text: string): void
  }>()

  const label = computed(() => props.label)

</script>
