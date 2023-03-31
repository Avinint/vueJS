<template>

    <templace v-for="elt in props.elements">
        <input
            type="checkbox"
            v-model="modelValue"
            :value="elt.id"
            :name="name"
            :id="idPrefix + elt.id">
        <label :for="idPrefix + elt.id">{{ elt.libelle }}</label>
    </templace>

</template>

<script setup>

import { ref, computed } from "vue";

const props = defineProps({
    modelValue: 0,
    elements: [],
    name: '',
    id: '',
});

const idPrefix = ref('');
idPrefix.value = props.id + '_';

const emits = defineEmits(['update:modelValue']);
const modelValue = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  }
});

</script>

<style scoped>

input[type=checkbox] {
  display: none; /* /!\ bloque les messages "required", utiliser opacity 0, width 1px... à la place si nécessaire */
}
input[type=checkbox] + label {
  margin-right: .5em;
  cursor: pointer;
  padding: .25em 1em;
}
input[type=checkbox]:checked + label {
  background-color: #ddd;
  border-radius: .5em;
}

</style>