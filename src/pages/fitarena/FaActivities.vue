<template>
  <Card class="space-y-3">
    <h1>Activités pratiquables dans la fit arena</h1>

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
        <tr class="bg-white" v-for="(act, i) in activites" :key="i">
          <td class="flex justify-center items-center p-3">
            <Button test="TdeleteClient" borderless icon="delete" type="secondary" @click="removeActivite(i)"/>
            <Button test="TeditClient" borderless icon="edit" type="secondary" @click="editActivite(i)"/>
          </td>
          <td class="px-6 py-4">
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="true" class="sr-only peer" v-model="act.actif" @change="modifieActivite(act)" >
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-400"></div>
              <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
            </label>
          </td>
          <td class="px-6 py-4">{{ act.libelle }}</td>

          <td class="px-6 py-4">{{ act.ordre }}</td>
          <td class="px-6 py-4">
            <Button label="Détails" type="secondary" @click="showActivite(i)"/>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <Button label="Ajouter une activité" icon="add" type="secondary" @click="addActivite" id="TaddActivite"/>
  </Card>
  <form @submit.prevent="saveActivite">
    <Modal v-if="activite_modal" :type="readonly ? 'visualiser' : 'classic'" :title="modal_title" @cancel="activite_modal = false">
      <div class="flex items-center">
        <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Type d'activité</label>
        <select v-if="typeActivites.length" v-model="activite_selected" id="TTypeActivite" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option v-for="(typeActivite, i) in typeActivites" :key="i" :value="typeActivite.id">{{typeActivite.libelle}}</option>
        </select>
      </div>
      <div class="flex items-center">
        <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Nom</label>
        <input :readonly="readonly" v-model="activite.libelle" id="TActiviteLibelle" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required>
      </div>
      <div class="flex items-center">
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white pr-3" for="small_size">Icône</label>
        <input class="block w-full mb-5 text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="small_size" type="file">
      </div>
      <div class="flex items-center">
        <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Description</label>
        <textarea :readonly="readonly" v-model="activite.description" id="TActiviteDescription" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required></textarea>
      </div>
      <div class="flex items-center">
        <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Ordre</label>
        <input :readonly="readonly" v-model="activite.ordre" id="TActiviteOrdre" type="number" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required>
      </div>
      <div class="flex items-center">
        <span class="text-sm font-medium text-gray-900 dark:text-gray-300 w-1/2">Actif : </span>
        <label class="relative inline-flex items-center cursor-pointer w-full">
          <input type="checkbox" value="true" class="sr-only peer" v-model="activite.actif">
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-400"></div>
          <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
        </label>
      </div>
      <div class="flex items-center">
        <span class="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300">Réservation individuelle</span>
        <label  class="relative inline-flex items-center cursor-pointer">
          <input v-model="activite.reservationDeGroupe" type="checkbox" value="" class="sr-only peer">
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-400"></div>
        </label>
        <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Réservation de groupe</span>
      </div>
  </Modal>
  </form>
</template>

<script setup>

import Card from '../../components/common/Card.vue'
import Modal from '../../components/common/Modal.vue'
import Button from '../../components/common/Button.vue'
import {onMounted, ref} from "vue";
import {getTypeActivites} from "../../api/typeActivite.js";
import {
  deleteActivites,
  getActivites,
  postActivites,
  updateActivites,
  postActiviteWithIcone,
  patchActivites
} from "../../api/activite.js";
import {useRouter} from "vue-router";
import {getClients, postClient, updateClient} from "../../api/client";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const props = defineProps(['id'])
const notify = () => {
  toast("Wow so easy !", {
    autoClose: 1000,
  }); // ToastOptions
}

const activite_modal = ref(false)
const readonly = ref(false)

const id_selected = ref(0)
const activites = ref([])
const typeActivites = ref([])
const typeActivite = ref({})
const activite = ref({})
const activite_selected = ref({})
const modal_title = ref('')

const addActivite = () => {
  activite.value = {}
  activite_selected.value = {}
  activite_modal.value = true
  modal_title.value = 'Ajouter une activité'
}

const modifieActivite = async({actif,id}) => {
  try {
    await patchActivites({actif}, id)
    toast.success('Modification de l\'activité avec succès');
  } catch (e) {
    toast.error('Erreur, Veuillez contacter votre administrateur');
  }
}

const removeActivite = async (i) => {
  const activiteTemp = activites.value[i]
  try {
    await deleteActivites(activiteTemp.id)
    toast.success('Suppression de l\'activité avec succès');
  } catch (e) {
    toast.error('Erreur, Veuillez contacter votre administrateur');
  }
  cancel()
  activites.value = await getActivites(props.id)
  typeActivites.value = await getTypeActivites()
  activite_modal.value = false
}

const editActivite = (i) => {
  const activite = activites.value[i]
  mapApiToData(activite)
  activite_modal.value = true
  readonly.value = false
  modal_title.value = 'Modifier une activité'
}

const showActivite = async (i) => {
  const activiteTemp = activites.value[i]
  mapApiToData(activiteTemp)
  activite_modal.value = true
  readonly.value = true
  modal_title.value = 'Consulter une activité'
}

const mapApiToData = (activiteTemp) => {
  activite.value = activiteTemp
  id_selected.value = activiteTemp.id
  activite_selected.value = activiteTemp.typeActivite.id
}

const saveActivite = async () => {
  const actTemp = {
    typeActivite: '/api/type_activites/' + activite_selected.value,
    fitArena: '/api/fit_arenas/' + props.id,
    //typeActivite: activite_selected.value,
    //fitArena: props.id,
    ordre: activite.value.ordre,
    libelle: activite.value.libelle,
    description: activite.value.description,
    actif: activite.value.actif,
    icone: activite.value.icone,
    reservationDeGroupe: activite.value.reservationDeGroupe == true ? activite.value.reservationDeGroupe : false
  }
  if (id_selected.value) {
    try {
      const {data} = await updateActivites(actTemp, id_selected.value)
      toast.success('Enregistrement de l\'activité avec succès');
    } catch (e) {
      toast.error('Erreur, Veuillez contacter votre administrateur');
    }

  } else {
    try {
      const {data} = await postActivites(actTemp)
      toast.success('Enregistrement de l\'activité avec succès');
    } catch (e) {
      toast.error('Erreur, Veuillez contacter votre administrateur');
    }

    //const {data} = await postActiviteWithIcone(actTemp)
  }

  activite_modal.value = false

  activites.value = await getActivites(props.id)
  typeActivites.value = await getTypeActivites()
}
onMounted(async () => {
  activites.value = await getActivites(props.id)
  typeActivites.value = await getTypeActivites()
})

const cancel = () => {
  activite.value = {}

}

</script>

