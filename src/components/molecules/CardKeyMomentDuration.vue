<template>
  <Card>
    <h1>Durée des temps forts</h1>
    <div class="relative my-4 overflow-x-auto text-black">
      <p class="ml-6 font-bold">Par défaut</p>
      <div class="mt-6 flex w-9/12 items-center font-light">
        <p class="ml-6 flex w-1/2 justify-start">Durée d'un temps fort</p>
        <div class="bg-grey flex justify-end rounded-lg">
          <p class="flex p-2">45 sec</p>
        </div>
      </div>
      <div class="mt-6 flex w-9/12 items-center font-light">
        <p class="ml-6 flex w-1/2 justify-start">
          Durée soustraite à la fin du temps fort
        </p>
        <div class="bg-grey flex justify-end rounded-lg">
          <p class="flex p-2">0 sec</p>
        </div>
      </div>
    </div>
    <div class="mb-4 w-1/2 rounded-lg border">
      <div class="relative my-4 overflow-x-auto text-black">
        <!-- dynamique à venir, quand le back et le front seront au même niveau -->
        <div class="flex px-6 py-4">
          <p class="w-4/12 font-bold">Futsal</p>
          <p class="w-1/12 pr-16">Actif</p>
          <label class="relative inline-flex w-7/12 cursor-pointer">
            <input
              type="checkbox"
              value="true"
              class="peer sr-only"
              @change="modifKeyMomentDuration(i)"
            />
            <div
              class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"
            ></div>
            <span
              class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
            ></span>
          </label>
          <Button
            test="TeditKeyMoment"
            borderless
            icon="edit"
            type="secondary"
            @click="editKeyMomentDuration(i)"
          />
          <Button
            test="TdeleteKeyMoment"
            borderless
            icon="delete"
            type="secondary"
            class="flex justify-end"
            @click="removeKeyMomentDuration(i)"
          />
        </div>
        <div class="mt-6 flex items-center font-light">
          <p class="ml-6 flex w-9/12 justify-start">Durée d'un temps fort</p>
          <div class="bg-grey flex justify-end rounded-lg">
            <p class="flex p-2">45 sec</p>
          </div>
        </div>
        <div class="mt-6 flex items-center font-light">
          <p class="ml-6 flex w-9/12 justify-start">
            Durée soustraite à la fin du temps fort
          </p>
          <div class="bg-grey flex justify-end rounded-lg">
            <p class="flex p-2">0 sec</p>
          </div>
        </div>
      </div>
    </div>
    <Button
      id="TaddKeyMomentDurationForAnActivity"
      label="Ajouter une durée de temps fort spécifique à une activité"
      class="font-bold text-black"
      icon="add"
      type="secondary"
      @click="addKeyMomentDurationForAnActivity"
    />
  </Card>

  <form @submit.prevent="saveKeyMomentDuration">
    <Modal
      v-if="keyMomentDuration_modal"
      :title="modal_title"
      @cancel="keyMomentDuration_modal = false"
    >
      <div>
        <p class="mb-2 block text-sm font-medium text-gray-900">
          Accès à la Fit Arena réservé uniquement pour certains profils :
        </p>
        <div
          class="bg-light-blue text-light-blue mb-4 block w-2/12 rounded-lg text-center text-sm font-medium"
        >
          <p class="p-2">Adhérents</p>
        </div>

        <div class="mb-6 flex w-4/12 items-center">
          <select
            class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          >
            <option value="" disabled selected>Ajouter un profil</option>
            <option v-for="(profil, i) in profils" :key="i" :value="profil.id">
              {{ profil.libelle }}
            </option>
          </select>
        </div>
        <div class="mb-6 flex items-center">
          <label class="mb-2 block w-1/2 text-sm font-medium text-gray-900"
            >Activité</label
          >
          <select
            v-if="activites.length"
            id="TfaSelectActivite"
            v-model="activite_selected"
            class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          >
            <option
              v-for="(activite, i) in activites"
              :key="i"
              :value="activite.id"
            >
              {{ activite.libelle }}
            </option>
          </select>
        </div>
        <div class="mb-6 flex items-center">
          <label class="mb-2 block w-1/2 text-sm font-medium text-gray-900"
            >Durée d'un temps fort</label
          >
          <select
            v-if="durationsKeyMoment.length"
            v-model="durationKeyMoment_selected"
            class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          >
            <option
              v-for="(duration, i) in durationsKeyMoment"
              :key="i"
              :value="duration"
            >
              {{ duration }} min
            </option>
          </select>
        </div>
        <div class="mb-6 flex items-center">
          <label class="mb-2 block w-1/2 text-sm font-medium text-gray-900"
            >Durée soustraite à la fin du temps fort</label
          >
          <select
            v-if="durationsEnd.length"
            v-model="durationEnd_selected"
            class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          >
            <option
              v-for="(duration, i) in durationsEnd"
              :key="i"
              :value="duration"
            >
              {{ duration }} s
            </option>
          </select>
        </div>
      </div>
    </Modal>
  </form>
