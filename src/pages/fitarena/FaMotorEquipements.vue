<template>
  <Card>
    <h1>équipements numériques de la fit arena</h1>
    <div v-for="typeEquip of typeEquipements">
      <h2 className="pt-10 pb-10">{{ ty peEquip.libelle }}</h2>
      <div className="relative overflow-x-auto">
        <table v-if="typeEquip.equipements.length"
               className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3"></th>
            <th scope="col" className="px-6 py-3">Actif</th>
            <th scope="col" className="px-6 py-3">Libellé</th>
            <th scope="col" className="px-6 py-3">Adresse IP</th>
          </tr>
          </thead>
          <tbody>
          <tr className="bg-white" v-for="(equipementTemp, i) in typeEquip.equipements">
            <td v-if="equipementTemp.fitArena.id == props.id" className="flex justify-center items-center p-3">
              <Button test="TdeleteClient" borderless icon="delete" type="secondary" @click="removeEquipement(i)"/>
              <Button test="TeditClient" borderless icon="edit" type="secondary" @click="editEquipement(i)"/>
            </td>
            <td className="px-6 py-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="true" className="sr-only peer" v-if="equipementTemp.statut" checked>
                <div
                    className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
              </label>
            </td>
            <td className="px-6 py-4">{{ equipementTemp.libelle }}</td>
            <td className="px-6 py-4">{{ equipementTemp.ip }}</td>
            <td className="px-6 py-4">
              <Button label="Détails" type="secondary" @click="showEquipement(i)"/>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <Button label="Ajouter un équipement numerique" icon="add" type="secondary" @click="addEquipement"
            id="TaddEquipementNumerique"/>
  </Card>

</template>

<script setup>
import Card from '../../components/common/Card.vue'
import Modal from '../../components/common/Modal.vue'
import Button from '../../components/common/Button.vue'
import {onMounted, ref} from "vue";
import {deleteEquipements, getEquipements, postEquipements, updateEquipements} from "../../api/equipement";
import {
  deleteTypeEquipements,
  getTypeEquipements,
  postTypeEquipements,
  updateTypeEquipements
} from "../../api/typeEquipement";


const props = defineProps(['id'])
const equipement_modal = ref(false)
const readonly = ref(false)
const id_selected = ref(0)
const equipements = ref([])
const typeEquipements = ref([])
const typeEquipement = ref({})
const equipement = ref({})
const activite_selected = ref({})

const removeEquipement = async (i) => {
  const equipementTemp = equipements.value[i]
  await deleteEquipements(equipementTemp.id)
  cancel()
  equipements.value = await getEquipements(props.id)
  typeEquipements.value = await getTypeEquipements()
  equipement_modal.value = false
}

const editEquipement = (i) => {
  const equipementTemp = equipements.value[i]
  mapApiToData(equipementTemp)
  equipement_modal.value = true
  readonly.value = false
}

const showEquipement = async (i) => {
  const activiteTemp = equipements.value[i]
  mapApiToData(activiteTemp)
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
    //typeActivite: activite_selected.value,
    //fitArena: props.id,
    ordre: activite.value.ordre,
    libelle: activite.value.libelle,
    actif: activite.value.actif
  }
  if (id_selected.value) {
    const {data} = await updateEquipements(equipementTemp, id_selected.value)
  } else {
    const {data} = await postEquipements(equipementTemp)
    //const {data} = await postActiviteWithIcone(actTemp)
  }

  equipement_modal.value = false
  cancel()
  loadEquipementTab()


}
onMounted(async () => {
  equipements.value = await getEquipements(props.id, 1, '&typeEquipement.categoryTypeEquipement.code=numerique')
  typeEquipements.value = await getTypeEquipements(1, '&categoryTypeEquipement.code=numerique')
})

const cancel = () => {
  equipement.value = {}
}
</script>
