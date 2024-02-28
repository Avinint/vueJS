<template>
  <Card class="space-y-4">
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="mb-4">TARIFS</h1>
        <h2>Niv 1, Prio 1 = le plus prioritaire</h2>
      </div>
      <ButtonRight label="Ajouter un tarif" icon="add" couleur="danger" @click="addTarif()" />
    </div>

    <Spinner v-if="spinner" />
    <template v-if="!spinner">
      <Card
        :shadow="false"
        class="overflow-hidden"
        v-for="(activite, key) in tarifsByActivities"
        :key="`activite-${key}`"
        :boxShadow="false"
      >
        <div class="mb-4 flex items-center justify-between">
          <LabelText :text="activite.activite" class="label-text" />

        </div>
        <TableauTarifs @change-statut="modifieTarif" @edit="editTarif" @change-ordre="fetchDonnees"
                       :tarifs-par-niveau="activite.exceptionnel" :id="id"></TableauTarifs>
        <TableauTarifs @change-statut="modifieTarif" @edit="editTarif" @change-ordre="fetchDonnees"
                       :tarifs-par-niveau="activite.special" :id="id"></TableauTarifs>
        <TableauTarifs @change-statut="modifieTarif" @edit="editTarif" @change-ordre="fetchDonnees"
                       :tarifs-par-niveau="activite.general" :id="id"></TableauTarifs>
        <TableauTarifs @change-statut="modifieTarif" @edit="editTarif" @change-ordre="fetchDonnees"
                       :tarifs-par-niveau="activite.defaut" :id="id"></TableauTarifs>
      </Card>
    </template>
  </Card>

  <form @submit.prevent="saveTarif">
    <Modal
      v-if="openModal"
      :title="modalTitle"
      size="4xl"
      @cancel="resetInfos()"
    >
      <Spinner v-if="spinnerModal" />
      <template v-if="!spinnerModal">
        <CardModalSection title="Activité et tarif" :params="true">
          <template #topParams>
            <div class="flex gap-6 ml-96">
              <p class="w-10">{{ tarif.actif ? 'Actif' : 'Inactif' }}</p>
              <label class="relative inline-flex cursor-pointer items-center">
                <input
                  v-model="tarif.actif"
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
          </template>
          <div class="flex items-center gap-8">
            <FAInput
              v-model="tarif.titre"
              :inline="false"
              :required="true"
              label="Ajouter un titre à votre tarif"
              class="w-1/2"
              placeholder="Titre tarif"
              type="text"
            />
            <div class="w-4/12">
              <label class="mb-2 block text-sm font-medium text-gray-900">Choisir l'activité *</label>
              <select
                v-model="tarif.activite"
                class="rounded-lg w-full border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              >
                <option
                  v-for="(act, i) in activites"
                  :key="i"
                  :value="act.libelle"
                >
                  {{ act.libelle }}
                </option>
              </select>
            </div>
          </div>
          <div class="flex gap-6 mt-10 items-center">
            <div class="flex items-center">
              <label class="mr-4 block text-sm font-medium text-gray-900">Tarif pour</label>
              <select
                v-model="tarif.duree"
                class="block h-11 w-20 rounded-lg border border-gray-300 bg-gray-50 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              >
                <option
                  v-for="(duree, i) in listDuree"
                  :key="i"
                  :value="duree"
                >
                  {{ duree }}
                </option>
              </select>
              <p class="ml-2">min</p>
            </div>
            <div class="relative flex">
              <Input
                id="montantTarif"
                v-model="tarif.montant"
                type="text"
                placeholder="Montant"
                class="w-28"
                required
              />
              <p class="absolute top-2.5 right-3">€</p>
            </div>
          </div>
        </CardModalSection>
        <CardModalSection title="Niveau" class="pt-4">
          <div class="flex gap-8">
            <div v-for="level in levels" :key="`niveauTarif-${level.id}`">
              <Button
                v-if="level.libelle !== 'Défaut'"
                @click="changeLevel(level.id)"
                :label="level.libelle"
                class="w-52"
                couleur="none"
                :class="{ 'bg-sky-600 text-white': levelChecked.includes(level.id) }"
              />
            </div>
          </div>
          <div class="text-sm mt-4">
            <p class="mb-4">Lorsque les conditions d’effet sont identiques entre des tarifs de niveau différents, ceux avec un niveau de priorité plus important sont pris en compte. (Niv 1 = priorité maximale)</p>
            <p>Niv 1 : Tournois, canicule, portes ouvertes</p>
            <p>Niv 2 : Vacances, jours fériés</p>
            <p>Niv 3 : Annuel, semestriel</p>
          </div>
        </CardModalSection>
        <CardModalSection title="Périodes et horaires" class="pt-4">
          <div v-for="(periode, i) in tarif.periodes" :key="`periode-${i}`" class="border border-slate-300 p-6 rounded-lg mb-2">
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
        <div v-if="errorMessage !== ''" class="text-red-600 mb-4">{{ errorMessage }}</div>
      </template>
    </Modal>
  </form>
  <form @submit.prevent="sendTarif()">
    <ValidationModal
      v-if="validationTarif"
      :type="modalType"
      @cancel="validationTarif = false"
    >
    </ValidationModal>
  </form>
