<template>
  <div>
    <label class="mb-2 block text-sm font-medium text-gray-900">
      {{ label }}
    </label>
    <vue-tailwind-datepicker
      v-model="value"
      i18n="fr"
      as-single
      :formatter="{ date: 'DD / MM / YYYY' }"
      class="bg-gray-50 text-center"
      @select:month="update"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  label: String,
  modelValue: String,
})

const emits = defineEmits(['update:modelValue'])
const value = ref(props.modelValue)

function update(e: any) {
  value.value = e
  emits('update:modelValue', value.value)
}
</script>
