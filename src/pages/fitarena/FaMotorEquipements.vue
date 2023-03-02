<template>
  <Card>
    <h1>équipements motorisés de la fit arena</h1>
    <div v-for="typeEquip of typeEquipements">
      <h2 class="pt-10 pb-10">{{typeEquip.libelle}}</h2>
      <div class="relative overflow-x-auto">
        <table v-if="typeEquip.equipements.length" v-for="(equipementTemp, i) in typeEquip.equipements" class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead v-if="i == 0" class="text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="w-1/5 px-6 py-3"></th>
            <th scope="col" class="w-1/5 px-6 py-3">Actif</th>
            <th scope="col" class="w-1/5 px-6 py-3">Libellé</th>
            <th scope="col" class="w-1/5 px-6 py-3">Adresse IP</th>
          </tr>
          </thead>
          <thead v-if="i > 0" class="text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="w-1/5 px-6 py-3"></th>
            <th scope="col" class="w-1/5 px-6 py-3"></th>
            <th scope="col" class="w-1/5 px-6 py-3"></th>
            <th scope="col" class="w-1/5 px-6 py-3"></th>
          </tr>
          </thead>
          <tbody>
          <tr class="bg-white" >
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
          <tr v-if="equipementTemp.equipementModes.length">
            <td></td>
            <td colspan="3">
              <CardConfiguration>
                <table v-if="equipementTemp.equipementModes.length" class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <h2 class="pt-4 pl-10">Configuration</h2>
                  <tbody>
                  <tr class="bg-white" v-for="(equipementMode, i) in equipementTemp.equipementModes">
                    <td class="px-6 py-4">
                      <span class="pl-4 mr-3 text-sm font-medium text-gray-900 dark:text-gray-300">Actif : </span>
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="true" class="sr-only peer" v-model="equipementMode.actif"  >
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
                      </label>
                    </td>
                    <td class="px-6 py-4">
                      <span class="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300">Libellé : </span>
                      {{ equipementMode.mode.libelle }}
                    </td>
                    <td class="px-6 py-4">
                      <span class="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300">Nom Appel : </span>
                      {{ equipementMode.nomAppel }}
                    </td>
                  </tr>
                  </tbody>
                </table>
              </CardConfiguration>
            </td>
            <td></td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <Button label="Ajouter un équipement motorise" icon="add" type="secondary" @click="addEquipement" id="TaddEquipementNumerique"/>
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
      <CardConfiguration>
        <table v-if="equipement.equipementModes.length" class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <h2 class="pt-4 pl-10">Configuration</h2>
          <tbody>
          <tr class="bg-white" v-for="(equipementMode, i) in equipement.equipementModes">
            <td class="px-6 py-4">
              <span class="pl-4 mr-3 text-sm font-medium text-gray-900 dark:text-gray-300">Actif : </span>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="true" class="sr-only peer" v-model="equipementMode.actif"  >
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
              </label>
            </td>
            <td class="px-6 py-4">
              <span class="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300">Libellé : </span>
              {{ equipementMode.mode.libelle }}
            </td>
            <td class="px-6 py-4">
              <span class="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300">Nom Appel : </span>
              {{ equipementMode.nomAppel }}
            </td>
          </tr>
          </tbody>
        </table>
        <Button label="Ajouter une configuration" icon="add" type="secondary" @click="addConfiguration" id="TaddConfiguration"/>
      </CardConfiguration>
    </Modal>
  </form>

</template>

<script setup>
import Card from '../../components/common/Card.vue'
import CardConfiguration from '../../components/common/CardConfiguration.vue'
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
import {toast} from "vue3-toastify";


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
  equipements.value = await getEquipements(props.id, 1, '&typeEquipement.categoryTypeEquipement.code=motorise')
  typeEquipements.value = await getTypeEquipements(1, '&categoryTypeEquipement.code=motorise')
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

const addConfiguration = () => {

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
    try {
      const {data} = await updateEquipements(equipementTemp, id_selected.value)
      toast.success('Enregistrement de l\' élément motorisé avec succes');
    } catch (e) {
      toast.error('Erreur, Veuillez contacter votre administrateur');
    }
  } else {
    try {
      const {data} = await postEquipements(equipementTemp)
      toast.success('Enregistrement de l\' élément motorisé avec succes');
    } catch (e) {
      toast.error('Erreur, Veuillez contacter votre administrateur');
    }

    //const {data} = await postActiviteWithIcone(actTemp)
  }
  equipement_modal.value = false
  cancel()
  equipements.value = await getEquipements(props.id, 1, '&typeEquipement.categoryTypeEquipement.code=motorise')
  typeEquipements.value = await getTypeEquipements(1, '&categoryTypeEquipement.code=motorise')


}
onMounted(async () => {
  equipements.value = await getEquipements(props.id, 1, '&typeEquipement.categoryTypeEquipement.code=motorise')
  typeEquipements.value = await getTypeEquipements(1, '&categoryTypeEquipement.code=motorise')
})

const cancel = () => {
  equipement.value = {}
}
</script>
