<template>
  <ModalBottom class="max-h-full overflow-auto" v-if="is_open && demande" @close="close">
    <template #title>
      <div class="flex w-full items-center justify-between header">
        <div class="modal-demande-title">
          <h2>{{ libelleOrganisme.toUpperCase() }}</h2>
          <h2>{{ getDateTitle() }}</h2>
          <h2>{{ demande.nbPersonnesAttendu }} pers. attendues</h2>
        </div>
        <div v-if="details.recurrence" class="modal-demande-subtitle mt-1">
          <h3>{{ messageRecurrence(details.recurrence) }}</h3>
        </div>
        <div>
          <Button
            couleur="tertiary" class="mr-4"
            :label=" commentairesVisibles ? 'Réduire les commentaires' : 'Afficher les commentaires'"
            @click="toggleCommentaires">
          </Button>
        </div>
        <div>
          <Button couleur="danger" borderless label="Rejeter" class="mr-4"  @click="rejeter(demande.demandeId)"/>
          <Button
            couleur="important"
            borderless
            label="Valider la demande"
            class="mr-6"
            @click="accepter(demande.demandeId)"
          />
        </div>
      </div>
    </template>
    
    <template #content>
      <div v-if="commentairesVisibles" class="content">
        <HeaderModal text-size="text-base uppercase" text="Commentaires"></HeaderModal>
        <div class="my-8" v-for="(commentaire, i) in demande.commentaires" :key="`com-` + i">
          <div class="font-semibold">{{ commentaire.userEmail }} {{ dateCommentaire(commentaire.date_creation) }}</div>
          <div class="font-extralight">{{ commentaire.texte }}</div>
        </div>
        <div class=" flex mt-3 mb-7">
          <Input @model-value="commentaire" @change="(event) => {commentaire = event.target.value}" class="w-2/3" label="Commentaire:" placeholder="Votre commentaire" border-radius="rounded-l-lg"><Button class="w-10" @click="ajouterCommentaire()" border-radius="rounded-r-lg" couleur="tertiary" icon="next" /></Input>
        </div>
      </div>
      <HeaderModal text-size="text-base uppercase" text="Liste des conflits" class="content"></HeaderModal>
      <Table :fullWidth="false" class="content" text-center :can-create="false" :columns="columns" :data="getTableData()">
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
    <ValidationModal type="edit">
      <template #titre>{{ confirmationTitres[confirmation] }}</template>
      {{ confirmationTextes[confirmation] }}
    </ValidationModal>
  </form>
</template>

<script setup lang="ts">
import Button from '@components/common/Button.vue'
import Input from "@components/common/Input.vue";
import ModalBottom from '@components/common/ModalBottom.vue'
import { frenchTodayDate, getDateDM, getDateDMY, getDateStringHour, weekDays } from '../../services/date_service'
import { ref, computed, defineExpose } from 'vue'
import type { FaTableColumnData, FaTableRow } from '@components/common/Table.vue'
import Table from '@components/common/Table.vue'
import { useMenuStore } from "@stores/menu";
import { useUserStore } from "@stores/user";
import { usePlanningStore } from '@stores/planning.ts'
import { accepterDemande, getDetailsDemande, postCommentaire, rejeterDemande } from "@api/creneau";
import { toast } from "vue3-toastify";
import ValidationModal from "@components/common/ValidationModal.vue";
import HeaderModal from "@components/common/HeaderModal.vue";

const planning = usePlanningStore()
const menu = useMenuStore()
const user = useUserStore()
const organismes: computed<[]> = computed(() => menu.getOrganismes())
const libelleOrganisme = computed(() => {
  const id = demande.value.organismeId
  return organismes.value.find(organisme => organisme.id === id)?.libelle ?? ''
})

const confirmation  = ref<false | 'refus' | 'validation'>(false)
const demandeId = ref<number|null>(null)
const today = ref('')

const is_open = ref(false)
const demande = ref<Creneau>()

type DetailsDemande = {
  organisme: string,
  date: string,
  zones: string,
  heureDebut: string,
  heureFin: string
  nbConflit: number,
  nbPersonnesAttendu: number
}
type Conflit = {
  organisme: string
  dateCreation: string
  zones: string
  horaire: string
  heureDebut: string
  heureFin: string
  nbConflit: number
  creneaux: string[]
  recurrence: Recurrence,
  nbPersonnesAttendu: number
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
  { label: 'Type de créneau', data: (e) => messageType(e) },
  { label: 'Nb pers. attendues', data: (e) => e.nbPersonnesAttendu },
  { label: 'Statut(s)', data: (e) => messageConflits(e.nbConflit) },
  { label: 'Action rapide' },
]

const getTableData = ():FaTableRow<Conflit>[] => conflits.value

defineExpose({ open, close, setDemande })

async function open() {
  details.value = await getDetailsDemande(demande.value.demandeId!)

  is_open.value = true
}

