<template>
  <Card>
    <h1>équipements numériques de la fit arena</h1>
    <div v-for="typeEquip of typeEquipements">
      <h2 class="pt-10 pb-10">{{typeEquip.libelle}}</h2>
      <div class="relative overflow-x-auto">
        <table v-if="typeEquip.equipements.length" class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3"></th>
              <th scope="col" class="px-6 py-3">Actif</th>
              <th scope="col" class="px-6 py-3">Libellé</th>
              <th scope="col" class="px-6 py-3">Adresse IP</th>
            </tr>
          </thead>
          <tbody>
          <tr class="bg-white" v-for="(equipementTemp, i) in typeEquip.equipements">
            <td v-if="equipementTemp.fitArena.id == props.id" class="flex justify-center items-center p-3">
              <Button test="TdeleteClient" borderless icon="delete" type="secondary" @click="removeEquipement(equipementTemp.id)"/>
              <Button test="TeditClient" borderless icon="edit" type="secondary" @click="editEquipement(equipementTemp.id)"/>
            </td>
            <td class="px-6 py-4">
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="true" class="sr-only peer" v-if="equipementTemp.statut" checked >
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
              </label>
            </td>
            <td class="px-6 py-4">{{ equipementTemp.libelle }}</td>
            <td class="px-6 py-4">{{ equipementTemp.ip }}</td>
            <td class="px-6 py-4">
              <Button label="Détails" type="secondary" @click="showEquipement(equipementTemp.id)"/>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <Button label="Ajouter un équipement numerique" icon="add" type="secondary" @click="addEquipement" id="TaddEquipementNumerique"/>
  </Card>

  <form @submit.prevent="saveEquipement">
    <Modal v-if="equipement_modal" :type="readonly ? 'visualiser' : 'classic' " :title="readonly ? 'Information d\'un équipement' : 'Ajouter ou modifier un équipement'" @cancel="equipement_modal = false">
      <div class="flex items-center">
        <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Type d'équipement</label>
        <select v-if="typeEquipements.length" v-model="equipement_selected" id="TTypeActivite" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option v-for="typeEquipement in typeEquipements" :value="typeEquipement.id">{{typeEquipement.libelle}}</option>
        </select>
      </div>
      <div class="flex items-center">
        <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Nom</label>
        <input :readonly="readonly" v-model="equipement.libelle" id="TEquipementLibelle" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required>
      </div>
      <div class="flex items-center">
        <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Adresse IP</label>
        <input :readonly="readonly" v-model="equipement.ip" id="TEquipementIp" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required>
      </div>
      <div class="flex items-center">
        <span class="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300">Actif : </span>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" value="true" class="sr-only peer" v-model="equipement.statut" >
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
import {
  deleteEquipements,
  getEquipement,
  getEquipements,
  postEquipements,
  updateEquipements
} from "../../api/equipement";
import {deleteTypeEquipements, getTypeEquipements, postTypeEquipements, updateTypeEquipements} from "../../api/typeEquipement";


const props = defineProps(['id'])
const equipement_modal = ref(false)
const readonly = ref(false)
const id_selected = ref(0)
const equipements = ref([])
const typeEquipements = ref([])
const typeEquipement = ref({})
const equipement = ref({})
const equipement_selected = ref({})
const addEquipement = () => {
  equipement_modal.value = true
}

const removeEquipement = async (i) => {
  await deleteEquipements(i)
  cancel()
  equipements.value = await getEquipements(props.id, 1, '&typeEquipement.categoryTypeEquipement.code=numerique')
  typeEquipements.value = await getTypeEquipements(1, '&categoryTypeEquipement.code=numerique')
  equipement_modal.value = false
}

const editEquipement = async (i) => {
  const equipementTemp = await getEquipement(i)
  mapApiToData(equipementTemp)
  equipement_modal.value = true
  readonly.value = false
}

const showEquipement = async (i) => {
  const equipementTemp = await getEquipement(i)
  mapApiToData(equipementTemp)
  equipement_modal.value = true
  readonly.value = true
}

const mapApiToData = (equipementTemp) => {
  equipement.value = equipementTemp
  id_selected.value = equipementTemp.id
  equipement_selected.value = equipementTemp.typeEquipement.id
}

const saveEquipement = async () => {
  const equipementTemp = {
    typeEquipement: '/api/type_equipements/' + equipement_selected.value,
    fitArena: '/api/fit_arenas/' + props.id,
    libelle: equipement.value.libelle,
    statut: equipement.value.statut == true ? equipement.value.statut : false ,
    ip: equipement.value.ip,
  }
  if (id_selected.value) {
    const {data} = await updateEquipements(equipementTemp, id_selected.value)
  } else {
    const {data} = await postEquipements(equipementTemp)
    //const {data} = await postActiviteWithIcone(actTemp)
  }
  equipement_modal.value = false
  cancel()
  equipements.value = await getEquipements(props.id, 1, '&typeEquipement.categoryTypeEquipement.code=numerique')
  typeEquipements.value = await getTypeEquipements(1, '&categoryTypeEquipement.code=numerique')


}
onMounted(async () => {
  equipements.value = await getEquipements(props.id, 1, '&typeEquipement.categoryTypeEquipement.code=numerique')
  typeEquipements.value = await getTypeEquipements(1, '&categoryTypeEquipement.code=numerique')
})

const cancel = () => {
  equipement.value = {}
}
</script>
