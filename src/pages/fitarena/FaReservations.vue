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
      <Button icon="search" label="ouvrir la recherche" couleur="secondary" @click="afficherCalqueRecherche = true"/>
      <Modal v-if="afficherCalqueRecherche" @cancel="afficherCalqueRecherche = false" @confirm="filtrer" confirmButtonText="filtrer" icon="search">
        <template #actions>
          <Button test='TresetRechResa' @click="resetRecherche" label="reset" couleur="danger"/>
        </template>
        <Card>
          <h1 class="uppercase mb-8">Filtres de réservation</h1>
          <LabelText text="Séances"/>
          <div class="flex flex-row flex-wrap items-center w-full my-4">
            <div class="mr-3"> passées</div>
            <Switch  v-model="recherche.passe"/>
            <div class="mr-3">à venir</div>
            <Switch  v-model="recherche.futur"/>
            <div v-if="!recherche.futur && !recherche.passe" class="ml-9 mr-3">périodes</div>
            <div v-if="!recherche.futur && !recherche.passe" class="w-1/6 min-w-fit">
              <vue-tailwind-datepicker
                v-if="afficherDatePicker"
                ref="datepickerSeance"
                v-model="recherche.dateSeance"
                i18n="fr"
                use-range
                separator=" au "
                :formatter="datePickerFormat"
                class="my-2"
              />
            </div>

          </div>
          <LabelText text="Réservations"/>
          <div class="flex flex-row flex-wrap items-center w-full">
            <div class="mx-3">Statut de la réservation</div>
            <select
              id="TrechResaSelectStatut"
              v-model="recherche.statut"
              class="mr-3 block w-48 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            >
              <option :value="null">Filtrer par statut...</option>
              <option v-for="(statut, i) in selectStatuts" :key="i" :value="statut.id">
                {{ statut.libelle }}
              </option>
            </select>

            <div class="mr-3">Numéro de réservation</div>
            <Input
              id="TrechNumeroReservation"
              v-model="recherche.uuid"
              :type="'text'"
              class="w-48"
              inline
              lazy
            />
          </div>
          <div class="mx-3">Réservations</div>
          <div class="w-1/6 min-w-fit">
            <vue-tailwind-datepicker
              v-if="afficherDatePicker"
              ref="datepickerResa"
              v-model="recherche.dateReservation"
              i18n="fr"
              use-range
              separator=" au "
              :formatter="datePickerFormat"
              class="my-2"
            />
          </div>

          <div class="my-2 mx-3">Type de réservation</div>
          <select
            id="TrechResaSelectType"
            v-model="recherche.type"
            class="mr-3 block w-48 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          >
            <option :value="null">Filtrer par type...</option>
            <option v-for="(type, i) in selectTypes" :key="i" :value="type.id">
              {{ type.libelle }}
            </option>
          </select>

          <div v-if="typeSelectionne === 'grand_public'">

            <div class="my-2 mx-3">Organisateur</div>
            <Input
              id="TrechResponsableReservation"
              :model-value="recherche.responsable"
              @change="e => recherche.responsable = e.target.value"
              :type="'text'"
              class="w-40 mr-3"
              inline
              lazy
            />
          </div>
          <div v-if="typeSelectionne === 'organisme'">
            <div class="my-2 mx-3">Organismes</div>
            <select
              id="TrechResaSelectOrganisme"
              v-model="recherche.organisme"
              class="mr-3 block w-48 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"

            >
              <option :value="null">Filtrer par organisme...</option>
              <option v-for="(organisme, i) in selectOrganismes" :key="i" :value="organisme.id">
                {{ organisme.libelle }}
              </option>
            </select>
          </div>
        </Card>
      </Modal>

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
import {getOrganismes, getOrganismesParClient} from "@api/organisme";
import { useRoute } from 'vue-router'
import {annulerReservation, getReservation, getReservations, getStatuts, getTypes} from "@api/reservation";
import {toast} from "vue3-toastify";
import {emailValidation} from "@/validation";
import Modal from "@components/common/Modal.vue";
import LabelText from "@components/common/LabelText.vue";
import Card from "@components/common/Card.vue";
import Table from "@components/common/Table.vue";
import ValidationModal from "@components/common/ValidationModal.vue";
import Button from "@components/common/Button.vue";
import Switch from "@components/common/Switch.vue";
import { useMenuStore } from "@stores/menu.js";
import Input from "@components/common/Input.vue";
import {watchDebounced} from "@vueuse/core";

