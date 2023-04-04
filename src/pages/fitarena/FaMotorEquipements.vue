<template>
  <Card>
    <h1>équipements motorisés de la fit arena</h1>
    <div v-for="(typeEquip, i) of typeEquipements">
      <div v-if="typeEquip.equipements.length" class="m-5 p-4 border border-gray-200"  :key="i">
        <h2 v-if="typeEquip.equipements.length" class="pt-2 pb-5">{{typeEquip.libelle}}</h2>
        <div v-if="typeEquip.equipements.length" class="relative overflow-x-auto">
          <table v-for="(equipementTemp, i) in typeEquip.equipements" :key="i" class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
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
              <td class="flex justify-center items-center p-3">
                <Button test="TdeleteClient" borderless icon="delete" type="secondary" @click="removeEquipement(equipementTemp.id)"/>
                <Button test="TeditClient" borderless icon="edit" type="secondary" @click="editEquipement(equipementTemp.id)"/>
              </td>
              <td class="px-6 py-4">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="true" class="sr-only peer" v-model="equipementTemp.statut"  @change="modifieEquipement(equipementTemp)" >
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-400"></div>
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
                  <h3 class="pt-2 pl-10">Configuration</h3>
                  <table v-if="equipementTemp.equipementModes.length" class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead>
                    <tr>
                      <th scope="col" class="w-1/5 px-6 py-3">Actif</th>
                      <th scope="col" class="w-1/5 px-6 py-3">Libellé</th>
                      <th scope="col" class="w-1/5 px-6 py-3">Adresse IP</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="bg-white" v-for="(equipementMode, i) in equipementTemp.equipementModes" :key="i">
                      <td class="px-6 py-4">
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" value="true" class="sr-only peer" v-model="equipementMode.statut">
                          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-400"></div>
                          <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
                        </label>
                      </td>
                      <td class="px-6 py-4">
                        {{ equipementMode.mode.libelle }}
                      </td>
                      <td class="px-6 py-4">
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
    </div>
    <Button label="Ajouter un équipement motorisé" icon="add" type="secondary" @click="addEquipement" id="TaddEquipementNumerique"/>
  </Card>
  <form @submit.prevent="saveEquipement">
    <Modal v-if="equipement_modal" :type="readonly ? 'visualiser' : 'classic'" :title="modal_title" @cancel="equipement_modal = false">
      <div class="flex items-center">
        <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Type d'équipement</label>
        <select v-if="typeEquipements.length" v-model="equipement_selected" id="TTypeActivite" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option v-for="(typeEquipement, i) in typeEquipements" :key="i" :value="typeEquipement.id">{{typeEquipement.libelle}}</option>
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
        <span class="text-sm font-medium text-gray-900 dark:text-gray-300 w-1/2">Actif : </span>
        <label class="relative inline-flex items-center cursor-pointer w-full">
          <input type="checkbox" value="true" class="sr-only peer" v-model="equipement.statut">
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-400"></div>
          <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
        </label>
      </div>
      <CardConfiguration>
        <h3 class="pt-2 pl-10">Configuration</h3>
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead>
          <tr>
            <th scope="col" class="w-1/5 px-6 py-3"></th>
            <th scope="col" class="w-1/5 px-6 py-3">Libellé</th>
            <th scope="col" class="w-1/5 px-6 py-3">Nom d'Appel</th>
          </tr>
          </thead>
          <tbody>
          <tr class="bg-white" v-for="(equipementMode, i) in equipement.equipementModes" :key="i">
            <td class="flex justify-center items-center p-3">
              <Button test="TdeleteClient" borderless icon="delete" type="secondary" @click="removeEquipementConfiguration(equipementMode.id)"/>
              <Button test="TeditClient" borderless icon="edit" type="secondary" @click="editEquipementConfiguration(equipementMode.id)"/>
            </td>
            <td class="px-6 py-4">
              <Input :readonly="equipementMode.mode.readonly" v-model="equipementMode.mode.libelle"/>
            </td>
            <td class="px-6 py-4">
              <Input :readonly="equipementMode.mode?.readonly ? true : false" v-model="equipementMode.nomAppel"/>
              {{equipementMode.mode.readonly}}
            </td>
          </tr>
          </tbody>
        </table>
        <Button label="Ajouter une configuration" icon="add" type="secondary" @click="addEquipementConfiguration" id="TaddConfiguration"/>
      </CardConfiguration>
    </Modal>
  </form>

</template>

<script setup>
import Card from '../../components/common/Card.vue'
import CardConfiguration from '../../components/common/CardConfiguration.vue'
import Modal from '../../components/common/Modal.vue'
import Button from '../../components/common/Button.vue'
import Input from '../../components/common/Input.vue'
import {onMounted, ref} from "vue";
import {
  deleteEquipements,
  getEquipement,
  getEquipements,
  postEquipements,
  updateEquipements,
  patchEquipements
} from "../../api/equipement";
import {deleteTypeEquipements, getTypeEquipements, postTypeEquipements, updateTypeEquipements} from "../../api/typeEquipement";
import {toast} from "vue3-toastify";
import {patchActivites} from "../../api/activite";
const props = defineProps(['id'])
const equipement_modal = ref(false)
const readonly = ref(false)
const id_selected = ref(0)
const equipements = ref([])
const typeEquipements = ref([])
const typeEquipement = ref({})
const equipement = ref({})
const equipement_selected = ref({})
const modal_title = ref('')

const addEquipement = () => {
  cancel()
  equipement_modal.value = true
  modal_title.value = 'Ajouter un équipement motorisé'
}

const removeEquipement = async (i) => {
  await deleteEquipements(i)
  cancel()
  equipements.value = await getEquipements(props.id, 1, '&typeEquipement.categoryTypeEquipement.code=motorise')
  typeEquipements.value = await getTypeEquipements(1, '&categoryTypeEquipement.code=motorise')
  equipement_modal.value = false
}


const modifieEquipement = async({statut,id}) => {
  try {
    await patchEquipements({statut}, id)
    toast.success('Modification de l\'élément motorisé avec succès');
  } catch (e) {
    toast.error('Erreur, Veuillez contacter votre administrateur');
  }
}

const editEquipement = async (i) => {
  const equipementTemp = await getEquipement(i)
  mapApiToData(equipementTemp)
  equipement_modal.value = true
  readonly.value = false
  modal_title.value = 'Modifier un équipement'
}

const showEquipement = async (i) => {
  const equipementTemp = await getEquipement(i)
  mapApiToData(equipementTemp)
  equipement_modal.value = true
  readonly.value = true
  modal_title.value = "Informations d'un équipement"
}

const mapApiToData = (equipementTemp) => {
  equipement.value = equipementTemp
  id_selected.value = equipementTemp.id
  equipement_selected.value = equipementTemp.typeEquipement.id
}

const addEquipementConfiguration = () => {
  const mode = {'libelle' : 'toto', 'type' : 'toto', 'readonly': false}
  equipement.value.equipementModes.push({mode})

}

const removeEquipementConfiguration = () => {

}

const editEquipementConfiguration = () => {

}

const saveEquipement = async () => {
  console.log(equipement.value)
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
      toast.success('Enregistrement de l\'élément motorisé avec succès');
    } catch (e) {
      toast.error('Erreur, Veuillez contacter votre administrateur');
    }
  } else {
    try {
      const {data} = await postEquipements(equipementTemp)
      toast.success('Enregistrement de l\'élément motorisé avec succès');
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
  //id_selected.value = {}
  equipement_selected.value = {}


}
</script>
