<template>
  <Card>
    <h1>équipements numériques de la fit arena</h1>
    <div v-for="(typeEquip, i) of typeEquipements" :key="i">
      <div
        v-if="typeEquip.equipements.length"
        :key="i"
        class="m-5 border border-gray-200 p-4"
      >
        <h2 v-if="typeEquip.equipements.length" class="pt-2 pb-5">
          {{ typeEquip.libelle }}
        </h2>
        <div
          v-if="typeEquip.equipements.length"
          class="relative overflow-x-auto"
        >
          <table
            v-if="typeEquip.equipements.length"
            class="w-full text-left text-sm text-gray-500 dark:text-gray-400"
          >
            <thead
              class="text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
            >
              <tr>
                <th scope="col" class="px-6 py-3"></th>
                <th scope="col" class="px-6 py-3">Actif</th>
                <th scope="col" class="px-6 py-3">Libellé</th>
                <th scope="col" class="px-6 py-3">Adresse IP</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(equipementTemp, i) in typeEquip.equipements"
                :key="i"
                class="bg-white"
              >
                <td class="flex items-center justify-center p-3">
                  <Button
                    test="TdeleteClient"
                    borderless
                    icon="delete"
                    type="secondary"
                    @click="removeEquipement(equipementTemp.id)"
                  />
                  <Button
                    test="TeditClient"
                    borderless
                    icon="edit"
                    type="secondary"
                    @click="editEquipement(equipementTemp.id)"
                  />
                </td>
                <td class="px-6 py-4">
                  <label
                    class="relative inline-flex cursor-pointer items-center"
                  >
                    <input
                      v-model="equipementTemp.statut"
                      type="checkbox"
                      value="true"
                      class="peer sr-only"
                      @change="modifieEquipement(equipementTemp)"
                    />
                    <div
                      class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"
                    ></div>
                    <span
                      class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                    ></span>
                  </label>
                </td>
                <td class="px-6 py-4">{{ equipementTemp.libelle }}</td>
                <td class="px-6 py-4">{{ equipementTemp.ip }}</td>
                <td class="px-6 py-4">
                  <Button
                    label="Détails"
                    type="secondary"
                    @click="showEquipement(equipementTemp.id)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <Button
      id="TaddEquipementNumerique"
      label="Ajouter un équipement numérique"
      icon="add"
      type="secondary"
      @click="addEquipement"
    />
  </Card>

  <form @submit.prevent="saveEquipement">
    <Modal
      v-if="equipement_modal"
      :type="readonly ? 'visualiser' : 'classic'"
      :title="modal_title"
      @cancel="equipement_modal = false"
    >
      <div class="flex items-center">
        <label class="mb-2 block w-1/2 text-sm font-medium text-gray-900"
          >Type d'équipement</label
        >
        <select
          v-if="typeEquipements.length"
          :disabled="readonly == true ? true : false"
          id="TTypeActivite"
          v-model="equipement_selected"
          class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        >
          <option
            v-for="(typeEquipement, i) in typeEquipements"
            :key="i"
            :value="typeEquipement.id"
          >
            {{ typeEquipement.libelle }}
          </option>
        </select>
      </div>
      <div class="flex items-center">
        <Input :readonly="readonly" id="TEquipementLibelle" v-model="equipement.libelle" :type="'text'" label="Nom" :required="true" class="w-full" />
      </div>
      <div class="flex items-center">
        <Input :readonly="readonly" id="TEquipementIp" v-model="equipement.ip" :type="'text'" label="Adresse IP" :required="true" class="w-full" />
      </div>
      <div class="flex items-center">
        <span class="w-1/2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >Actif :
        </span>
        <label class="relative inline-flex w-full cursor-pointer items-center">
          <input
            v-model="equipement.statut"
            :disabled="readonly == true ? true : false"
            type="checkbox"
            value="true"
            class="peer sr-only"
          />
          <div
            class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"
          ></div>
          <span
            class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
          ></span>
        </label>
      </div>
    </Modal>
  </form>
</template>

<script setup>
import Card from '../../components/common/Card.vue'
import Modal from '../../components/common/Modal.vue'
import Button from '../../components/common/Button.vue'
import Input from '../../components/common/Input.vue'
import { onMounted, ref } from 'vue'
import {
  deleteEquipements,
  getEquipement,
  getEquipements,
  patchEquipements,
  postEquipements,
  updateEquipements,
} from '../../api/equipement'
import { getTypeEquipements } from '../../api/typeEquipement'
import { toast } from 'vue3-toastify'
import {useRoute} from "vue-router";

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

const id_fa = useRoute().params.id

const addEquipement = () => {
  equipement_modal.value = true
  readonly.value = false
  modal_title.value = 'Ajouter un équipement'
}

const removeEquipement = async (i) => {
  await deleteEquipements(i)
  cancel()
  equipements.value = await getEquipements(
    props.id,
    1,
    '&typeEquipement.categoryTypeEquipement.code=numerique'
  )
  typeEquipements.value = await getTypeEquipements(
    1,
    '&categoryTypeEquipement.code=numerique'
  )
  equipement_modal.value = false
}

const modifieEquipement = async ({ statut, id }) => {
  try {
    await patchEquipements({ statut }, id)
    toast.success("Modification de l'élément motorisé avec succès")
  } catch (e) {
    toast.error('Erreur, Veuillez contacter votre administrateur')
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

const saveEquipement = async () => {
  const equipementTemp = {
    typeEquipement: '/api/type_equipements/' + equipement_selected.value,
    fitArena: '/api/fit_arenas/' + props.id,
    libelle: equipement.value.libelle,
    statut: equipement.value.statut == true ? equipement.value.statut : false,
    ip: equipement.value.ip,
  }
  if (id_selected.value) {
    const { data } = await updateEquipements(equipementTemp, id_selected.value)
  } else {
    const { data } = await postEquipements(equipementTemp)
    //const {data} = await postActiviteWithIcone(actTemp)
  }
  equipement_modal.value = false
  cancel()
  equipements.value = await getEquipements(
    props.id,
    1,
    '&typeEquipement.categoryTypeEquipement.code=numerique'
  )
  typeEquipements.value = await getTypeEquipements(
    1,
    '&categoryTypeEquipement.code=numerique&equipements.fitArena='+id_fa
  )
}
onMounted(async () => {
  equipements.value = await getEquipements(
    props.id,
    1,
    '&typeEquipement.categoryTypeEquipement.code=numerique'
  )
  typeEquipements.value = await getTypeEquipements(
    1,
    '&categoryTypeEquipement.code=numerique&equipements.fitArena='+id_fa
  )
})

const cancel = () => {
  equipement.value = {}
}
</script>
