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
          :key="type"
        />
      </div>
    </div>
    <div class="mb-8" v-if="type == 'Semaines' || type == 'Mois'">
      <label class="mb-2 block text-sm text-gray-700"
        >Jour(s) de répétition</label
      >
      <div class="flex gap-4">
        <div
          v-for="(day, key) in days"
          :class="{ 'bg-blue-400 text-white': selected_days[key] == true }"
          class="flex h-10 w-10 cursor-pointer select-none items-center justify-center rounded-full border p-4 text-gray-700"
          @click="selectDay(key)"
        >
          {{ day }}
        </div>
      </div>
    </div>
    <div class="mb-8" v-if="type == 'Mois'">
      <label class="mb-2 block text-sm text-gray-700"
        >Semaine(s) de répétition</label
      >
      <div class="flex gap-4">
        <div
          v-for="week in '1234'"
          class="flex h-10 w-10 cursor-pointer select-none items-center justify-center rounded-full border p-4 text-gray-700"
          :class="{ 'bg-blue-400 text-white': selected_weeks.includes(parseInt(week)) }"
          @click="selectWeek(parseInt(week))"
        >
          {{ week }}
        </div>
      </div>
    </div>
    <div>
      <label class="mb-2 block text-sm text-gray-700">Fin de répétition *</label>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 w-4/12">
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
            :disabled="repetition_mode != 'date'"
            :key="date_key"
            :formatter="{ date: 'DD / MM / YYYY', month: 'MMMM' }"
            class="w-full"
            required
          />
        </div>
        <div class="flex items-center gap-2 w-4/12">
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
            :disabled="repetition_mode != 'occurence'"
            v-model="repetition_occurence"
            @input="setRepetitionValue"
          />
          <p>occurence(s)</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import FaInput from '@components/common/Input.vue'
import InputSelect from '@components/common/InputSelect.vue'

import { useCreneauStore } from '@stores/creneau'
import { getDateForInput } from '../../services/date_service'

import {nextTick, onMounted, ref, watch} from 'vue'
import dayjs from 'dayjs'

const creneau_store = useCreneauStore()

const days = 'LMMJVSD'
const selected_days = ref<boolean[]>([])
const selected_weeks = ref<number[]>([])
const date_key = ref(0);

const types = ['Jours', 'Semaines', 'Mois']
const type = ref('Semaines')

const repetition_date = ref('')
const repetition_occurence = ref(0)
const repetition_mode = ref<'date' | 'occurence'>('date')

onMounted(async () => {
  await nextTick()
  if(!creneau_store.recurrence.recurrenceType)
    creneau_store.recurrence.recurrenceType = 2;
  else {
    type.value = types[creneau_store.recurrence.recurrenceType - 1];
    repetition_date.value = getDateForInput(creneau_store.recurrence.dateDebut);
  }
})

function selectDay(day_index: number) {
  selected_days.value[day_index] = !selected_days.value[day_index]
  setDaysData()
}

function selectWeek(week: number) {
  const index = selected_weeks.value.findIndex((e) => e == week);
  if(index == -1) {
    selected_weeks.value.push(week);
  } else {
    selected_weeks.value.splice(index, 1);
  }
  creneau_store.recurrence.recurrenceSemainesMois = selected_weeks.value;
}

watch(repetition_date, () => {
  setRepetitionValue()
  date_key.value++;
})

watch(type, (v) => {
  for (let i = 0; i < types.length; i++) {
    if (types[i] === v) {
      creneau_store.recurrence.recurrenceType = i + 1
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
  repetition_occurence.value = 0;
  setRepetitionValue()
}

function setRepetitionOccurence() {
  repetition_mode.value = 'occurence'
  repetition_date.value = '';
  setRepetitionValue()
}

function setRepetitionValue() {
  switch (repetition_mode.value) {
    case 'date':
      if (repetition_date.value != '') {
        creneau_store.recurrence.dateFin = dayjs(
          repetition_date.value,
          'DD / MM / YYYY'
        ).format('YYYY-MM-DD')
      }
      creneau_store.recurrence.maxOccurrences = 0
      break

    case 'occurence':
      repetition_date.value = '';
      creneau_store.recurrence.dateFin = undefined;
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
