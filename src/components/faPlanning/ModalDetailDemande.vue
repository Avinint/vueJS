<template>
  <ModalBottom v-if="is_open && demande" @close="close">
    <template #title>
      <div class="flex w-full items-center justify-between header">
        <div class="modal-demande-title">
          <h2>{{ libelleOrganisme.toUpperCase() }}</h2>
          <h2>{{ getDateTitle() }}</h2>

        </div>
        <div v-if="details.recurrence" class=" modal-demande-subtitle">
          <h3>{{ messageRecurrence(details.recurrence) }}</h3>
        </div>
        <div>
          <Button couleur="danger" borderless label="Rejeter" class="mr-4"  @click="rejeter(demande.demandeId)"/>
          <Button
            couleur="secondary"
            borderless
            label="Valider la demande"
            class="mr-6"
            @click="accepter(demande.demandeId)"
          />
        </div>
      </div>

    </template>
    <template #content>
      <Table text-center :can-create="false" :columns="columns" :data="getTableData()">
        <template #col-0="{ item }">
          <div class="flex ">
            <div class="flex-grow-0 px-5 py-2 m-auto bg-blue-500 text-white rounded-md">{{ item.organisme }}</div>
          </div>

        </template>
        <template #col-6="{ item }">
          <Button @click="rejeter(item.idDemande)" class="mr-4" couleur="danger" icon="cross"></Button>
        </template>
      </Table>
    </template>
  </ModalBottom>
  <form v-if="confirmation" @submit.prevent="confirmationCallbacks[confirmation](demandeId)">
    <ValidationModal  type="edit">
      <template #titre>{{ confirmationTitres[confirmation] }}</template>
      {{ confirmationTextes[confirmation] }}
    </ValidationModal>
  </form>
</template>

<script setup lang="ts">
import Button from '@components/common/Button.vue'
import ModalBottom from '@components/common/ModalBottom.vue'
import {frenchTodayDate, getDateDM, getDateDMY, getDateStringHour, weekDays} from '../../services/date_service'
import {ref, computed, watch} from 'vue'
import type {
  FaTableColumnData,
  FaTableRow,
} from '@components/common/Table.vue'
import Table from '@components/common/Table.vue'
import {useMenuStore} from "@stores/menu";
import { usePlanningStore } from '@stores/planning.ts'
import {accepterDemande, getDetailsDemande, rejeterDemande} from "@api/creneau";
import {match} from "cypress/types/minimatch";
import {toast} from "vue3-toastify";
import ValidationModal from "@components/common/ValidationModal.vue";

const planning = usePlanningStore()
const menu = useMenuStore()
const organismes: computed<[]> = computed(() => menu.getOrganismes())
const libelleOrganisme = computed(() => {
  const id = demande.value.organismeId
  return organismes.value.find(organisme => organisme.id === id)?.libelle ?? ''
})

const confirmation  = ref<false | 'refus' | 'validation'>(false)
const demandeId = ref(null)


const is_open = ref(false)
const demande = ref<Creneau>()

type DetailsDemande = {
  organisme: string,
  date: string,
  zones: string,
  heureDebut: string,
  heureFin: string
  nbConflit: number
}
type Conflit = {
  organisme: string
  dateCreation: string
  zones: string
  horaire: string
  nbConflit: number
  creneaux: string[]
  recurrence: Recurrence
}

const recurrenceTypes = { 1: 'journalier', 2: 'hebdomadaire', 3: 'mensuel' }

const details = ref<DetailsDemande[]>()
const conflits = computed<FaTableRow<Conflit>[]>(() =>
 details.value.demandesConflit?.map(conflit => ({ id: conflit.idDemande, editable: false, removable: false,
   data:
     {
       ...conflit,
       zones: conflit.zones.map(z => z.libelle).join(', '),
       horaire: getDateStringHour(conflit.heureDebut, 'H') + ' - ' + getDateStringHour(conflit.heureFin, 'H'),
     }
  })
))

const columns: FaTableColumnData<Conflit>[] = [
  { label: 'Demandeur' },
  { label: 'Date de demande', data: (e) => getDateDMY(e.dateCreation) },
  { label: 'Zones', data: (e) => e.zones },
  { label: 'Horaire', data: (e) => e.horaire },
  { label: 'Type de créneau', data: (e) => messageType(e)},
  { label: 'Statut(s)', data: (e) => messageConflits(e.nbConflit) },
  { label: 'Action rapide' },
]

const getTableData = ():FaTableRow<Conflit>[] => conflits.value

defineExpose({ open, close, setDemande })

async function open() {
  details.value = await getDetailsDemande(demande.value.demandeId!)

  console.log(details.value)
  is_open.value = true
}

function close() {
  is_open.value = false
}

