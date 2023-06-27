<template>
  <LabelText v-if="label" :text="label" />
  <Table :columns="column_data" :data="getTableData()">
    <template #col-0="{ index }">
      <Switch v-model="seance_store.selected_animateurs[index]" />
    </template>
  </Table>
</template>

<script setup lang="ts">
import LabelText from '@components/common/LabelText.vue'
import Switch from '@components/common/Switch.vue'
import Table, {
  type FaTableColumnData,
  type FaTableRow,
} from '@components/common/Table.vue'
import { useSeanceStore } from '@stores/seance'
import { ref } from 'vue'

defineProps({
  label: {
    type: String,
    required: true,
  }
})

const column_data: FaTableColumnData<Animateur>[] = [
  { label: 'Statut' },
  { label: 'Nom', data: (e: Animateur) => e.nom },
  { label: 'Prénom', data: (e: Animateur) => e.prenom },
  { label: 'Numéro de téléphone', data: (e: Animateur) => e.telephone },
  { label: 'Adresse email', data: (e: Animateur) => e.email },
]

function getTableData(): FaTableRow<Animateur>[] {
  return seance_store.getAnimateurs.map((animateur) => {
    return {
      data: animateur,
      editable: false,
      removable: false,
    }
  })
}

const seance_store = useSeanceStore()
</script>
