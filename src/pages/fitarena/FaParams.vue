<template>
  <CardReservationDuration />

  <Card>
    <h1>Accès à la fit arena</h1>
  </Card>

  <Card>
    <h1>Annulation d'une réservation</h1>
    <div class="relative my-4 overflow-x-auto text-black">
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
  </Card>

  <CardConditionVisualisationCreneaux  />
  <CardConditionReservationOfSlots />
  <CardKeyMomentDuration/>

  <Card>
    <h1>Invitation à une réservation</h1>
  </Card>
</template>

<script setup>
import Card from '../../components/common/Card.vue'
import Button from '../../components/common/Button.vue'
import Modal from '../../components/common/Modal.vue'
import Switch from '../../components/common/Switch.vue'
import Input from '../../components/common/Input.vue'
import CardConditionReservationOfSlots from '../../components/molecules/CardConditionReservationOfSlots.vue'
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

const ID_VISU_CRENEAU = 16

const route = useRoute()
const  params = useParamStore()


const visualisation_creneaux = ref({})

const editCancelBooking = ref(false)

const cancelSessionTime = ref(1)

onBeforeRouteUpdate(async (to, from) => {
    await params.fetchActivites(to.params.id)
    await params.fetchParametres(to.params.id)
})

onBeforeMount(async () => {
  // SEARCH ALL PARAMS FO THIS FIT ARENA
  await params.fetchActivites(route.params.id)
  await params.fetchParametres(route.params.id)

  // PARAMETRE ANNULATION DES CRENEAUX
  cancelSessionTime.value = params.parametreFitarenas?.['condition-annulation-des-creneaux'].valeur ?? 1
})


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
    const  id = parametreFitarenas['condition-annulation-des-creneaux'].id
    await patchParametreFitArena(id, {
      fitArena: 'api/fit_arenas/' + route.params.id,
      parametre: 'api/parametres/' + id,
      valeur: '' + cancelSessionTime.value,
    })
  }
}
</script>
