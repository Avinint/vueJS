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

  <Card>
    <h1>Condition de visualisation des créneaux</h1>
    <div class="flex items-center space-x-2">
      <Button icon="edit" couleur="secondary" borderless></Button>
      <div class="flex items-center">
        <div class="mr-2">Actif</div>
        <Switch />
      </div>
      <div class="text-sm">
        Nombre de jours visibles pour la réservation de créneaux par les
        utilisateurs Grand Public
      </div>
      <Button label="Détails" couleur="secondary" />
    </div>
    <Button
      class="font-bold font-black"
      label="Ajouter une condition de visualisation des créneaux"
      icon="add"
      couleur="secondary"
    />
    <Modal v-if="false"> </Modal>
  </Card>

  <CardConditionReservationOfSlots />
  <CardKeyMomentDuration :params="parametres" @refresh="loadParams"/>

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
  getParametreFitArena,
  patchParametreFitArena,
  postParametreFitArena,
} from '@api/parametreFitArena.js'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getParametres, postParametres } from '@api/parametres.js'
import { getProfils } from "@api/profil.js";

const ID_VISU_CRENEAU = 16

const route = useRoute()

const parametres = ref([])

const visualisation_creneaux = ref({})

const editCancelBooking = ref(false)

const cancelSessionTime = ref(1)

const profils = ref([])

onMounted(async () => {
  profils.value = await getProfils()
  // SEARCH ALL PARAMS FOR THIS FIT ARENA
  await loadParams()

  // PARAMETRE ANNULATION DES CRENEAUX
  cancelSessionTime.value = await getParameterByCode(
    'condition-annulation-des-creneaux'
  ).valeur
})

const loadParams = async () => {
  parametres.value = await getParametreFitArena({ page: 1, 'fitArena.id': route.params.id })
}

const getParameterByCode = async (code, value = 0) => {
  let parametre = parametres.value.find((el) => el.parametre.code === code)
  // if (!parametre) {
  //   await createParamsForFitArena(route.params.id, code, value)
  // }
  parametres.value = await getParametreFitArena({ page: 1, 'fitArena.id': route.params.id })
  return parametres.value.find((el) => el.parametre.code === code)
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
    const { id } = (
      await getParametres({page: 1, code: 'condition-annulation-des-creneaux'})
    )[0]
    await patchParametreFitArena(id, {
      fitArena: 'api/fit_arenas/' + route.params.id,
      parametre: 'api/parametres/' + id,
      valeur: '' + cancelSessionTime.value,
    })
  }
}
</script>
