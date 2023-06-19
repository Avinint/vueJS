<template>
  <div
    ref="container"
    class="seance-edit rounded border p-6"
    :class="[is_open ? 'seance-edit-open' : 'seance-edit-closed']"
  >
    <h3 class="mb-2 text-lg text-red-600">NOUVELLE SÉANCE</h3>
    <div class="mb-8">
      <label class="label-text"> Plage horaire de la seance </label>
      <div class="flex">
        <select
          v-model="seance_store.data.dateHeureDebut"
          required
          class="h-10 w-40 rounded-lg border border-gray-300 bg-gray-50 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        >
          <option
            v-for="(creneauHoraire, i) in listStart()"
            :key="i"
            :value="creneauHoraire"
          >
            {{ creneauHoraire }}
          </option>
        </select>
        <div class="px-4 py-2">à</div>
        <select
          v-model="seance_store.data.dateHeureFin"
          required
          class="h-10 w-40 rounded-lg border border-gray-300 bg-gray-50 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        >
          <option
            v-for="(creneauHoraire, i) in listEnd()"
            :key="i"
            :value="creneauHoraire"
          >
            {{ creneauHoraire }}
          </option>
        </select>
      </div>
    </div>
    <div class="mb-8">
      <label class="label-text">Ajouter des groupe(s) à la séance</label>
      <table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead
          class="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-100 dark:text-gray-700"
        >
          <tr>
            <th scope="col" class="px-6 py-3">Statut</th>
            <th scope="col" class="px-6 py-3">Groupe</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(groupe, i) in groupes" :key="i" class="bg-white">
            <td class="px-6 py-4"><Switch/></td>
            <td class="px-6 py-4">{{ groupe.name }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <ListAnimateurs class="mb-8"/>
    <div class="flex justify-end">
      <Button @click="close_panel" couleur="secondary" label="Annuler" />
      <Button couleur="danger" label="Valider" @click="validate" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@components/common/Button.vue'
import Switch from '@components/common/Switch.vue';
import { useSeanceStore } from '@stores/seance';
import { ref } from 'vue'
import ListAnimateurs from './ListAnimateurs.vue';

const props = defineProps<{
  mode: 'edit' | 'create'
}>()

const container = ref<HTMLElement>();
const is_open = ref(false)
const seance_store = useSeanceStore();
defineExpose({ open_panel, close_panel })

const groupes = [
  { status: true, name: 'U10' },
]

async function validate() {
  if(props.mode === 'create') {
    is_open.value = false;
    await seance_store.post();
  } else if(props.mode === 'edit') {
    is_open.value = false;
    await seance_store.put();
  }
}

function open_panel() {
  is_open.value = true
  if(container.value)
    container.value.scrollTop = 0;
}

function close_panel() {
  is_open.value = false
}

function listStart() {
  let list = []
  for (let i = 0; i < 21; i++) {
    for (let y = 0; y < 59; y += 5) {
      const hours = i.toString().length === 1 ? '0' + i : i
      const minutes = y.toString().length === 1 ? '0' + y : y
      list.push(hours + ':' + minutes)
    }
  }
  return list
}

function listEnd() {
  let list = []
  for (let i = 0; i < 21; i++) {
    for (let y = 0; y < 59; y += 5) {
      const hours = i.toString().length === 1 ? '0' + i : i
      const minutes = y.toString().length === 1 ? '0' + y : y
      list.push(hours + ':' + minutes)
    }
  }
  return list
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
  content: "";
  position: absolute;
  background-color: #DE001A;
  width: 20px;
  height: 1px;
  left: -30px;
  top: 50%;
}
</style>
