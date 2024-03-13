<template>
  <Card class="space-y-4">
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="mb-4">RÉDUCTIONS</h1>
      </div>
    </div>
    <Spinner v-if="spinner" />
    <template v-if="!spinner">
      <table class="border border-grey-200 w-full text-left">
        <thead class="bg-gray-100">
          <tr class="rounded-t-lg">
            <th class="w-8/12">Libellé</th>
            <th class="w-1/12"></th>
            <th class="w-1/12"></th>
            <th class="w-1/12"></th>
            <th class="w-1/12"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(reduc, i) in reducs" :key="`reduc-${i}`">
            <td class="w-8/12">{{ reduc.libelle }}</td>
            <td class="w-1/12 text-center">
              <Button
                icon="info"
                borderless
                couleur="secondary"
                @click="null"
              />
            </td>
            <td class="w-1/12 text-center">
              <Button
                icon="edit"
                borderless
                couleur="secondary"
                @click="editInfosReduc(reduc.reductionId)"
              />
            </td>
            <td class="w-1/12 text-center">
              <Button
                icon="user"
                borderless
                couleur="secondary"
                @click="editMembresReduc(reduc)"
              />
            </td>
            <!--  -->
            <td class="w-1/12 text-center">
              <Button
                icon="bad"
                borderless
                couleur="secondary"
                @click="editActiviteReduc(reduc)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </template>
    <ButtonRight label="Ajouter un groupe de réduction" icon="add" couleur="danger" @click="addReduc()" />
  </Card>

  <form @submit.prevent="saveReduc">
    <Modal
      v-if="infosReducModal"
      title="Groupe de réduction"
      size="4xl"
      @cancel="resetInfos()"
    >
      <div class="relative">
        <FAInput
          v-model="reduc.libelle"
          :inline="false"
          :required="true"
          label="Ajouter un nom à votre groupe de réduction"
          class="w-1/2"
          type="text"
        />
        <div class="absolute top-0 right-0 flex gap-6">
          <p class="w-10">{{ reduc.actif ? 'Actif' : 'Inactif' }}</p>
          <label class="relative inline-flex cursor-pointer items-center">
            <input
              v-model="reduc.actif"
              type="checkbox"
              class="peer sr-only"
            />
            <div
              class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"
            ></div>
            <span
              class="ml-3 text-sm font-medium text-gray-900"
            ></span>
          </label>
        </div>
      </div>
      <FAInput
        v-model="reduc.description"
        :inline="false"
        label="Ajouter une description à votre groupe de réduction (facultatif)"
        class="w-1/2"
        type="text"
      />
      <CardModalSection title="Périodes et horaires" class="pt-4">
        <div v-for="(periode, i) in reduc.periodes" :key="`periode-${i}`" class="border border-slate-300 p-6 rounded-lg mb-2">
          <div class="flex items-center justify-between">
            <p>Dates</p>
            <Button @click="deletePeriode(i)" couleur="secondary" icon="cross" />
          </div>
          <div class="flex items-center gap-20 my-4">
            <vue-tailwind-datepicker
              i18n="fr"
              as-single
              v-model="periode.dateDebut"
              :formatter="{ date: 'DD/MM/YYYY', month: 'MMMM' }"
              class="w-full"
            />
            <p>à</p>
            <vue-tailwind-datepicker
              i18n="fr"
              as-single
              v-model="periode.dateFin"
              :formatter="{ date: 'DD/MM/YYYY', month: 'MMMM' }"
              class="w-full"
            />
          </div>
          <p class="mt-8 mb-4">Jours</p>
          <div class="flex items-center gap-4">
            <div
              v-for="(day, key) in days"
              :key="`day-${key}`"
              :class="{ 'bg-blue-400 text-white': periode.jours[key] === true }"
              class="flex h-10 w-10 cursor-pointer select-none items-center justify-center rounded-full border p-4 text-gray-700"
              @click="selectDay(key, periode.jours)"
            >
              {{ day }}
            </div>
          </div>
          <p class="mt-8 mb-4">Horaires</p>
          <div class="flex items-center">
            <FAInput
              v-model="periode.plageHoraireDebut"
              class="w-1/12"
              placeholder="08:00"
              type="text"
            />
            <p class="mx-6">à</p>
            <FAInput
              v-model="periode.plageHoraireFin"
              class="w-1/12"
              placeholder="10:30"
              type="text"
            />
          </div>
        </div>
      </CardModalSection>
      <Button
        @click="addPeriode()"
        label="Ajouter une période"
        couleur="danger"
        icon="add"
      />
    </Modal>
  </form>
</template>

<script setup lang="ts">
import Card from '@components/common/Card.vue'
import Button from '@components/common/Button.vue'
import Spinner from '@components/common/Spinner.vue'
import ButtonRight from '@components/common/ButtonRight.vue'
import Modal from '@components/common/Modal.vue'
import FAInput from '@components/common/Input.vue'
import CardModalSection from '@components/common/CardModalSection.vue'

import { getReducs, getReduc, postReduc, putReduc } from '@api/reduc'

import 'vue3-toastify/dist/index.css'
import { onMounted, ref } from 'vue'
import { toast } from 'vue3-toastify'
import dayjs from 'dayjs'

const props = defineProps(['id'])
const spinner = ref(false)
const reducs = ref([])
const reduc = ref({
  libelle: '',
  description: '',
  actif: false,
  periodes: []
})
const days = 'LMMJVSD'
const infosReducModal = ref(false)
const reducId = ref(0)
const state = ref('')

const newPeriode = () => ({
  dateDebut: '',
  dateFin: '',
  jours: Array(7).fill(false)
})

