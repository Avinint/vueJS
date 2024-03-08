<template>
  <Modal
    @cancel="state = 'closed'"
    v-if="state != 'closed'"
    size="4xl"
    type="none"
    :title="state == 'create' ? 'Demande de création de créneaux' : 'Modification de demande de créneaux'"
  >
    <Spinner v-if="spinnerDemandeModal" />
    <div v-if="!spinnerDemandeModal" class="pl-4">
      <Input class="max-w-lg" label="Titre du créneau *" v-model="form.title" />
      <div class="flex gap-16 items-end mt-8">
        <div class="flex flex-col">
          <p class="label-text mb-2">Date du créneau *</p>
          <vue-tailwind-datepicker
            input-classes="border border-gray-300 rounded-lg"
            v-model="date"
            i18n="fr"
            as-single
            :formatter="{ date: 'DD-MM-YYYY', month: 'MMMM' }"
          />
        </div>
        <TimeRange label="Plage horaire du créneau" v-model:start_time="form.start_time" v-model:end_time="form.end_time" />
      </div>
      <div class="flex items-center gap-4 mt-8">
        <p class="label-text">Nombre de personnes attendues *</p>
        <Input class="input-count" v-model="form.people_count" />
      </div>
      <Button
        v-if="state === 'create' || (state === 'edit' && isRecurrent)"
        label="Récurrence"
        couleur="secondary"
        :class="submenu ? 'bg-recurence' : 'bg-none'"
        @click="submenu = !submenu"
      />
      <MenuRecurrence v-if="submenu" class="mt-4" />
      <HeaderModal text="ZONES" class="my-8" />
      <!-- SÉLECTION DE TOUTES LES ZONES -->
      <Button
        :label="`${labelCheckedAllZones} toutes les zones`"
        :class="isAllZoneChecked ? 'bg-red-600 text-white mb-4' : 'bg-neutral-200 text-black mb-4'"
        @click="selectAllZones()"
      />
      <InputOptions :options="props.zones" v-model="form.zones" :value="props.libelle" />
      <CardModalSection title="COMMENTAIRE" class="my-8">
        <template #content>
          <div v-if="commentaires.length > 0" class="mb-4 rounded-lg border border-gray-300">
            <div v-for="(com, i) in commentaires" :key="`com_`+ i" class="p-4 text-sm">
              <p class="text-black">
                {{ com.userEmail }} - 
                {{ dayjs(com.date_creation).format('DD MMMM YYYY') }} à
                {{ dayjs(com.date_creation).format('HH:mm') }}
              </p>
              <p class="text-gray-500 mt-2">{{ com.texte }}</p>
            </div>
          </div>
          <textarea v-model="form.commentaire" class="rounded-lg w-full text-black border border-gray-300 bg-gray-50" placeholder="Votre commentaire..." />
          <Button v-if="state === 'edit'" @click="ajouterCommentaire()" label="Poster un commentaire" couleur="danger" />
        </template>
      </CardModalSection>
      <div class="flex justify-end gap-10">
        <Button
          v-if="state == 'edit' && eventId !== 0"
          @click="deleteDemande"
          label="Annuler une demande"
          couleur="secondary"
        />
        <Button
          @click="submitDemande"
          label="Demander une validation"
          couleur="danger"
        />
      </div>
      <div v-if="errorMessage !== ''" class="text-red-600 mb-4">{{ errorMessage }}</div>
    </div>
  </Modal>
  <Modal
    v-if="verifModal"
    @cancel="verifModal = false"
    size="4xl"
    title="CONFIRMATION DE CRÉATION"
    type="none"
  >
    <Spinner v-if="spinnerConfirmDemandeModal" />
    <div v-if="!spinnerConfirmDemandeModal">
      <CardModalSection
        v-if="verifCreneaux.creneauxValide"
        title="CRÉNEAUX SOUMIS POUR VALIDATION PAR LA COLLECTIVITÉ"
        class="pl-4"
      >
        <table
          v-if="verifCreneaux.creneauxValide.length > 0"
          class="w-full text-left text-sm text-gray-500 bg-gray-200 border border-gray-200"
        >
          <thead>
            <tr>
              <th scope="col" class="px-6 py-3">Date du créneau</th>
              <th scope="col" class="px-6 py-3">Horaire</th>
              <th scope="col" class="px-6 py-3">Statut demande</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(
                creneau, i
              ) in verifCreneaux.creneauxValide"
              :key="`creneauxValide-`+ i"
              class="bg-white border border-gray-200"
            >
              <td class="px-6 py-4 flex">
                {{ dayjs(creneau.dateDebut).format('DD/MM/YYYY') }}
              </td>
              <td class="px-6 py-4 border border-gray-200">
                {{ dayjs(creneau.dateDebut).format('HH:mm') }} - {{ dayjs(creneau.dateSortie).format('HH:mm') }}
              </td>
              <td class="px-6 py-4 flex items-center" id="statut">
                Soumis à validation
                <div class="w-3 h-3 bg-green-600 rounded-xl ml-10" />
              </td>
            </tr>
          </tbody>
        </table>
      </CardModalSection>
  
      <CardModalSection
        v-if="verifCreneaux.creneauxConflit?.length > 0"
        title="CRÉNEAUX NON CRÉÉS, CAR ILS ENTRENT EN CONFLIT AVEC DES RÉSERVATIONS DÉJÀ VALIDÉES"
        class="pl-4"
      >
        <table
          class="w-full text-left text-sm text-gray-500 bg-gray-200 border border-gray-200"
        >
          <thead>
            <tr>
              <th scope="col" class="px-6 py-3">Date du créneau</th>
              <th scope="col" class="px-6 py-3">Horaire</th>
              <th scope="col" class="px-6 py-3">Statut demande</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(
                creneau, i
              ) in verifCreneaux.creneauxConflit"
              :key="`creneauxConflit-`+ i"
              class="bg-white border border-gray-200"
            >
              <td class="px-6 py-4 flex">
                {{ dayjs(creneau.dateDebut).format('DD/MM/YYYY') }}
              </td>
              <td class="px-6 py-4 border border-gray-200">
                {{ dayjs(creneau.dateDebut).format('HH:mm') }} - {{ dayjs(creneau.dateSortie).format('HH:mm') }}
              </td>
              <td class="px-6 py-4 flex items-center" id="statut">
                Non validé
                <div class="w-3 h-3 bg-red-600 rounded-xl ml-10" />
              </td>
            </tr>
          </tbody>
        </table>
      </CardModalSection>
      <div class="flex justify-end gap-4">
        <Button
          @click="modifierDemande"
          label="Modifier ma demande"
          couleur="secondary"
          class="border border-red-600 text-red-600"
        />
        <Button
          v-if="isPossibleToCreateDemande"
          @click="submitDemandeValidation"
          label="Valider ma demande"
          couleur="danger"
        />
      </div>
    </div>
  </Modal>

  <form @submit.prevent="removeDemandeValidation()">
    <ValidationModal
      v-if="deleteDemande_modal"
      type="delete"
      @cancel="deleteDemande_modal = false"
    >
    </ValidationModal>
  </form>
