<template>
  <Spinner v-if="spinner" />

  <CrudList
    v-if="!spinner"
    entity="réservation"
    plural="liste des réservations"
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
    size="5xl"
  >
    <div class="pl-4 pr-10">
      <div class="infos-section">
        <div class="flex items-center w-5/12">
          <p class="label-text">Référence</p>
          <div class="infos">
            {{ details.uuid }}
          </div>
        </div>
        <div class="flex items-center w-5/12">
          <p class="label-text">Montant</p>
          <div class="infos">
            {{ details.tarif }}€
          </div>
        </div>
      </div>
      <div class="infos-section">
        <div class="flex items-center w-5/12">
          <p class="label-text">Date de réservation</p>
          <div class="infos">
            {{ details.dateCreation }}
          </div>
        </div>
        <div class="flex items-center w-5/12">
          <p class="label-text">Statut</p>
          <div class="infos">
            {{ details.statut }}
          </div>
        </div>
      </div>
      <div class="infos-section">
        <div v-if="details.type === 'Organisme'" class="flex items-center w-5/12">
          <p class="label-text">Titre</p>
          <div class="infos">
            {{ details.titre ?? '...' }}
          </div>
        </div>
        <div v-else class="flex items-center w-5/12">
          <p class="label-text">Sport</p>
          <div class="infos">
            {{ details.sport ?? '...' }}
          </div>
        </div>
        <div class="flex items-center w-5/12">
          <p class="label-text">Créneau</p>
          <div class="infos">
            {{ details.dateDebut + ' ' + details.dateFin }}
          </div>
        </div>
      </div>
      <div class="infos-section">
        <div class="flex items-center w-5/12">
          <p class="label-text">Organisateur(s)</p>
          <div class="infos">
            {{ orga }}
          </div>
        </div>
        <div v-if="details.type === 'Organisme'" class="flex items-center w-5/12">
          <p class="label-text">Organisme</p>
          <div class="infos">
            {{ details.organisme }}
          </div>
        </div>
      </div>
      <div class="mt-20">
        <CardModalSection :title="`(${details.participants.length}) Équipiers`">
          <template #content>
            <Table
              :columns="getColonnesParticipants()"
              :data="creerLigneParticipant(details.participants)"
            />
          </template>
        </CardModalSection>
      </div>
    </div>
  </Modal>
  <form @submit.prevent="annulerResaConfirmation()">
    <ValidationModal
      v-if="calqueConfirmationVisible"
      type="delete"
      @cancel="calqueConfirmationVisible = false"
    >
    </ValidationModal>
  </form>
</template>

<script setup lang="ts">
import CrudList from "@components/molecules/CrudList.vue";

import { onMounted, ref, watch, defineProps } from "vue";
import dayjs from 'dayjs'
import { annulerReservation, getReservation, getReservations } from "@api/reservation";
import { toast } from "vue3-toastify";

import Modal from "@components/common/Modal.vue";
import CardModalSection from '@components/common/CardModalSection.vue'
import Table from "@components/common/Table.vue";
import ValidationModal from "@components/common/ValidationModal.vue";
import Button from "@components/common/Button.vue";
import Spinner from '@/components/common/Spinner.vue'
import RechercheReservation from "@components/molecules/RechercheReservation.vue";

const props = defineProps(['id'])

const colonnesReservations = [
  { data: (e): string => e.type, label: 'Type' },
  { data: (e): string => e.titre, label: 'Titre' },
  { data: (e): string => e.responsable, label: 'Responsable' },
  { data: (e): string => dayjs(e.dateCreation).format('D MMMM YYYY'), label: 'Date de réservation' },
  { data: (e): string => dayjs(e.dateDebut).format('D MMMM YYYY HH[h]mm'), label: 'Date - Début de séance' },
  { data: (e): string => dayjs(e.dateFin).format('D MMMM YYYY HH[h]mm'), label: 'Date - Fin de séance' },
  { data: (e): string => e.valorisation, label: 'Valorisation' },
  { data: (e): string => e.statut, label: 'Statut' }
]

const getColonnesParticipants = () => {
  return [
    {data: (e): string => e.nom + ' ' + e.prenom, label: 'Nom Prénom'},
    {data: (e): string => e.email, label: 'Adresse email'},
    {data: (e): string => e.portable, label: 'Numéro de téléphone'}
  ]
}

const creerLigneParticipant = (data) => {
  return data.map((ligne) => ({
    id: ligne.id,
    data: ligne,
    editable: false,
    removable: false
  }))
}

const reservations = ref([])
const details = ref({})
const orga = ref('')
const spinner = ref(false)

const calqueFormulaireVisible = ref(false)
const calqueConfirmationVisible = ref(false)

const fetchDonnees = async(params = {}) => {
  reservations.value = await getReservations({ idFA: props.id, page: 1, ...params })
}

onMounted(async () => {
  spinner.value = true
  await fetchDonnees()
  spinner.value = false
})

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

const consulterResa = async(reservation: any) => {
  if (details.value.id !== reservation.id || details.value.participants === undefined) {
    details.value = await getReservation(reservation.id)
    details.value = {...details.value,
      dateCreation: dayjs(details.value.dateCreation).format('D MMMM YYYY'),
      dateDebut: dayjs(details.value.dateDebut).format('dddd D MMMM YYYY / HH[h]mm'),
      dateFin: dayjs(details.value.dateFin).format('- HH[h]mm')
    }
  }
  if (details.value.organisateurs) {
    orga.value = details.value.organisateurs.map(orga => orga.nom.toUpperCase() + ' ' + orga.prenom).join(', ')
  }

  calqueFormulaireVisible.value = true
}

const annulerResa = (reservation) => {
  calqueConfirmationVisible.value = true
  if (details.value.id !== reservation.id) {
    details.value = reservation
  }
}
const annulerResaConfirmation = async () => {
  spinner.value = true
  try {
    const index = reservations.value.findIndex(ligne => ligne.id === details.value.id)
    await annulerReservation(details.value.id)
    reservations.value[index].statut = 'Annulée'
    fermerCalqueFormulaire()
    toast.success("Réservation annulée avec succès")
  } catch(e) {
    toast.error("Erreur, veuillez contacter votre administrateur")
  }
  await fetchDonnees()
  spinner.value = false
}

const fermerCalqueFormulaire = () => {
  calqueFormulaireVisible.value = false
  calqueConfirmationVisible.value = false
  orga.value = ''
}

</script>

<style scoped>
.label-text {
  --tw-text-opacity: 1;
  color: rgb(17 24 39 / var(--tw-text-opacity));
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.25rem;
  width: 50%;
}

.infos {
  background-color: #F9FAFB;
  width: 100%;
  color: #000;
  border: 1px solid #E9E9E9;
  padding: 0.5rem 1rem;
  border-radius: 10px;
}

.infos-section {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}
</style>