</template>

<script setup lang="ts">
import Card from '@components/common/Card.vue'
import Button from '@components/common/Button.vue'
import Input from '@components/common/Input.vue'
import ValidationModal from '@components/common/ValidationModal.vue'
import Modal from '@components/common/Modal.vue'
import ButtonRight from '@components/common/ButtonRight.vue'
import LabelText from '@components/common/LabelText.vue'
import InfoSVG from '@components/svg/InfoSVG.vue'
import FAInput from '@components/common/Input.vue'
import InputSelect from '@components/common/Select.vue'
import CardModalSection from '@components/common/CardModalSection.vue'
import Spinner from '@components/common/Spinner.vue'
import draggable from "vuedraggable";

import { getTarifs, getTarif, postTarif, putActifTarif, putTarif, getTarifNiveaux } from '@api/tarifs'
import { getActivites } from '../../api/activite'

import 'vue3-toastify/dist/index.css'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'
import dayjs from 'dayjs'
import TableauTarifs from "@components/FaTarifs/TableauTarifs.vue";

const props = defineProps(['id'])
const route = useRoute()

const tarifsByActivities = ref([])
const openModal = ref(false)
const tarif = ref({})
const days = 'LMMJVSD'
const activites = ref({})
const listDuree = [60, 120]
const levelChecked = ref([])
const selected_days = ref([])
const modalTitle = ref('')
const validationTarif = ref(false)
const state = ref('')
const modalType = ref('')
const idTarif = ref(0)
const errorMessage = ref('')
const spinner = ref(false)
const spinnerModal = ref(false)
const levels = ref([])

const newPeriode = {
  dateDebut: '',
  dateFin: '',
  jours: [false, false, false, false, false, false, false],
  plageHoraireDebut: '',      
  plageHoraireFin: ''      
}

const fetchDonnees = async () => {
  spinner.value = true
  tarifsByActivities.value = await getTarifs(props.id)
  tarifsByActivities.value = tarifsByActivities.value.map(tarif => ({ ...tarif, open: false }))
  levels.value = await getTarifNiveaux()
  activites.value = await getActivites(props.id, 1, '&order=asc')
  spinner.value = false
}

const selectDay = (day_index: number, jours: any) => {
  jours[day_index] = !jours[day_index]
}
const addPeriode = () => {
  if (tarif.value.periodes === undefined) tarif.value.periodes = []
  tarif.value.periodes.push(newPeriode)
}

const deletePeriode = (i: number) => {
  tarif.value.periodes.forEach((periode, z) => {
    if (i === z) {
      tarif.value.periodes.splice(z, 1)
      return
    }
  })
}

const changeLevel = (idLevel: number) => {
  levelChecked.value = []
  levels.value.forEach(level => {
    if (level.id === idLevel) levelChecked.value.push(idLevel)
  })
}

onMounted(async () => {
  state.value = 'view'
  await fetchDonnees()
})

watch(() => route.params.id, async() => await fetchDonnees())

const modifieTarif = async (id: number, actif: boolean) => {
  const data = {
    actif: actif
  }
  await putActifTarif(id, data).then(() => {
    toast.success('Le tarif a été modifié avec succès !')
  })
}

const editTarif = async (id: number) => {
  resetInfos()
  idTarif.value = id
  state.value = 'edit'
  modalTitle.value = 'Édition de tarif'
  modalType.value = 'edit'
  tarif.value = await getTarif(id)
  setInfos(tarif.value)
  openModal.value = true
}

const resetInfos = () => {
  openModal.value = false
  validationTarif.value = false
  state.value = 'view'
  levelChecked.value = []
  selected_days.value = []
  tarif.value = {}
  idTarif.value = 0
}