onMounted(async () => {
  await fetchDonnees()
})

const fetchDonnees = async () => {
  spinner.value = true
  reducs.value = await getReducs(props.id)
  spinner.value = false
}

const mapInfos = (reduction) => {
  reduction.periodes.map(periode => {
    periode.plageHoraireDebut = dayjs(periode.plageHoraireDebut).format('HH:mm')
    periode.plageHoraireFin = dayjs(periode.plageHoraireFin).format('HH:mm')
    periode.dateDebut = periode.hasOwnProperty('dateDebut') ? dayjs(periode.dateDebut).format('DD/MM/YYYY') : ''
    periode.dateFin = periode.hasOwnProperty('dateFin') ? dayjs(periode.dateFin).format('DD/MM/YYYY') : ''
    let selected_days = []
    periode.jours.forEach((jour: string) => {
      switch(jour) {
        case 'Lu':
          selected_days[0] = true
          break
        case 'Ma':
          selected_days[1] = true
          break
        case 'Me':
          selected_days[2] = true
          break
        case 'Je':
          selected_days[3] = true
          break
        case 'Ve':
          selected_days[4] = true
          break
        case 'Sa':
          selected_days[5] = true
          break
        case 'Di':
          selected_days[6] = true
          break
      }
    })
    periode.jours = selected_days
  })
}

const resetInfos = () => {
  infosReducModal.value = false
  reducId.value = 0
  state.value = 'create'
  reduc.value = {
    libelle: '',
    description: '',
    actif: false,
    periodes: []
  }
}

const addReduc = () => {
  state.value = 'create'
  infosReducModal.value = true
}

const selectDay = (day_index: number, jours: any) => {
  jours[day_index] = !jours[day_index]
}

const editInfosReduc = async (id: number) => {
  state.value = 'edit'
  reducId.value = id
  reduc.value = await getReduc(id)
  mapInfos(reduc.value)
  infosReducModal.value = true
}

const setInfos = (periodes) => {
  periodes.map(periode => {
    if (periode.dateDebut !== '') {
      const [dayD, monthD, yearD] = periode.dateDebut.split('/')
      periode.dateDebut = `${yearD}-${monthD}-${dayD}`
    }
    if (periode.dateFin !== '') {
      const [dayF, monthF, yearF] = periode.dateFin.split('/')
      periode.dateFin = `${yearF}-${monthF}-${dayF}`
    }
    if (periode.plageHoraireDebut !== undefined) {
      periode.plageHoraireDebut = `${periode.plageHoraireDebut}:00`
    }
    if (periode.plageHoraireFin !== undefined) {
      periode.plageHoraireFin = `${periode.plageHoraireFin}:00`
    }

    let selected_days = []
    for (let i = 0; i <= periode.jours.length; i++) {
      if (periode.jours[i]) {
        selected_days.push(i + 1)
      }
    }
    periode.jours = selected_days

    if (periode.dateDebut !== '' || periode.dateDebut !== undefined) {
      periode = Object.defineProperties(periode, {
        dateDebut: {
          value: periode.dateDebut,
          writable: true
        }
      })
    }
    if (periode.dateFin !== '' || periode.dateFin !== undefined) {
      periode = Object.defineProperties(periode, {
        dateFin: {
          value: periode.dateFin,
          writable: true
        }
      })
    }
    if (periode.plageHoraireDebut !== '' || periode.plageHoraireDebut !== undefined) {
      periode = Object.defineProperties(periode, {
        plageHoraireDebut: {
          value: periode.plageHoraireDebut,
          writable: true
        }
      })
    }
    if (periode.plageHoraireFin !== '' || periode.plageHoraireFin !== undefined) {
      periode = Object.defineProperties(periode, {
        plageHoraireFin: {
          value: periode.plageHoraireFin,
          writable: true
        }
      })
    }
  })
}

const editMembresReduc = (reduc: object) => {
  console.log(reduc)
}
const editActiviteReduc = (reduc: object) => {
  console.log(reduc)
}

const addPeriode = () => {
  reduc.value.periodes.push(newPeriode())
}

const deletePeriode = (i: index) => {
  reduc.value.periodes.forEach((periode, z) => {
    if (i === z) {
      reduc.value.periodes.splice(z, 1)
      return
    }
  })
}

const saveReduc = async () => {
  setInfos(reduc.value.periodes)

  const data = {
    libelle: reduc.value.libelle,
    description: reduc.value.description,
    actif: reduc.value.actif,
    periodes: reduc.value.periodes
  }

  if (state.value === 'create') {
    await postReduc(props.id, data).then(() => {
      toast.success('La réduction a été créée avec succès !')
    }).catch(() => {
      toast.error('La réduction n\'a pas pu être créée.')
    })
  } else {
    await putReduc(reducId.value, data).then(() => {
      toast.success('La réduction a été modifiée avec succès !')
    }).catch(() => {
      toast.error('La réduction n\'a pas pu être modifiée.')
    })
  }

  await fetchDonnees()
  resetInfos()
}
</script>

<style scoped>
th, td {
  padding: 10px;
  color: #000000;
}

table > tbody > th:not(:last-child), table td:not(:last-child) {
  border-right: 1px solid rgb(229 231 235);
}

table > tbody > tr:not(:last-child) > th, table > tbody > tr:not(:last-child) > td {
  border-bottom: 1px solid rgb(229 231 235);
}

table {
  border-spacing: 0;
  border-collapse: separate;
  border-radius: 10px;
  border: 1px solid rgb(229 231 235);
  overflow: hidden;
}
</style>
