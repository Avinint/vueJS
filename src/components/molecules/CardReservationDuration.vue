<template>
  <CardModalSection title="Durée Réservation">
    <div class="relative ml-9 my-4 overflow-x-auto text-black">
      <div class="flex bg-white">
        <div class="flex w-1/12 items-center justify-start">
          <Button
            test="TeditSlot"
            borderless
            icon="edit"
            couleur="secondary"
            class="pl-0"
            @click="editDurationSlot()"
          />
        </div>
        <div class="flex w-full items-center">
          <p class="w-4/12 py-4">Durée d'un créneau par défaut</p>
          <p class="py-4">1 h</p>
        </div>
      </div>
      <div class="flex bg-white">
        <div class="flex w-1/12 items-center justify-start">
          <Button
            test="TeditInterslot"
            borderless
            icon="edit"
            couleur="secondary"
            class="pl-0"
            @click="editDurationInterslot(i)"
          />
        </div>
        <div class="flex w-full items-center">
          <p class="w-4/12 py-4">Durée d'inter-créneau par défaut</p>
          <p class="py-4">1 min</p>
        </div>
      </div>
    </div>
  </CardModalSection>
  <CardModalSection title="Accès à la fit arena">
  </CardModalSection>
  <form @submit.prevent="saveDurationSlot">
    <Modal
      v-if="durationSlot_modal"
      title="Modifier la durée d'un créneau par défaut"
      @cancel="durationSlot_modal = false"
    >
      <div>
        <div class="mb-6 flex items-center">
          <label class="mb-2 block pr-4 text-sm font-medium text-gray-900"
            >Durée d'un créneau par défaut</label
          >
          <select
            v-model="durationSlot_selected"
            class="block w-2/12 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          >
            <option
              v-for="(duration, i) in durationSlot"
              :key="i"
              :value="duration"
            >
              {{ duration }}
            </option>
          </select>
        </div>
        <p class="text-light-blue">
          Cette modification ne sera pas appliquée sur les créneaux créés
          précédemment.
        </p>
      </div>
    </Modal>
  </form>

  <form @submit.prevent="saveDurationInterslot">
    <Modal
      v-if="durationInterslot_modal"
      title="Modifier la durée d'inter-créneau par défaut"
      @cancel="durationInterslot_modal = false"
    >
      <div>
        <div class="mb-6 flex items-center">
          <label class="mb-2 block pr-4 text-sm font-medium text-gray-900"
            >Durée d'inter-créneau par défaut</label
          >
          <select
            v-model="durationInterslot_selected"
            class="block w-2/12 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          >
            <option
              v-for="(duration, i) in durationInterslot"
              :key="i"
              :value="duration"
            >
              {{ duration }}
            </option>
          </select>
        </div>
        <p class="text-light-blue">
          Cette modification ne sera pas appliquée sur les créneaux créés
          précédemment.
        </p>
      </div>
    </Modal>
  </form>
</template>

<script setup>
import Card from '../common/Card.vue'
import Modal from '../common/Modal.vue'
import Button from '../common/Button.vue'

import { getParametres, getParametresById } from '../../api/parametres.js'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import {
  deleteParametreFitArena,
  getParametreFitArena,
  updateParametreFitArena,
  postParametreFitArena,
  patchParametreFitArena,
} from '../../api/parametreFitArena.js'
import { getEquipements } from '../../api/equipement'
import { getTypeEquipements } from '../../api/typeEquipement'
import CardModalSection from "@components/common/CardModalSection.vue";

const PARAM_DUREE_CRENEAU = 'duree_du_creneau'
const PARAM_DUREE_INTER = 'duree_inter_creneau'
const PARAM_AVANT_RESA = 'temps_d_acces_avant_la_reservation'
const PARAM_APRES_RESA = 'temps_d_acces_apres_la_reservation'
const props = defineProps(['id'])
const route = useRoute()
const idFitArena = ref(route.params.id)
const parametresSlot = ref({})
const parametresInterslot = ref({})
const durationSlot_modal = ref(false)
const durationInterslot_modal = ref(false)
const durationSlot = ['30 min', '1h', '1h30', '2h']
const durationInterslot = ['1 min', '1min30', '2 min', '2min30']
const durationSlot_selected = ref({})
const durationInterslot_selected = ref({})
const durationTemp = ref({})
const durationTempInter = ref({})

const editDurationSlot = () => {
  durationSlot_modal.value = true
}

const editDurationInterslot = () => {
  durationInterslot_modal.value = true
}

const saveDurationSlot = async (i) => {
  console.error(durationTemp.value[0].parametre.id)
  //Je recupere la donnée de la durée du creneau
  const paramTemp = {
    fitArena: '/api/fit_arenas/' + idFitArena.value,
    parametre: '/api/parametres/' + durationTemp.value[0].parametre.id,
    valeur: durationSlot_selected.value,
  }
  try {
    const { data } = await postParametreFitArena(paramTemp)
  } catch (e) {
    console.error(e)
    toast.error('Erreur, Veuillez contacter votre administrateur')
  }
  durationSlot_modal.value = false
  //toast.success('Enregistrement du paramètre avec succès')
}
const saveDurationInterslot = async (i) => {
  const paramTemp = {
    fitArena: '/api/fit_arenas/' + idFitArena.value,
    parametre: '/api/parametres/' + durationTempInter.value.parametre.id,
    valeur: durationInterslot_selected.value,
  }

  // à voir pour les fonctions à utiliser, j'ai l'impression qu'elles ne sont pas encore configurées (ParametreFitArena sur le swagger)

  try {
    const { data } = await post(paramTemp)
    toast.success('Enregistrement du paramètre avec succès')
  } catch (e) {
    toast.error('Erreur, Veuillez contacter votre administrateur')
  }
  durationInterslot_modal.value = false
}

onMounted(async () => {
  const params = { page: 1, 'fitArena.id': props.id }
  durationTempInter.value = await getParametreFitArena({ 'parametre.code': 'duree-inter-creneau', ...params })
  durationTemp.value = await getParametreFitArena({ 'parametre.code': 'duree-du-creneau', ...params })
})
</script>
