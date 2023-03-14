<template>
  <div class="flex items-center">
    <InputLabel>{{ label }}</InputLabel>
    <select :value="props.selected" @change="emits('update:modelValue', parseInt($event.target.value))" class="form-select">
      <option v-for="option in options" :value="option.id">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">

  import InputLabel from './InputLabel.vue'
  import {computed, ref, withDefaults} from "vue";

  interface Props {
    readonly: boolean
    modelValue: string
    label: string
    options: object[]
    selected: number
  }

  const props = withDefaults(defineProps<Props>(), {
    placeholder: "",
    label: "",
    readonly: false,
    selected: 0
  })

  const emits = defineEmits<{
    (e: 'update:modelValue', item: object): void
  }>()

  const label = computed(() => props.label)

  /**const selected = computed({get(){
      return props.selected
    }, set(val){
      emits('update:modelValue', val)
    }
  })**/

</script>

<style scoped>

</style>