</template>

<script setup lang="ts">
import Spinner from '@components/common/Spinner.vue'
import Button from '@components/common/Button.vue'
import Input from '@components/common/Input.vue'
import InputOptions from '@components/common/InputOptions.vue'
import Modal from '@components/common/Modal.vue'
import ValidationModal from '@components/common/ValidationModal.vue'
import CardModalSection from '@components/common/CardModalSection.vue'
import HeaderModal from '@components/common/HeaderModal.vue'
import TimeRange from '@components/molecules/TimeRange.vue'
import MenuRecurrence from '@components/faPlanning/MenuRecurrence.vue'

import type { DateSelectArg, EventClickArg } from '@fullcalendar/core'

import { extractHour, parseDateToInput } from '../../services/date_service'
import { makeDemandeEditContract } from '../../services/planning/creneau_service'
import {
  postCreneauVerifDemande,
  postCreneauDemande,
  updateCreneauDemande,
  deleteCreneauDemande,
  postCommentaire
} from '@api/creneau'

import { usePlanningStore } from '@stores/planning'
import { useCreneauStore } from '@stores/creneau'
import { useUserStore } from "@stores/user"

import { reactive, ref, defineProps, defineExpose, computed } from 'vue'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'
import { toast } from 'vue3-toastify'

const planningStore = usePlanningStore()
const creneau_store = useCreneauStore()
const user = useUserStore()
const route = useRoute()
const verifModal = ref(false)
const verifCreneaux = ref({})
const contract = ref({})
const date = ref('')
const errorMessage = ref('')
const eventId = ref(0)
const creneauId = ref(0)
const commentaires = ref([])
const deleteDemande_modal = ref(false)
const submenu = ref(false)
const isRecurrent = ref(false)
const isAllZoneChecked = ref(false)
const labelCheckedAllZones = ref('Sélectionner')
const spinnerDemandeModal = ref(false)
const spinnerConfirmDemandeModal = ref(false)