</template>

<script setup>
import Card from '../common/Card.vue'
import Modal from '../common/Modal.vue'
import Button from '../common/Button.vue'
import ButtonRight from '../common/Button.vue'

import { getParametresById } from '../../api/parametres.js'
import {
  getParametreActivite,
  postParametreActivite,
  updateParametreActivite,
  deleteParametreActivite,
  patchParametreActivite,
} from '../../api/parametreActivite.js'
import { getProfils } from '../../api/profil.js'
import { getActivites } from '../../api/activite.ts'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const route = useRoute()
const idFitArena = ref(route.params.id)
const parametresDuration = ref({})
const parametreActivite = ref({})
const parametre = ref({})
const profils = ref({})
const activite_selected = ref({})
const durationKeyMoment_selected = ref({})
const durationEnd_selected = ref({})
const keyMomentDuration_modal = ref(false)
const modal_title = ref('')
const activites = ref([])
const durationsEnd = ['1', '2', '3', '4', '5']
const durationsKeyMoment = ['5', '10', '15', '20', '25']

onMounted(async () => {
  parametreActivite.value = await getParametreActivite()
  parametresDuration.value = await getParametresById(14)
  profils.value = await getProfils()
  activites.value = await getActivites(idFitArena.value)
})

const addKeyMomentDurationForAnActivity = async () => {
  parametre.value = {}
  activite_selected.value = {}
  modal_title.value = 'Ajouter une condition de réservation des créneaux'
  keyMomentDuration_modal.value = true
}

const modifKeyMomentDuration = async ({ actif, id }) => {
  try {
    await patchParametreActivite({ actif }, id)
    toast.success('Modification du paramètre avec succès')
  } catch (e) {
    toast.error('Erreur, Veuillez contacter votre administrateur')
  }
}

const removeKeyMomentDuration = async (i) => {
  try {
    await deleteParametreActivite(i)
    toast.success('Succès de la suppression')
  } catch (e) {
    toast.error('Erreur, Veuillez contacter votre administrateur')
  }
  parametresDuration.value = await getParametresById(14)
}

const editKeyMomentDuration = async (i) => {
  parametre.value = parametresDuration.value[i]
  keyMomentDuration_modal.value = true
  modal_title.value =
    'Modifier une durée de temps fort spécifique à une activité'
}

const saveKeyMomentDuration = async (i) => {
  const paramTemp = {
    // profil:
    activite: '/api/activites/' + activite_selected.value,
    parametre: '/api/parametres/14',
    valeur: durationKeyMoment_selected.value,
    valeur2: durationEnd_selected.value,
    actif: true,
  }

  if (modal_title.value.includes('modifier')) {
    try {
      const { data } = await updateParametreActivite(
        paramTemp,
        parametre.value.id
      )
    } catch (e) {
      toast.error('Erreur, Veuillez contacter votre administrateur')
    }
  } else {
    try {
      const { data } = await postParametreActivite(paramTemp)
    } catch (e) {
      toast.error('Erreur, Veuillez contacter votre administrateur')
    }
  }
  keyMomentDuration_modal.value = false
}
</script>
