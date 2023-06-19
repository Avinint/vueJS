<template>
  <label class="relative inline-flex cursor-pointer items-center">
    <input
      type="checkbox"
      ref="checkbox"
      :checked="props.modelValue"
      @click="onChange"
      class="peer sr-only"
      :disabled="props.readonly"
    />
    <div
      class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"
    ></div>
    <span
      class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
    ></span>
  </label>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

interface Props {
  modelValue: boolean
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  readonly: false,
})

const checkbox = ref<HTMLInputElement>();

function onChange(event: MouseEvent) {
  if(checkbox.value) {
    emits('update:modelValue', checkbox.value.checked);
  }
}

const emits = defineEmits<{
  (e: 'update:modelValue', event: boolean): void
}>()
</script>
