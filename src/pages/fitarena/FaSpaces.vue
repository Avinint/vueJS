<template>
  <Card>
    <h1>Espaces</h1>
    <span class="font-bold text-sm">Espaces : Ensemble de sous espace dont l'accès est contrôlé.</span>
    <div class="relative overflow-x-auto">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3"></th>
          <th scope="col" class="px-6 py-3">Actif</th>
          <th scope="col" class="px-6 py-3">Libellé</th>
          <th scope="col" class="px-6 py-3">Ordre</th>
        </tr>
        </thead>
        <tbody>
        <tr class="bg-white" v-for="(esp, i) in espaces">
          <td class="flex justify-center items-center p-3">
            <Button test="TdeleteClient" borderless icon="delete" type="secondary" @click="removeEspace(i)"/>
            <Button test="TeditClient" borderless icon="edit" type="secondary" @click="editEspace(i)"/>
          </td>
          <td class="px-6 py-4">
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="true" class="sr-only peer" v-model="esp.actif" >
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-400"></div>
              <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
            </label>
          </td>
          <td class="px-6 py-4">{{ esp.libelle }}</td>
          <td class="px-6 py-4">{{ esp.ordre }}</td>
          <td class="px-6 py-4">
            <Button label="Détails" type="secondary" @click="showEspace(i)"/>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <Button label="Ajouter un espace" type="secondary" icon="add" @click="addEspace" id="TaddEspace"/>
  </Card>

  <form @submit.prevent="saveEspace">
    <Modal v-if="espace_modal" :type="readonly ? 'visualiser' : 'classic' " :title="readonly ? 'Information d\'un espace' : 'Ajouter ou modifier un espace'" @cancel="espace_modal = false" @confirm="saveEspace">
      <div class="flex items-center">
        <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Nom</label>
        <input :readonly="readonly" v-model="espace.libelle" id="TEspaceLibelle" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required>
      </div>
      <div class="flex items-center">
        <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Ordre</label>
        <input :readonly="readonly" v-model="espace.ordre" id="TEspaceOrdre" type="number" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required>
      </div>
      <div class="flex items-center">
        <span class="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300">Actif : </span>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" value="true" class="sr-only peer" v-model="espace.actif" >
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-400"></div>
          <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
        </label>
      </div>
    </Modal>
  </form>

</template>

<script setup>

import Card from '../../components/common/Card.vue'
import Modal from '../../components/common/Modal.vue'
import Button from '../../components/common/Button.vue'
import {onMounted, ref} from "vue";
import {deleteZones, getZones, postZones, updateZones} from "../../api/zone.js";
import {useRouter} from "vue-router";
import {getTypeZone} from "../../api/typeZone";

const props = defineProps(['id'])

const espace_modal = ref(false)
const readonly = ref(false)


const id_selected = ref(0)
const espaces = ref([])
const typeZones = ref([])
const espace = ref({})
const espace_selected = ref({})

const addEspace = () => {
  espace_modal.value = true
}

const removeEspace = async (i) => {
  const espaceTemp = espaces.value[i]
  await deleteZones(espaceTemp.id)
  cancel()
  espaces.value = await getZones('1', '&typeZone.code=espace&fitArena=' + props.id)
  espace_modal.value = false
}

const editEspace = (i) => {
  const espaceTemp = espaces.value[i]
  mapApiToData(espaceTemp)
  espace_modal.value = true
  readonly.value = false
}

const showEspace = async (i) => {
  const espaceTemp = espaces.value[i]
  mapApiToData(espaceTemp)
  espace_modal.value = true
  readonly.value = true
}

const mapApiToData = (espaceTemp) => {
  espace.value = espaceTemp
  id_selected.value = espaceTemp.id
}

const saveEspace = async () => {
  const espaceTemp = await getTypeZone(1, '&code=espace')
  const espTemp = {
    typeZone: '/api/type_zones/' + espaceTemp[0].id,
    fitArena: '/api/fit_arenas/' + props.id,
    ordre: espace.value.ordre,
    libelle: espace.value.libelle,
    actif: espace.value.actif == true ? espace.value.actif : false ,
  }
  if (id_selected.value) {
    const {data} = await updateZones(espTemp, id_selected.value)
  } else {
    const {data} = await postZones(espTemp)
  }
  espace_modal.value = false
  cancel()
  espaces.value = await getZones(1, '&typeZone.code=espace&fitArena=' + props.id)
  typeZones.value = await getTypeZone()
}
onMounted(async () => {
  espaces.value = await getZones(1, '&typeZone.code=espace&fitArena=' + props.id)
  typeZones.value = await getTypeZone()
})

const cancel = () => {
  espace.value = {}
}

</script>