function close() {
  is_open.value = false
  commentairesVisibles.value = false
}

function getDateTitle() {
  if (!demande.value) return

  const french_date = frenchTodayDate(demande.value.dateDebut)
  const start = getDateStringHour(demande.value.dateDebut, 'H')
  const end = getDateStringHour(demande.value.dateSortie, 'H')
  today.value = `${french_date.dayNumber} ${french_date.month}`
  return `${french_date.weekday} ${french_date.dayNumber} ${french_date.month} - ${start} - ${end}`.toUpperCase()
}

/**
 * Résumé des récurrences du conflit
 * @param conflit
 */
const messageType = (conflit: Conflit): string => {
  let n: number, dateDebut: string, dateFin: string
 if (conflit.recurrence?.maxOccurrences) {
   n = conflit.recurrence.maxOccurrences
   dateDebut = getDateDM(conflit.heureDebut)
   dateFin = conflit.creneaux.sort((a, b) => a.dateSortie > b.dateSortie ? -1 : 1)[0]
 } else if (conflit.recurrence) {
   n = conflit.creneaux.length
   dateDebut = conflit.recurrence.dateDebut
   dateFin = conflit.recurrence.dateFin!
 } else {
   n = conflit.creneaux.length
   dateDebut = conflit.heureDebut
   dateFin = conflit.heureFin
 }

  return n > 1 ? n + ' occurrences du ' + getDateDM(dateDebut) + ' au ' + getDateDM(dateFin)
    : 'Créneau unique le ' + getDateDM(dateDebut)
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

const confirmerRefus = async (id) => {
  try {
    await rejeterDemande(id)
    await planning.fetch()
    toast.success('Demande rejetée')
    confirmation.value = false
  } catch(e) {
    toast.error('Erreur, Veuillez contacter votre administrateur')
  }
  is_open.value = false
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
  is_open.value = false
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

const messageRecurrence = (recurrence)  => {
  const { dateDebut, dateFin, separation, maxOccurrences, recurrenceJoursMois: joursMois, recurrenceJoursSemaine: joursSemaine, recurrenceType } = recurrence
  
  const limites = dateDebut && dateFin && `du ${getFrench(dateDebut)} au ${getFrench(dateFin)}` || false
  const occurrences =  !limites && maxOccurrences && `pendant ${maxOccurrences} fois` || false

  const type = recurrenceTypes[recurrenceType]

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
      frequence = joursSemaine && `tous les ${joursSemaine.map(j => weekDays[j]).join(', ')}` + (dernierJour ? ' et ' + dernierJour : '') || false
    }
  }

  const message = ['Récurrence',  limites ? limites : occurrences, frequence ].filter(el => el !== false)
  return message.join(' ')

  // details.value.recurrence && `Récurrence du ${frenchTodayDate(dateDebut)} au ${frenchTodayDate(dateFin)}` +
  //   `tous les ${separation + 1} jours`
  // 'Récurrence du vendredi 06 janvier au vendredi 06 décembre tous les 7 jours' && ''
}

const getFrench = (date = '', options: {year?: boolean, day?: boolean} = {year: false, day: true}) => {
  const frenchDate = frenchTodayDate(date)
  const {weekday, dayNumber, month, year} = frenchDate

  let french = `${weekday} ${dayNumber} ${month}`

  // if (options.day) {
  //   french = weekday + ' ' + french
  // }
  if (options.year) {
    french += (' ' + year)
  }

  return french
}

const commentairesVisibles = ref(false)
const commentaire = ref<string|null>(null)

const toggleCommentaires = () => { commentairesVisibles.value = !commentairesVisibles.value }

const heureMinute = (date: Date) => date.toLocaleTimeString('fr-FR').split(':').slice(0, -1).join(':')

const dateCommentaire = (date = ''): string =>
  getFrench(date, {year: true}) + ' à '
  + heureMinute(date && new Date(date) || new Date())

const ajouterCommentaire = async () => {

  if (commentaire.value === null || commentaire.value === '') {
    toast.error('Erreur, Veuillez remplir le champ commentaire')
  } else {
    try {
      await postCommentaire({commentaire: commentaire.value!}, demande.value.demandeId!)
      toast.success('Commentaire ajouté')

      demande.value.commentaires.push({
        texte: commentaire.value,
        userEmail: user.username,
        date_creation: ''
      })
      commentaire.value = ''
    } catch (e) {
      toast.error('Erreur, Veuillez contacter votre administrateur')
    }
  }
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

.modal-demande-title > h2:nth-child(2)::after {
  content: '';
  position: absolute;
  width: 1.5px;
  height: 100%;
  right: 150px;
  background-color: red;
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

.modal-demande-subtitle {
  position: absolute;
  left: 50px;
  top: 27px;
}

.modal-demande-subtitle h3 {
  font-size: 15px;
}

.content {
  margin-left: 50px;
  margin-right: 50px;
  width: calc(100% - 100px);
}
</style>