const route = useRoute()

const { getOrganismes } = useMenuStore()
const selectOrganismes = computed(() => getOrganismes().map(({id, libelle}) => ({id, libelle})))
const datePickerFormat = {date: 'DD/MM/YYYY', month: 'MMM'}
const selectStatuts = ref([])
const datepickerSeance = ref()
const datepickerReservation = ref()
const typesActifs = ['grand_public', 'organisme']
const selectTypes = ref([])
const afficherDatePicker = ref(true)

const rechercheDefauts = reactive({
  passe: false,
  futur: false,
  organisme: null,
  responsable: '',
  uuid: null,
  statut: null,
  type: null,
  dateReservation: { startDate: null, endDate: null },
  dateSeance: { startDate: null, endDate: null},
})
const recherche = reactive({...rechercheDefauts})

const afficherCalqueRecherche = ref(false)
const typeSelectionne =  computed(() => selectTypes?.value.find(({id}) => id === recherche.type)?.code ?? null)


const rechercheQuery = computed(() => ({
  passees: Number(recherche.passe),
  futures: Number(recherche.futur),
  idOrganisme: recherche.organisme ?? null,
  statutResa: recherche.statut ?? null,
  typeResa: recherche.type ?? null,
  uuidResa: recherche.uuid ??  null,
  dateCreationMin: dateToApi(recherche.dateReservation.startDate),
  dateCreationMax: dateToApi(recherche.dateReservation.endDate, true),
  dateSeanceMin: dateToApi(recherche.dateSeance.startDate),
  dateSeanceMax: dateToApi(recherche.dateSeance.endDate, true),
  resp: recherche.responsable ? '1' : null,
  participant: recherche.responsable || null
}))

const filtrer =  async() => {
  await chargeReservations(rechercheQuery.value)
  afficherCalqueRecherche.value = false
}

const resetRecherche = async() => {
  Object.assign(recherche, rechercheDefauts)

  recherche.dateReservation = { startDate: null, endDate: null}
  recherche.dateSeance = { startDate: null, endDate: null}
  afficherDatePicker.value = false
  await nextTick()
  afficherDatePicker.value = true
  await chargeReservations()

}

watch (() => ({...recherche}) ,  (v1, v0) => {
  if ((v1.futur !== v0.futur) && v1.futur) {
    recherche.passe = false
    recherche.dateSeance = { startDate: null, endDate: null }
  }

  if((v1.passe !== v0.passe) && v1.passe) {
    recherche.futur = false
    recherche.dateSeance = { startDate: null, endDate: null }
  }

  if (recherche.dateSeance.startDate !== null) {
    recherche.futur = false
    recherche.passe = false
  }
})

const dateToApi = (date, max = false) =>   date && dayjs(date, 'DD/MM/YYYY')
  .format('YYYY-MM-DD ' + (max ? '23:59:59' : '00:00:00')) || null

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

const idFA = computed(() => route.params.id)
const calqueFormulaireVisible = ref(false)
const calqueConfirmationVisible = ref(false)

onMounted(async () => {
   await chargeReservations()

  // recherche
  selectTypes.value = (await getTypes()).filter(type => typesActifs.includes(type.code)).map(({id, libelle, code}) => ({id, libelle, code}))
  selectStatuts.value = (await getStatuts()).map(({id, libelle}) => ({id, libelle}))
})

watch(() => idFA.value, () => chargeReservations())



const chargeReservations = async(params = {}) => { reservations.value = await getReservations({idFA : idFA.value, page: 1, ...params}) }

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
    // reservations.value.splice(index, 1)
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