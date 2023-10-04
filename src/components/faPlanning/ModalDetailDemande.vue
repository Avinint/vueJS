<template>
  <ModalBottom v-if="is_open && demande" @close="close">
    <template #title>
      <div class="flex w-full items-center justify-between">
        <div class="modal-demande-title">
          <h2>{{ libelleOrganisme.toUpperCase() }}</h2>
          <h2>{{ getDateTitle() }}</h2>
        </div>
        <div>
          <Button couleur="danger" borderless label="Rejeter" class="mr-4" />
          <Button
            couleur="secondary"
            borderless
            label="Valider la demande"
            class="mr-6"
          />
        </div>
      </div>
    </template>
    <template #content>
      <Table :can-create="false" :columns="columns" :data="MOCK_DATA">
        <template #col-0="{ item }">
          <Button :label="item.organisme"></Button>
        </template>
        <template #col-6="{ item }">
          <Button couleur="danger"></Button>
        </template>
      </Table>
    </template>
  </ModalBottom>
</template>

<script setup lang="ts">
import Button from '@components/common/Button.vue'
import ModalBottom from '@components/common/ModalBottom.vue'
import { frenchTodayDate, getDateStringHour } from '../../services/date_service'
import { ref, computed } from 'vue'
import type {
  FaTableColumnData,
  FaTableRow,
} from '@components/common/Table.vue'
import Table from '@components/common/Table.vue'
import {useMenuStore} from "@stores/menu";
import {getDetailsDemande} from "@api/creneau";


const menu = useMenuStore()
const organismes = computed(() => menu.getOrganismes())
const libelleOrganisme = computed(() => {
  const id = demande.value.organismeId
  return organismes.value.find(organisme => organisme.id === id)?.libelle ?? ''
})

const is_open = ref(false)
const demande = ref<Creneau>()

type DEMANDE = {
  organisme: string,
  date: string,
  zones: string,
  heureDebut: string,
  heureFin: string

  nbConflit: number
}
type Conflit = {}

const details = ref([])
const conflits = computed(() => ({
  id: 0,
  editable: false,
  removable: false,
  data: details.value.demandesConflit?.map(conflit => ({
    ...conflit,
    zones: conflit.zones.join(', '),
    horaire: getDateStringHour(conflit.heureDebut, 'H') + ' - ' + getDateStringHour(conflit.heureFin, 'H')
  }))
})
)


const columns: FaTableColumnData<DEMANDE>[] = [
  { label: 'Demandeur', data: (e) => e.organisme },
  { label: 'Date de demande', data: (e) => e.date },
  { label: 'Zones', data: (e) => e.zones },
  { label: 'Horaire', data: (e) => e.horaire },
  // { label: 'Type de créneau', data: (e) => e.type },
  { label: 'Statut(s)', data: (e) => e.statut },
  { label: 'Action rapide' },
]

const MOCK_DATA: FaTableRow<Conflit>[] = [
  {
    id: 0,
    data: conflits.value,
    editable: false,
    removable: false,
  },
]

defineExpose({ open, close, setDemande })

async function open() {
  details.value = await getDetailsDemande(demande.value.demandeId!)
  is_open.value = true

  console.log(libelleOrganisme.value)
  console.log(conflits.value)
  console.log(MOCK_DATA)
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
</style>
