<template>
  <template v-if="props.default">
    <input type="radio" :disabled="props.disabled" :required="props.required" :name="props.name" :value="0"
      :id="idPrefix + props.default.value" v-model="modelValue">
    <label :for="idPrefix + props.default.value">{{ props.default.label }}</label>
  </template>

  <template v-for="elt of props.list" :key="elt.id">
    <input type="radio" :disabled="props.disabled" :required="props.required" :name="props.name" :value="elt.id"
      :id="idPrefix + elt.id" v-model="modelValue">
    <label :for="idPrefix + elt.id">{{ elt.libelle }}</label>
  </template>
</template>

<script setup lang="ts">
import { ref, withDefaults, computed, defineProps, defineEmits } from "vue";

interface Props {
  disabled?: boolean,
  required?: boolean,
  name: string,
  modelValue: number | string,
  default?: { label: string, value: number | string } | boolean,
  list: { id: number, libelle: string }[]
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
  name: '',
  modelValue: 0,
  default: false,
  list: []
});

const idPrefix = ref('');
idPrefix.value = props.name + '_';

// const emits = defineEmits(['update:modelValue'])
const emits = defineEmits<{
  (e: 'update:modelValue', item: number | string): void
}>()
const modelValue = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  }
})

</script>

<style scoped>
input[type=radio] {
  display: none;
  /* /!\ bloque les messages "required", utiliser opacity 0, width 1px... à la place si nécessaire */
}

input[type=radio]+label {
  @apply cursor-pointer px-6 py-3 rounded-lg border-none text-sm text-black bg-neutral-200 mr-9 mb-3 inline-block drop-shadow-sm;
}

input[type=radio]:checked+label {
  @apply bg-sky-600 text-white;
}
</style>