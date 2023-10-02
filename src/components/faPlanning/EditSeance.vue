<template>
  <ModalBottom ref="container" @close="close_panel" v-if="is_open">
    <template #title>
      <h3 class="ml-4 text-xl text-red-600">
        {{ mode == 'create' ? 'NOUVELLE SÉANCE' : 'MODIFIER LA SÉANCE' }}
      </h3>
    </template>
    <template #content>
      <BorderContainer>
        <LabelText text="Plage horaire de la séance" />
        <TimeRange
          class="mb-8"
          v-model:start_time="seance_store.data.dateHeureDebut"
          v-model:end_time="seance_store.data.dateHeureFin"
        />
        <LabelText text="Ajouter des groupe(s) à la séance" />
        <Table :data="getGroupesTableData()" :columns="groupes_column_data" class="mb-8">
          <template #col-0="{ index }">
            <Switch v-model="seance_store.selected_groupes[index]"/>
          </template>
        </Table>
        <ListAnimateurs label="Ajouter des animateur(s) à la séance"/>
        <div class="flex justify-end">
          <Button
            @click="close_panel"
            couleur="secondary"
            label="Annuler"
            class="mr-4"
          />
          <Button couleur="danger" label="Valider" @click="validate" />
        </div>
      </BorderContainer>
    </template>
  </ModalBottom>
</template>

<script setup lang="ts">
import Button from '@components/common/Button.vue'
import Switch from '@components/common/Switch.vue'
import { useSeanceStore } from '@stores/seance'
import { onMounted, ref } from 'vue'
import ListAnimateurs from './ListAnimateurs.vue'
import ModalBottom from '@components/common/ModalBottom.vue'
import BorderContainer from '@components/common/BorderContainer.vue'
import LabelText from '@components/common/LabelText.vue'
import Table, {
  type FaTableColumnData,
  type FaTableRow,
} from '@components/common/Table.vue'
import TimeRange from '@components/molecules/TimeRange.vue'
import { useCreneauStore } from '@stores/creneau'

const props = defineProps<{
  mode: 'edit' | 'create'
  groupes: Groupe[]
}>()

const container = ref<HTMLElement>()
const is_open = ref(false)
const seance_store = useSeanceStore()
const creneau_store = useCreneauStore()
defineExpose({ open_panel, close_panel })

const groupes_column_data: FaTableColumnData<Groupe>[] = [
  { label: 'Statut' },
  { label: 'Libelle', data: (e: Groupe) => e.libelle },
]

async function validate() {
  if (props.mode === 'create') {
    is_open.value = false
    await seance_store.post()
  } else if (props.mode === 'edit') {
    is_open.value = false
    await seance_store.put()
    creneau_store.fetchSeances()
  }
}

function getGroupesTableData(): FaTableRow<Groupe>[] {
  return props.groupes.map(groupe => {
    return {
      id: groupe.id,
      data: groupe,
      removable: false,
      editable: false,
    }
  })
}

function open_panel() {
  is_open.value = true
  if (container.value) container.value.scrollTop = 0
}

function close_panel() {
  is_open.value = false
}
</script>

<style scoped>
.seance-edit {
  overflow: scroll;
}

.seance-edit-closed {
  max-height: 0;
  border: 1px transparent;
  padding: 0;
  transition: 1s cubic-bezier(0.19, 1, 0.22, 1);
}
.seance-edit-open {
  max-height: calc(100vh - 400px);
  transition: 1s cubic-bezier(0.19, 1, 0.22, 1);
}

.label-text {
  position: relative;
  font-size: 16px;
  text-transform: uppercase;
  color: #161616;
  display: block;
  margin-bottom: 16px;
}
.label-text::before {
  content: '';
  position: absolute;
  background-color: #de001a;
  width: 20px;
  height: 1px;
  left: -30px;
  top: 50%;
}
</style>
