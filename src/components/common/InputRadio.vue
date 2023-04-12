<template>
  <template v-if="props.default">
    <input type="radio" :disabled="props.disabled" :required="props.required" :name="props.name" :value="0"
      :id="idPrefix + props.default.value" v-model="modelValue">
    <label :for="idPrefix + props.default.value">{{ props.default.label }}</label>
  </template>

  <template v-for="elt of props.list">
    <input type="radio" :disabled="props.disabled" :required="props.required" :name="props.name" :value="elt.id"
      :id="idPrefix + elt.id" v-model="modelValue">
    <label :for="idPrefix + elt.id">{{ elt.libelle }}</label>
  </template>
</template>

<script setup lang="ts">

import { ref, withDefaults, computed } from "vue";

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
  margin-right: .5em;
  cursor: pointer;
  padding: .25em 1em;
  border: 1px solid #ddd;
  border-radius: .5em;
}

input[type=radio]:checked+label {
  background-color: #ddd;
}
</style>