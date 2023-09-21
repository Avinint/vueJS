<template>
  <div class="space-y-10">
  <CardReservationDuration />

  <CardModalSection title="Annulation d'une réservation">
    <div class="relative ml-9 my-4 overflow-x-auto text-black">
      <div class="flex bg-white">
        <div class="flex w-1/12 items-center justify-start">
          <Button
            v-if="!editCancelBooking"
            test="TeditSlot"
            borderless
            icon="edit"
            couleur="secondary"
            @click="setCancelBooking"
          />
          <Button
            v-if="editCancelBooking"
            test="TeditSlot"
            borderless
            icon="cross"
            couleur="secondary"
            @click="setCancelBooking"
          />
        </div>
        <div class="flex w-full items-center space-x-2">
          <p class="w-4/12 py-4">
            Délai d'annulation d'une réservation avant le début de la séance
          </p>
          <input
            v-if="editCancelBooking"
            v-model="cancelSessionTime"
            type="number"
            min="0"
            class="block rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          />
          <div v-if="!editCancelBooking">{{ cancelSessionTime }} h</div>
        </div>
      </div>
    </div>
  </CardModalSection>

  <CardConditionVisualisationCreneaux @suppression="supprimer" />
  <CardConditionReservationCreneaux @suppression="supprimer"/>
  <CardKeyMomentDuration  @suppression="supprimer"/>

  <CardModalSection title="Invitation à une réservation">
  </CardModalSection>
  </div>

  <form @submit.prevent="confirmation()">
    <ValidationModal
      v-if="modaleConfirmation"
      type="delete"
      @cancel="modaleConfirmation = false"
    >
    </ValidationModal>
  </form>
</template>

<script setup>
import Button from '../../components/common/Button.vue'
import Input from '../../components/common/Input.vue'
import CardKeyMomentDuration from '../../components/molecules/CardKeyMomentDuration.vue'
import CardReservationDuration from '../../components/molecules/CardReservationDuration.vue'
import {

  patchParametreFitArena,
  postParametreFitArena,
} from '@api/parametreFitArena.js'
import { computed, onBeforeMount, onMounted, ref } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { getParametres, postParametres, getParametresParFitArena } from '@api/parametres.js'
import { useParamStore } from '@stores/parametre.js'
import { getProfils } from "@api/profil.js";
import CardConditionVisualisationCreneaux from "@components/molecules/CardConditionVisualisationCreneaux.vue";
import CardModalSection from "@components/common/CardModalSection.vue";
import CardConditionReservationCreneaux from "@components/molecules/CardConditionReservationCreneaux.vue";
import { toast } from "vue3-toastify";
import ValidationModal from "@components/common/ValidationModal.vue";

const route = useRoute()
const  params = useParamStore()
const { fetchParametres, fetchActivites } = params
const modaleConfirmation = ref(false)

const editCancelBooking = ref(false)

const cancelSessionTime = ref(1)
let callbackConfirmation = null
let argumentCallback = null

onBeforeRouteUpdate(async (to, from) => {
    await fetchActivites(to.params.id)
    await fetchParametres(to.params.id)
})

onBeforeMount(async () => {
  // SEARCH ALL PARAMS FO THIS FIT ARENA
  await fetchActivites(route.params.id)
  await fetchParametres(route.params.id)

  // PARAMETRE ANNULATION DES CRENEAUX
  cancelSessionTime.value = params.parametreFitarenas?.['condition-annulation-des-creneaux'].valeur ?? 1
})

const supprimer = (id, func) => {
  modaleConfirmation.value = true
  callbackConfirmation = func
  argumentCallback = id
}

const confirmation = async () => {
  try {
    if (Array.isArray(argumentCallback)) {
      for (const argument of argumentCallback) {
        await callbackConfirmation(argument)
      }
    } else {
      await callbackConfirmation(argumentCallback)
    }

    await rafraichir()
    toast.success('Succès de la suppression')
  } catch (e) {
    toast.error('Erreur, Veuillez contacter votre administrateur')
  }

  modaleConfirmation.value = false
}

const createParamsForFitArena = async (id_fa, code, value) => {
  // CREATE GENERIC PARAMS
  const { id } = await postParametres({
    code,
    libelle: code,
    type: code,
    zoneParametres: [],
  })
  // LINK PARAMS TO THIS FIT ARENA AND SET VALUE
  await postParametreFitArena({
    fitArena: 'api/fit_arenas/' + id_fa,
    parametre: 'api/parametres/' + id,
    valeur: '' + value,
  })
}

const setCancelBooking = async () => {
  editCancelBooking.value = !editCancelBooking.value
  if (!editCancelBooking.value) {
    // RETURN TO READONLY MODE -> SAVE INPUT VIA API
    const  id = params.parametreFitarenas['condition-annulation-des-creneaux'].id
    await patchParametreFitArena(id, {
      fitArena: 'api/fit_arenas/' + route.params.id,
      parametre: 'api/parametres/' + id,
      valeur: '' + cancelSessionTime.value,
    })
  }
}

const rafraichir = async () => {
  await params.fetchParametres(route.params.id)
}
</script>
