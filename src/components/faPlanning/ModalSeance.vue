<template>
  <ModalBottom @close="open = false" v-if="open">
    <template #title>
      <div class="flex w-full items-center justify-between">
        <div class="modal-seance-title">
          <h2>{{ creneau_store.titre }}</h2>
          <h2>{{ creneau_store.heureDebut }} - {{ creneau_store.heureFin }}</h2>
        </div>
        <Button
          couleur="danger"
          borderless
          label="Ajouter une séance"
          @click="new_seance"
          class="mr-4"
        />
      </div>
    </template>
    <template #content>
      <div class="relative">
        <Table
          :columns="table_columns"
          :data="getTableData()"
          editable
          removable
          @entity:edit="modify_seance"
          @entity:remove="delete_seance"
        >
          <template #col-3="{item}" 
            ><Button
              v-if="item.type === 'animateur'"
              class="text-sm"
              label="Voir le QR Code"
              couleur="secondary"
              @click="show_qrcode(item)"
          />
        </template>
        </Table>
      </div>
    </template>
  </ModalBottom>
  <EditSeance ref="edit_seance" :mode="edit_mode" :groupes="groupes"/>
  <ModalQRCode ref="modal_qrcode"/>
</template>

<script setup lang="ts">
import ModalBottom from '@components/common/ModalBottom.vue'
import EditSeance from '@components/faPlanning/EditSeance.vue'
import Button from '@components/common/Button.vue'
import { onMounted, ref } from 'vue'
import { getDateStringHour } from '../../services/date_service'
import { useCreneauStore } from '@stores/creneau'
import { useSeanceStore } from '@stores/seance'
import { useRoute } from 'vue-router'
import CrudList from '@components/molecules/CrudList.vue'
import type { FaTableColumnData, FaTableRow } from '@components/common/Table.vue'
import { getAnimateurs } from '@api/animateur'
import Table from '@components/common/Table.vue'
import ModalQRCode from './ModalQRCode.vue'
import { fetchGroupes } from '@api/groupe'

defineExpose({ open_modal, close_modal })

const table_columns: FaTableColumnData<Seance>[] = [
  { label: 'Horaire', data: (e: Seance) => getSeanceHours(e) },
  { label: 'Animateur(s)', data: (e: Seance) => getSeanceAnimateurs(e) },
  { label: 'Groupe(s)', data: (e: Seance) => e.groupes.map(groupe => groupe.libelle).join(', ') },
  { label: 'QR Code de séance' },
]

const edit_mode = ref<'create' | 'edit'>('create')
const edit_seance = ref<InstanceType<typeof EditSeance>>()
const modal_qrcode = ref<InstanceType<typeof ModalQRCode>>()
const open = ref(false)
const creneau_store = useCreneauStore()
const seance_store = useSeanceStore()
const groupes = ref<Groupe[]>([]);
const route = useRoute()

onMounted(async () => {
  const id_organisme = parseInt(route.params.org_id as any);
  groupes.value = await fetchGroupes(id_organisme)
})

function getTableData(): FaTableRow<Seance>[] {
  return creneau_store.seances.map(seance => {
    return {
      id: seance.id,
      data: seance,
      editable: seance.type === 'animateur',
      removable: seance.type === 'animateur',
    }
  });
}

function show_qrcode(seance: Seance) {
  if(modal_qrcode.value) {
    modal_qrcode.value.setSeance(seance);
    modal_qrcode.value.open();
  }
}

function new_seance() {
  if (edit_seance.value) {
    edit_mode.value = 'create'
    seance_store.setDefault()
    seance_store.data.dateHeureDebut = creneau_store.heureDebut
    seance_store.data.dateHeureFin = creneau_store.heureFin
    edit_seance.value.open_panel()
  }
}

function modify_seance(seance: Seance) {
  if (edit_seance.value) {
    edit_mode.value = 'edit'
    seance_store.load(seance)
    edit_seance.value.open_panel()
  }
}

function delete_seance(seance: Seance) {
  if (confirm('Souhaitez vous supprimer la séance ?')) {
    seance_store.load(seance)
    seance_store.delete()
  }
}

function open_modal() {
  open.value = true
  creneau_store.fetchSeances()
  seance_store.fetchAnimateurs(route.params.id_org as any)
  seance_store.groupes = groupes.value;
}

function close_modal() {
  open.value = false
}

function getSeanceHours(seance: Seance): string {
  return `${getDateStringHour(seance.dateHeureDebut)} - ${getDateStringHour(
    seance.dateHeureFin
  )}`
}

function getSeanceAnimateurs(seance: Seance): string {
  if (seance.animateurs.length == 0) return 'Aucun'
  return seance.animateurs.map((a) => `${a.nom} ${a.prenom}`).join(', ')
}
</script>

<style scoped>
.modal-seance-title {
  position: relative;
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 20px;
  margin-left: 50px;
}

.modal-seance-title :nth-child(1) {
  position: relative;
}
.modal-seance-title h2 {
  font-size: 18px;
}

.modal-seance-title :nth-child(1)::before {
  content: '';
  position: absolute;
  width: 1.5px;
  height: 100%;
  right: -10px;
  background-color: red;
}

.modal-seance-title::before {
  content: '';
  position: absolute;
  left: calc(0px - 50px);
  top: 50%;
  background-color: red;
  width: 40px;
  height: 1.5px;
}
</style>