const props = defineProps({
  zones: Object
})

const default_form_values = {
  title: '',
  date: '',
  start_time: '',
  end_time: '',
  people_count: 0,
  zones: [],
  commentaire: '',
  recurrence: undefined
}

const form = reactive<{
  title: string,
  date: string,
  start_time: string,
  end_time: string,
  people_count: number,
  zones: number[],
  commentaire: string,
  recurrence?: object
}>({ ...default_form_values })

defineExpose({ create, edit })

const state = ref<'create' | 'edit' | 'closed'>('closed')

const isPossibleToCreateDemande = computed(() => {
  // CACHER LE BOUTON "VALIDER MA DEMANDE" LORSQU'AUCUN CRÉNEAU NE PEUT ÊTRE CRÉÉ
  return verifCreneaux.value.creneauxValide.length !== 0
})

function create(event: DateSelectArg) {
  commentaires.value = []
  submenu.value = false
  state.value = 'create'
  isRecurrent.value = false
  form.recurrence = default_form_values.recurrence
  form.title = default_form_values.title
  form.people_count = default_form_values.people_count
  form.zones = [...planningStore.getActiveZones]
  form.commentaire = default_form_values.commentaire
  date.value = parseDateToInput(event.start)
  form.start_time = extractHour(event.start)
  form.end_time = extractHour(event.end)
}

function edit(event: EventClickArg) {
  const e = event.event._def
  submenu.value = false
  if (e.extendedProps.recurrence) {
    form.recurrence = e.extendedProps.recurrence
    isRecurrent.value = true
    submenu.value = true
  }
  state.value = 'edit'
  form.title = e.title
  form.people_count = e.extendedProps.nbPersonnesAttendu
  eventId.value = e.extendedProps.demandeId
  creneauId.value = e.extendedProps.id
  form.zones = e.extendedProps.zones
  form.commentaire = default_form_values.commentaire
  commentaires.value = e.extendedProps.commentaires
  date.value = dayjs(e.extendedProps.dateDebut).format('DD-MM-YYYY')
  form.start_time = dayjs(e.extendedProps.dateDebut).format('HH:mm')
  form.end_time = dayjs(e.extendedProps.dateSortie).format('HH:mm')
}

const selectAllZones = () => {
  if (isAllZoneChecked.value) { // si toutes les zones sont déjà checkées
    labelCheckedAllZones.value = 'Sélectionner'
    // désélectionner toutes les zones
    form.zones = []
  } else {
    labelCheckedAllZones.value = 'Désélectionner'
    form.zones = []
    props.zones.forEach(zone => {
      form.zones.push(zone.id)
      zone.zoneActivites.forEach(activity => {
        activity.activite.checked = true
      })
    })
  }
  isAllZoneChecked.value = !isAllZoneChecked.value
}

const afficherErreur = (message) => {
  errorMessage.value =  message
  spinnerDemandeModal.value = false
}

