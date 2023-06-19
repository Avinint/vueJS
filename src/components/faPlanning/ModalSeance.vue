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
        />
      </div>
    </template>
    <template #content>
      <div class="relative">
        <table
          class="w-full text-left text-sm text-gray-500 dark:text-gray-400"
        >
          <thead
            class="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-100 dark:text-gray-700"
          >
            <tr>
              <th scope="col" class="px-6 py-3">Horaire</th>
              <th scope="col" class="px-6 py-3">Animateur(s)</th>
              <th scope="col" class="px-6 py-3">Groupe(s)</th>
              <th scope="col" class="px-6 py-3">QR code de séance</th>
              <th scope="col" class="px-6 py-3">Modifier la séance</th>
              <th scope="col" class="px-6 py-3">Supprimer la séance</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(seance, i) in creneau_store.seances"
              :key="i"
              class="bg-white"
            >
              <td class="px-6 py-4">{{ getSeanceHours(seance) }}</td>
              <td class="px-6 py-4">{{ getSeanceAnimateurs(seance) }}</td>
              <td class="px-6 py-4">Aucun</td>
              <td class="px-6 py-4">QR CODE</td>
              <td class="px-6 py-4">
                <Button
                  v-if="seance.type === 'animateur'"
                  label="MODIFIER"
                  couleur="secondary"
                  @click="modify_seance(seance)"
                />
              </td>
              <td class="px-6 py-4">
                <Button
                  v-if="seance.type === 'animateur'"
                  @click="delete_seance(seance)"
                  couleur="danger"
                  borderless
                  icon="delete"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <EditSeance ref="edit_seance" :mode="edit_mode" />
    </template>
  </ModalBottom>
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

defineExpose({ open_modal, close_modal })

const edit_mode = ref<'create' | 'edit'>('create')
const edit_seance = ref<InstanceType<typeof EditSeance>>()
const open = ref(false)
const creneau_store = useCreneauStore()
const seance_store = useSeanceStore()
const route = useRoute()

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
  if(confirm("Souhaitez vous supprimer la séance ?")) {
    seance_store.load(seance);
    seance_store.delete();
  }
}

function open_modal() {
  open.value = true
  creneau_store.fetchSeances()
  seance_store.fetchAnimateurs(route.params.id_org as any)
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
