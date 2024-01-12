<template>
  <Spinner v-if="spinner" />

  <CrudList
    v-if="!spinner"
    entity="demandes"
    plural="liste des demandes"
    :columns="colonnesDemandes"
    :data="getTableData()"
    :can-filter="true"
  >
    <template #recherche>
      <RechercheDemande @chargement-liste="fetchDonnees" />
    </template>
  </CrudList>
</template>

<script setup lang="ts">
import CrudList from "@components/molecules/CrudList.vue";

import { onMounted, ref, watch, defineProps } from "vue";
import dayjs from 'dayjs'

import Spinner from '@/components/common/Spinner.vue'
import RechercheDemande from "@components/molecules/RechercheDemande.vue";
import { getDemandes } from "@api/demande";

const props = defineProps(['id'])

const colonnesDemandes = [
  { data: (e): string => e.demandeur, label: 'Demandeur' },
  { data: (e): string => e.dateDemande, label: 'Date de demande' },
  { data: (e): string => e.zones.length ? e.zones.join(' - ') : '', label: 'Zones', size: 'w-1/3' },
  { data: (e): string => e.horaire, label: 'Horaire' },
  { data: (e): string => e.type, label: 'Type de créneau' },
  { data: (e): string => e.nbPersonnesAttendu, label: 'Nb pers. attendues' },
  { data: (e): string => e.conflits, label: 'Conflits' },
  { data: (e): string => e.statut, label: 'Statut' }
]

const spinner = ref(false)
const demandes = ref([])

onMounted(async () => {
  spinner.value = true
  await fetchDonnees()
  spinner.value = false
})

watch(() => props.id, () => fetchDonnees())

const fetchDonnees = async(params = {}) => {
  demandes.value = await getDemandes({ idFitArena: props.id, page: 1, ...params })
}

function getTableData() {
  return demandes.value.map((dmd: any) => {
    return {
      id: dmd.id,
      data: dmd,
      editable: false,
      removable: false,
      readable: false
    }
  })
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