function getDateTitle() {
  if (!demande.value) return

  const french_date = frenchTodayDate(demande.value.dateDebut)
  const start = getDateStringHour(demande.value.dateDebut, 'H')
  const end = getDateStringHour(demande.value.dateSortie, 'H')
  return `${french_date.weekday} ${french_date.dayNumber} ${french_date.month} - ${start} - ${end}`.toUpperCase()
}

const messageType = (conflit) => {
  const n = conflit.creneaux.length
  return n > 1 ? n + ' occurrences du ' + getDateDM(conflit.recurrence.dateDebut) + ' au '  + getDateDM(conflit.recurrence.dateFin )
    : 'Créneau unique le ' + getDateDM(conflit.recurrence.dateDebut)
}

const messageConflits = (n) => {
  if (n > 0) {
    return `${n} conflit${n > 1 && 's' || '' } de récurrence`
  } else {
    return "Aucun conflit détecté"
  }
}

const rejeter = async (id)  => {
  confirmation.value = 'refus'
  demandeId.value = id

}

const accepter = async (id)  => {
  confirmation.value = 'validation'
  demandeId.value = id
}

const confirmerRefus= async (id) => {
  try {
    await rejeterDemande(id)
    await planning.fetch()
    toast.success('Demande rejetée')
    confirmation.value = false
  } catch(e) {
    toast.error('Erreur, Veuillez contacter votre administrateur')
  }
}

const confirmerValidation = async (id) => {
  try {
    await accepterDemande(id)
    await planning.fetch()
    toast.success('Demande acceptée')
    confirmation.value = false
  } catch(e) {
    toast.error('Erreur, Veuillez contacter votre administrateur')
  }
}

const confirmationCallbacks = {
  refus: confirmerRefus,
  validation: confirmerValidation,
}

const confirmationTitres = {
  refus: "Rejet de demande",
  validation: "Validation de demande"
}
const confirmationTextes = {
  refus: "Voulez-vous confirmer le rejet de cette demande ?",
  validation: "Voulez-vous confirmer la validation de cette demande ?"
}

const getFrench = (date) => {
  const {weekday, dayNumber, month} = frenchTodayDate(date)
  return `${weekday} ${dayNumber} ${month}`
}

const messageRecurrence = (recurrence)  => {
  const { dateDebut, dateFin, separation, maxOccurrences, recurrenceJoursMois: joursMois, recurrenceJoursSemaine: joursSemaine, recurrenceType } = recurrence

  const limites = dateDebut && dateFin && `du ${getFrench(dateDebut)} au ${getFrench(dateFin)}` || false
  const occurrences =  !limites && maxOccurrences && `pendant ${maxOccurrences} fois` || false

  const type = recurrenceTypes[recurrenceType]

  console.log(type, joursSemaine)
  console.log(joursMois)

  let unites: string|boolean = false
  let frequence: string|boolean = false
  if (type === 'journalier') {


    unites = 'jours'
    frequence = separation  ? `tous les ${separation} jours` : 'tous les jours'

  } else {
    if (type === 'mensuel') {
      const dernierJoursMois = joursMois && joursMois.length > 1 && joursMois.pop() || false
      unites = 'du mois'
      const joursDuMois = joursMois && `tous les ${joursSemaine.map(j => weekDays[j]).join(', ')}` + (dernierJoursMois ? ' et ' + dernierJoursMois : '') || false
      frequence = joursDuMois + separation ? `tous les ${separation} mois ` : 'tous les mois'
    } else if (type === 'hebdomadaire') {
      const dernierJour = joursSemaine.length > 1 && joursSemaine.pop() || false
      j
      frequence = joursSemaine && `tous les ${joursSemaine.map(j => weekDays[j]).join(', ')}` + (dernierJour ? ' et ' + dernierJour : '') || false
    }
  }

  const message = ['Récurrence',  limites ? limites : occurrences, frequence ].filter(el => el !== false)
  return message.join(' ')

  // details.value.recurrence && `Récurrence du ${frenchTodayDate(dateDebut)} au ${frenchTodayDate(dateFin)}` +
  //   `tous les ${separation + 1} jours`
  // 'Récurrence du vendredi 06 janvier au vendredi 06 décembre tous les 7 jours' && ''
}

function setDemande(value: Creneau) {
  demande.value = value
}
</script>

<style scoped>
.modal-demande-title {
  position: relative;
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 20px;
  margin-left: 50px;
}

.modal-demande-title :nth-child(1) {
  position: relative;
}

.modal-demande-title h2 {
  font-size: 18px;
}

.modal-demande-title :nth-child(1)::before {
  content: '';
  position: absolute;
  width: 1.5px;
  height: 100%;
  right: -10px;
  background-color: red;
}

.modal-demande-title::before {
  content: '';
  position: absolute;
  left: calc(0px - 50px);
  top: 50%;
  background-color: red;
  width: 40px;
  height: 1.5px;
}

.header {
  position: relative;
}

.modal-demande-subtitle{
  position: absolute;
  left:  50px;

  top: 27px;

}

.modal-demande-subtitle h3{
  font-size: 15px;
}



</style>
