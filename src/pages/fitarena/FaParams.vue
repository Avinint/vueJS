<template>
  <Card class="space-y-3">
    <h1 class="mb-6">Paramètres de la fit arena</h1>
    <CardReservationDuration />
    <CardReservationAccess />
    <CardReservationCancel />
    <CardConditionVisualisationCreneaux @suppression="supprimer" />
    <CardConditionReservationCreneaux @suppression="supprimer"/>
    <CardKeyMomentDuration  @suppression="supprimer"/>

    <CardModalSection title="Invitation à une réservation">
    </CardModalSection>
  </Card>

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
import Card from '../../components/common/Card.vue'
import CardKeyMomentDuration from '../../components/FaParams/CardKeyMomentDuration.vue'
import CardReservationDuration from '../../components/FaParams/CardReservationDuration.vue'
import CardReservationAccess from '../../components/FaParams/CardReservationAccess.vue'
import CardReservationCancel from '../../components/FaParams/CardReservationCancel.vue'
import CardConditionVisualisationCreneaux from "@components/FaParams/CardConditionVisualisationCreneaux.vue"
import CardModalSection from "@components/common/CardModalSection.vue"
import CardConditionReservationCreneaux from "@components/FaParams/CardConditionReservationCreneaux.vue"
import ValidationModal from "@components/common/ValidationModal.vue"

import { postParametreFitArena } from '@api/parametreFitArena.js'
import { postParametres } from '@api/parametres.js'
import { useParamStore } from '@stores/parametre.js'

import { onBeforeMount, ref } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { toast } from "vue3-toastify";

const route = useRoute()
const  params = useParamStore()
const { fetchParametres, fetchActivites } = params
const modaleConfirmation = ref(false)

let callbackConfirmation = null
let argumentCallback = null

onBeforeRouteUpdate(async (to) => {
  await fetchActivites(to.params.id)
  await fetchParametres(to.params.id)
})

onBeforeMount(async () => {
  // SEARCH ALL PARAMS FOR THIS FIT ARENA
  await fetchActivites(route.params.id)
  await fetchParametres(route.params.id)
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
    zoneParametres: []
  })
  // LINK PARAMS TO THIS FIT ARENA AND SET VALUE
  await postParametreFitArena({
    fitArena: 'api/fit_arenas/' + id_fa,
    parametre: 'api/parametres/' + id,
    valeur: '' + value,
  })
}

const rafraichir = async () => {
  await params.fetchParametres(route.params.id)
}
</script>
