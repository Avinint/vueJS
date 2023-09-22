<template>
  <CrudList
    entity="réservation"
    plural="réservations"
    :columns="colonnesReservations"
    :data="getTableData()"
    :can-remove="true"
    :can-read="true"
    :can-filter="true"
    @entity:remove="annulerResa"
    @entity:read="consulterResa"
  >
    <template #recherche>
      <RechercheReservation @chargement-liste="fetchDonnees"/>
    </template>
  </CrudList>

  <Modal
    v-if="calqueFormulaireVisible"
    title="RÉSERVATION"
    @cancel="fermerCalqueFormulaire()"
    @confirm="annulerResa(details)"
    cancel-button-text="Fermer"
    confirm-button-text="Annuler la réservation"
    size="4xl"
  >
    <Card class="space-y-2">
      <div class="flex items-center">
        <div class="w-1/5 mb-3">
          Référence
        </div>
        <div class="w-2/5 bg-gray-50 text-gray-700 text-sm mb-3">
          {{ details.uuid }}
        </div>

        <div class=" w-1/5 mb-3">
          Organisateur
        </div>
        <div class="w-1/5 bg-gray-50 text-gray-700 mb-3">
          {{ details.prenomOrganisateur + ' ' + details.nomOrganisateur }}
        </div>
      </div>

      <div class="flex items-center">
        <div class="w-1/5 mb-3">
          Date de réservation
        </div>

        <div class="w-2/5 bg-gray-50 text-gray-700 mb-3">
          {{ details.dateCreation }}
        </div>
        <div class="w-1/5 mb-3">
          Montant
        </div>

        <div class="w-1/5 bg-gray-50 text-gray-700 mb-3">
          {{ details.tarif }} €
        </div>
      </div>

      <div class="flex items-center">
        <div class="w-1/5 mb-3">
          Sport
        </div>
        <div class="w-2/5 bg-gray-50 text-gray-700 mb-3">
          {{ details.sport ?? 'football' }}
        </div>
        <div class="w-1/5 mb-3">
          Statut
        </div>
        <div class="w-1/5 bg-gray-50 text-gray-700 mb-3">
          {{ details.statut }}
        </div>
      </div>

      <div class="flex items-center">
        <div class="w-1/5 mb-3">
          Créneau
        </div>
        <div class="w-2/5 bg-gray-50 text-gray-700 mb-3">
          {{ details.dateDebut + ' ' + details.dateFin }}
        </div>
      </div>
      <div class="h-6"></div>
      <LabelText :text="`[${details.participants.length}] Équipiers`"/>

      <Table
        :columns="getColonnesParticipants(details.participants)"
        :data="creerLigneParticipant(details.participants)"

      />
    </Card>
    <template #but>
      <Button submit test='TconfirmModal' @click="emit('confirm', $event)" label="Annuler la réservation"
              class="bg-red-600 hover:bg-red-800"/>
    </template>
  </Modal>
  <form @submit.prevent="annulerResaConfirmation(index)">
    <ValidationModal
      v-if="calqueConfirmationVisible"
      type="edit"
      @cancel="calqueConfirmationVisible = false"
    >
      Voulez-vous valider l'annulation ?
    </ValidationModal>
  </form>
</template>

<script setup lang="ts">

import CrudList from "@components/molecules/CrudList.vue";
import {computed, nextTick, onMounted, reactive, ref, watch, toRaw} from "vue";
import dayjs from 'dayjs'
import {annulerReservation, getReservation, getReservations, getStatuts, getTypes} from "@api/reservation";
import {toast} from "vue3-toastify";
import Modal from "@components/common/Modal.vue";
import LabelText from "@components/common/LabelText.vue";
import Card from "@components/common/Card.vue";
import Table from "@components/common/Table.vue";
import ValidationModal from "@components/common/ValidationModal.vue";
import Button from "@components/common/Button.vue";
import RechercheReservation from "@components/molecules/RechercheReservation.vue";

const props = defineProps(['id'])

const colonnesReservations = [
  { data: (e): string => e.type, label: 'Type' },
  { data: (e): string => e.responsable, label: 'Responsable' },
  { data: (e): string => dayjs(e.dateCreation).format('D MMMM YYYY'), label: 'Date de réservation' },
  { data: (e): string => dayjs(e.dateDebut).format('D MMMM YYYY HH[h]mm'), label: 'Date - Début de séance' },
  { data: (e): string => dayjs(e.dateFin).format('D MMMM YYYY HH[h]mm'), label: 'Date - Fin de séance' },
  { data: (e): string => e.valorisation, label: 'Valorisation' },
  { data: (e): string => e.statut, label: 'Statut' },
]

const getColonnesParticipants = (e) => {
  return [
    {data: (e): string => e.nom + ' ' + e.prenom, label: 'Nom prénom'},
    {data: (e): string => e.email, label: 'Adresse email'},
    {data: (e): string => e.portable, label: 'Numéro de téléphone'},
  ]
}

const creerLigneParticipant = (data) => {
  return  data.map((ligne) => ({
    id: ligne.id,
    data: ligne,
    editable: false,
    removable: false}))
}

const reservations = ref([])
const details = ref({})

const calqueFormulaireVisible = ref(false)
const calqueConfirmationVisible = ref(false)

const fetchDonnees = async(params = {}) => { reservations.value = await getReservations({idFA : props.id, page: 1, ...params}) }

onMounted(async () => await fetchDonnees())

watch(() => props.id, () => fetchDonnees())

function getTableData() {
  return reservations.value.map((resa) => {
    return {
      id: resa.id,
      data: resa,
      editable: false,
      removable: true,
      readable: true,
    }
  })
}

const consulterResa = async(reservation) => {

  if (details.value.id !== reservation.id || details.value.participants === undefined) {
    details.value = await getReservation(reservation.id)
    details.value = {...details.value,
      dateCreation: dayjs(details.value.dateCreation).format('D MMMM YYYY'),
      dateDebut: dayjs(details.value.dateDebut).format('dddd D MMMM YYYY /  HH[h]mm'),
      dateFin: dayjs(details.value.dateFin).format('- HH[h]mm')
    }
  }

  calqueFormulaireVisible.value = true
}

const annulerResa = (reservation) => {
  calqueConfirmationVisible.value = true
  if (details.value.id !== reservation.id) {
    details.value = reservation
  }
}
const annulerResaConfirmation = () => {
  try{
    const index = reservations.value.findIndex(ligne => ligne.id === details.value.id)
    annulerReservation( details.value.id)
    reservations.value[index].statut = 'Annulée'
    fermerCalqueFormulaire()
    toast.success("Réservation annulée avec succès")
  } catch(e) {
    toast.error("Erreur, Veuillez contacter votre administrateur")
  }
}

const fermerCalqueFormulaire = () => {
  calqueFormulaireVisible.value = false
  calqueConfirmationVisible.value = false
}

</script>

<style scoped lang="scss">

</style>