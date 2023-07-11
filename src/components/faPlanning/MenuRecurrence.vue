<template>
  <div>
    <div class="mb-8">
      <label class="mb-2 block text-sm text-gray-700"
        >Répétition du créneau</label
      >
      <div class="flex items-center gap-2">
        <p>Tous les</p>
        <FaInput
          class="w-12"
          default-value="0"
          v-model="creneau_store.recurrence.separation"
        />
        <InputSelect
          class="w-fit-content"
          :option-label="(e) => e"
          :options="['Jours', 'Semaines', 'Mois']"
          v-model="type"
        />
      </div>
    </div>
    <div class="mb-8" v-if="creneau_store.recurrence.recurrenceType == 1">
      <label class="mb-2 block text-sm text-gray-700"
        >Jour(s) de répétition</label
      >
      <div class="flex gap-4">
        <div
          v-for="(day, key) in days"
          :class="{ 'bg-blue-400 text-white': selected_days[key] == true }"
          class="flex h-10 w-10 cursor-pointer select-none items-center justify-center rounded-full bg-gray-300 p-4 text-gray-700"
          @click="selectDay(key)"
        >
          {{ day }}
        </div>
      </div>
    </div>
    <div>
      <label class="mb-2 block text-sm text-gray-700">Fin de répétition</label>
      <div class="flex items-center gap-2">
        <input
          type="radio"
          value="repetition_date"
          id="repetition_date"
          name="repetition"
          checked
          @click="setRepetitionDate"
        />
        <vue-tailwind-datepicker
          i18n="fr"
          as-single
          v-model="repetition_date"
          :formatter="{ date: 'DD / MM / YYYY' }"
          class="w-fit"
        />
        <input
          class="ml-4"
          type="radio"
          value="repetition_occurence"
          id="repetition_occurence"
          name="repetition"
          @click="setRepetitionOccurence"
        />
        <p>Après</p>
        <FaInput
          class="w-16"
          default-value="0"
          v-model="repetition_occurence"
          @input="setRepetitionValue"
        />
        <p>occurence(s)</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import FaInput from '@components/common/Input.vue'
import InputSelect from '@components/common/InputSelect.vue'
import { useCreneauStore } from '@stores/creneau'
import { ref, watch } from 'vue'
import dayjs from 'dayjs'

const creneau_store = useCreneauStore()

const days = 'LMMJVSD'
const selected_days = ref<boolean[]>([])

const types = ['Jours', 'Semaines', 'Mois']
const type = ref('Jours')

const repetition_date = ref('')
const repetition_occurence = ref(0)
const repetition_mode = ref<'date' | 'occurence'>('date')

function selectDay(day_index: number) {
  selected_days.value[day_index] = !selected_days.value[day_index]
  setDaysData()
}

watch(repetition_date, () => {
  setRepetitionValue();
})

watch(type, (v) => {
  for (let i = 0; i < types.length; i++) {
    if (types[i] === v) {
      creneau_store.recurrence.recurrenceType = i
    }
  }
})

function setDaysData() {
  const data = []
  for (let i = 0; i < days.length; i++) {
    if (selected_days.value[i] === true) {
      data.push(i + 1)
    }
  }
  creneau_store.recurrence.recurrenceJoursSemaine = data
}

function setRepetitionDate() {
  repetition_mode.value = 'date'
  setRepetitionValue();
}

function setRepetitionOccurence() {
  repetition_mode.value = 'occurence'
  setRepetitionValue();
}

function setRepetitionValue() {
  switch (repetition_mode.value) {
    case 'date':
      if(repetition_date.value != '') {
        creneau_store.recurrence.dateFin = dayjs(
          repetition_date.value,
          'DD / MM / YYYY'
        ).format('YYYY-MM-DD')
      }
      creneau_store.recurrence.maxOccurrences = 0
      break

    case 'occurence':
      creneau_store.recurrence.dateFin = '';
      creneau_store.recurrence.maxOccurrences = repetition_occurence.value
      break
  }
}
</script>

<style scoped>
input[type='radio'] {
  border: 1px solid #6b7280;
}
</style>