const setInfos = (tarif: object) => {
  levelChecked.value.push(tarif.niveau)
  tarif.montant = Intl.NumberFormat('fr-FR').format(tarif.montant / 100)
  tarif.periodes.forEach(periode => {
    selected_days.value = []
    periode.dateDebut = dayjs(periode.dateDebut).format('DD/MM/YYYY')
    periode.dateFin = dayjs(periode.dateFin).format('DD/MM/YYYY')
    periode.plageHoraireDebut = dayjs(periode.plageHoraireDebut).format('HH:mm')
    periode.plageHoraireFin = dayjs(periode.plageHoraireFin).format('HH:mm')
    periode.jours.forEach(jour => {
      switch(jour) {
        case 'Lu':
          selected_days.value[0] = true
          break
        case 'Ma':
          selected_days.value[1] = true
          break
        case 'Me':
          selected_days.value[2] = true
          break
        case 'Je':
          selected_days.value[3] = true
          break
        case 'Ve':
          selected_days.value[4] = true
          break
        case 'Sa':
          selected_days.value[5] = true
          break
        case 'Di':
          selected_days.value[6] = true
          break
      }
    })
    periode.jours = selected_days.value
  })
}

const addTarif = () => {
  state.value = 'create'
  modalTitle.value = 'Création de tarif'
  modalType.value = 'add'
  openModal.value = true
}

const saveTarif = async () => {
  errorMessage.value = ''
  if (tarif.value.activite === '' || tarif.value.activite === undefined) {
    errorMessage.value = 'Veuillez renseigner une activité.'
    return
  }

  if (tarif.value.duree === '' || tarif.value.duree === undefined) {
    errorMessage.value = 'Veuillez renseigner une durée.'
    return
  }

  if (levelChecked.value.length === 0) {
    errorMessage.value = 'Veuillez renseigner un niveau de tarif.'
    return
  }

  if (tarif.value.periodes === undefined) {
    errorMessage.value = 'Veuillez renseigner au moins une période pour le tarif.'
    return
  }

  tarif.value.periodes.forEach(periode => {
    if (periode.plageHoraireDebut === '' || periode.plageHoraireFin === '') {
      errorMessage.value = 'Veuillez renseigner des horaires pour les périodes.'
      return
    }

    if (periode.dateDebut === '' || periode.dateFin === '') {
      errorMessage.value = 'Veuillez renseigner des dates pour les périodes.'
      return
    }

    const data = []
    periode.jours.forEach((jour, i) => {
      if (jour) data.push(i + 1)
    })
    periode.jours = data
    if (periode.jours.length === 0) {
      errorMessage.value = 'Veuillez renseigner des jours pour les périodes.'
      return
    }

    periode.plageHoraireDebut = `${periode.plageHoraireDebut}:00`
    periode.plageHoraireFin = `${periode.plageHoraireFin}:00`
    const [dayD, monthD, yearD] = periode.dateDebut.split('/')
    const [dayF, monthF, yearF] = periode.dateFin.split('/')
    periode.dateDebut = `${yearD}-${monthD}-${dayD}`
    periode.dateFin = `${yearF}-${monthF}-${dayF}`
  })
  
  if (errorMessage.value === '' ) await sendTarif()
}

const sendTarif = async () => {
  spinnerModal.value = true
  const data = {
    titre: tarif.value.titre,
    activite: activites.value.find(act => act.libelle === tarif.value.activite).id,
    fitArena: parseInt(props.id),
    duree: tarif.value.duree,
    actif: tarif.value.actif ?? false,
    montant: parseFloat(tarif.value.montant) * 100,
    niveau: levelChecked.value[0],
    periodes: tarif.value.periodes
  }

  switch (state.value) {
    case 'create':
      await postTarif(data).then(() => {
        toast.success('Le tarif a été créé avec succès !')
      })
      break
    case 'edit':
      await putTarif(idTarif.value, data).then(() => {
        toast.success('Le tarif a été modifié avec succès !')
      })
      break
  }
  resetInfos()
  spinnerModal.value = false
  await fetchDonnees()
}
</script>

<style scoped>
th, td {
  padding: 10px;
  color: #000000;
}

th {
  font-weight: 700;
}

td {
  border-right: 1px solid rgb(229 231 235);
}

tr {
  border-bottom: 1px solid rgb(229 231 235);
  border-right: 1px solid rgb(229 231 235);
  border-left: 1px solid rgb(229 231 235);
}

.label-text {
  font-size: 22px;
}

p.statut-tarif {
  min-width: 45px;
}
</style>
