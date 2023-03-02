<template>
  <Card>
    <h1>Sous-Espaces</h1>
    <span class="font-bold text-sm">Sous-Espaces : Ensemble de zone d'activité dont l'accès est contrôlé.</span>
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
        <tr class="bg-white" v-for="(esp, i) in subEspaces">
          <td class="flex justify-center items-center p-3">
            <Button test="TdeleteClient" borderless icon="delete" type="secondary" @click="removeEspace(i)"/>
            <Button test="TeditClient" borderless icon="edit" type="secondary" @click="editEspace(i)"/>
          </td>
          <td class="px-6 py-4">
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="true" class="sr-only peer" v-if="esp.actif" checked >
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
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
    <Button label="Ajouter un sous-espace" type="secondary" icon="add" @click="addEspace" id="TaddEspace"/>
  </Card>

  <form @submit.prevent="saveEspace">
    <Modal v-if="subEspace_modal" :type="readonly ? 'visualiser' : 'classic' " :title="readonly ? 'Information d\'un sous-espace' : 'Ajouter ou modifier un sous-espace'" @cancel="subEspace_modal = false, cancel()">
      <div class="flex items-center">
        <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Nom</label>
        <input :readonly="readonly" v-model="subEspace.libelle" id="TEspaceLibelle" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Ajouter un nom" required>
      </div>
      <div class="flex items-center">
        <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Espace</label>
        <select :readonly="readonly" v-if="espaceParents.length" v-model="espace_selected" id="TfaSelectEspace" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option v-for="espaceParent in espaceParents" :value="espaceParent.id">{{espaceParent.libelle}}</option>
        </select>
      </div>
      <div class="flex items-center">
        <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Ordre</label>
        <input :readonly="readonly" v-model="subEspace.ordre" id="TEspaceOrdre" type="number" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required>
      </div>
      <div class="flex items-center">
        <span class="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300">Actif : </span>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" value="true" class="sr-only peer" v-model="subEspace.actif" >
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
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
import {deleteZones, getZones, getZone,  postZones, updateZones} from "../../api/zone.js";
import {useRouter} from "vue-router";
import {getTypeZone} from "../../api/typeZone";

const props = defineProps(['id'])

const subEspace_modal = ref(false)
const readonly = ref(false)

const id_selected = ref(0)
const subEspaces = ref([])
const typeZones = ref([])
const subEspace = ref({})
const espaceParents = ref([])
let espace_selected = ref({})

const addEspace = () => {
  subEspace_modal.value = true
}

const removeEspace = async (i) => {
  const espaceTemp = subEspaces.value[i]
  await deleteZones(espaceTemp.id)
  cancel()
  subEspaces.value = await getZones(1, '&typeZone.code=sous-espace&fitArena=' + props.id)
  subEspace_modal.value = false
}

const editEspace = async (i) => {
  const espaceTemp = subEspaces.value[i]
  mapApiToData(espaceTemp)
  subEspace_modal.value = true
  readonly.value = false
}

const showEspace = async (i) => {
  const espaceTemp = subEspaces.value[i]
  mapApiToData(espaceTemp)
  subEspace_modal.value = true
  readonly.value = true
}

const mapApiToData = async (espaceTemp) => {
  const espaceParent = await getZone(espaceTemp.idZoneParent)
  espace_selected = espaceParent.id
  subEspace.value = espaceTemp
  id_selected.value = espaceTemp.id
  //Je cherche l'espace parent si il existe
}

const saveEspace = async () => {
  const espaceTemp = await getTypeZone(1, '&code=sous-espace')
  const espTemp = {
    typeZone: '/api/type_zones/' + espaceTemp[0].id,
    fitArena: '/api/fit_arenas/' + props.id,
    ordre: subEspace.value.ordre,
    libelle: subEspace.value.libelle,
    actif: subEspace.value.actif == true ? subEspace.value.actif : false ,
    idZoneParent: espace_selected.value
  }
  if (id_selected.value) {
    const {data} = await updateZones(espTemp, id_selected.value)
  } else {
    const {data} = await postZones(espTemp)
  }
  subEspace_modal.value = false
  cancel()
  subEspaces.value = await getZones(1, '&typeZone.code=sous-espace&fitArena=' + props.id)
  espaceParents.value = await getZones(1, '&typeZone.code=espace&fitArena=' + props.id)
  typeZones.value = await getTypeZone()
}

onMounted(async () => {
  subEspaces.value = await getZones(1, '&typeZone.code=sous-espace&fitArena=' + props.id)
  espaceParents.value = await getZones(1, '&typeZone.code=espace&fitArena=' + props.id)
  typeZones.value = await getTypeZone()
})

const cancel = () => {
  subEspace.value = {}

}

</script>