const submitDemande = async() => {
  errorMessage.value = ''
  if (form.zones.length === 0) {
    afficherErreur("Une zone doit être sélectionnée")
    return
  } else if (date.value == '') {
    afficherErreur("Une date doit être sélectionnée")
    return
  } else if (form.title == '') {
    afficherErreur("Un titre de créneau doit être renseigné")
    return
  } else if (form.people_count === 0) {
    afficherErreur("Le nombre de personnes attendues doit être renseigné")
    return
  }

  let organisme_id = route.params.org_id as string
  let fitarena_id = route.params.id as string
  const day = date.value.split('-')[0]
  const month = date.value.split('-')[1]
  const year = date.value.split('-')[2]
  form.date = `${year}-${month}-${day}`

  if (submenu.value === true) {
    if (creneau_store.recurrence) {
      if (creneau_store.recurrence.dateFin === 'Invalid Date') {
        afficherErreur("Une date de fin doit être renseignée")
        return
      }
      if (creneau_store.recurrence.recurrenceType === 2) {
        if (creneau_store.recurrence.recurrenceJoursSemaine.length === 0) {
          afficherErreur("Veuillez renseigner au moins un jour dans la semaine pour la récurrence.")
          return
        }
      } else if (creneau_store.recurrence.recurrenceType === 1) {
        creneau_store.recurrence.recurrenceJoursSemaine = []
      }

      form.recurrence = {
        dateDebut: creneau_store.recurrence.dateDebut,
        dateFin: creneau_store.recurrence.dateFin,
        maxOccurrences: creneau_store.recurrence.maxOccurrences,
        recurrenceJoursSemaine: creneau_store.recurrence.recurrenceJoursSemaine,
        recurrenceOrdinaux: creneau_store.recurrence.recurrenceOrdinaux,
        recurrenceSemainesMois: creneau_store.recurrence.recurrenceSemainesMois,
        recurrenceType: creneau_store.recurrence.recurrenceType,
        separation: creneau_store.recurrence.separation
      }
      form.recurrence.separation -= 1
    }
  }

  spinnerDemandeModal.value = true
  contract.value = makeDemandeEditContract(parseInt(fitarena_id), parseInt(organisme_id), form)
  verifCreneaux.value = await postCreneauVerifDemande(contract.value)
  spinnerDemandeModal.value = false
  verifModal.value = true
}

const ajouterCommentaire = async () => {
  if (form.commentaire === null || form.commentaire === '') {
    toast.error('Erreur, veuillez remplir le champ commentaire')
    return
  }

  await postCommentaire({commentaire: form.commentaire}, eventId.value).then(() => {
    commentaires.value.push({
      texte: form.commentaire,
      userEmail: user.username,
      date_creation: new Date()
    })
    form.commentaire = ''
    toast.success('Commentaire ajouté')
  }).catch(e => {
    toast.error('Erreur, Veuillez contacter votre administrateur')
  })
}

const submitDemandeValidation = async () => {
  spinnerConfirmDemandeModal.value = true
  if (state.value === 'edit') {
    const mode = form.recurrence === undefined ? 'occurence' : 'recurrence'
    if (creneauId.value !== 0) {
      verifCreneaux.value = await updateCreneauDemande(contract.value, creneauId.value, mode);
    } else {
      verifCreneaux.value = await updateCreneauDemande(contract.value, eventId.value, mode);
    }
  } else {
    await postCreneauDemande(contract.value)
  }

  await refreshPlanning()
  spinnerConfirmDemandeModal.value = false
  verifModal.value = false
  state.value = 'closed'
  submenu.value = false
}

const modifierDemande = () => {
  verifModal.value = false
}

const deleteDemande = async () => {
  deleteDemande_modal.value = true
}

const removeDemandeValidation = async () => {
  let event = {}
  try {
    await deleteCreneauDemande(event, eventId.value)
    toast.success('Suppression effectuée avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }
  deleteDemande_modal.value = false
  await refreshPlanning()
  state.value = 'closed'
}

const refreshPlanning = async () => {
  await planningStore.fetch()
}
</script>

<style scoped>
.input-count {
  max-width: 47px;
}

.label-text {
  --tw-text-opacity: 1;
  color: rgb(17 24 39 / var(--tw-text-opacity));
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.bg-recurence {
  background-color: rgb(2 132 199 / var(--tw-bg-opacity));
  color: #fff;
}

.bg-none {
  background-color: #fff;
  color: #000;
}
</style>
