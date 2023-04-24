<template>
  <Card>
    <h1>équipements motorisés de la fit arena</h1>
    <div v-for="(typeEquip, i) of typeEquipements" :key="i">
      <div
        v-if="typeEquip.equipements.length"
        :key="i"
        class="m-5 border border-gray-200 p-4"
      >
        <h2 v-if="typeEquip.equipements.length" class="pb-5 pt-2">
          {{ typeEquip.libelle }}
        </h2>
        <div
          v-if="typeEquip.equipements.length"
          class="relative overflow-x-auto"
        >
          <table
            v-for="(equipementTemp, i) in typeEquip.equipements"
            :key="i"
            class="w-full text-left text-sm text-gray-500 dark:text-gray-400"
          >
            <thead
              v-if="i == 0"
              class="text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
            >
              <tr>
                <th scope="col" class="px-6 py-3"></th>
                <th scope="col" class="px-6 py-3">Actif</th>
                <th scope="col" class="px-6 py-3">Libellé</th>
                <th scope="col" class="px-6 py-3">Adresse IP</th>
              </tr>
            </thead>
            <thead
              v-if="i > 0"
              class="text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
            >
              <tr>
                <th scope="col" class="px-6 py-3"></th>
                <th scope="col" class="px-6 py-3"></th>
                <th scope="col" class="px-6 py-3"></th>
                <th scope="col" class="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              <tr class="bg-white">
                <td class="flex w-2/12 p-3">
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
                <td class="w-1/12 px-6 py-4">
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
                      class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-green-800"
                    ></div>
                    <span
                      class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                    ></span>
                  </label>
                </td>
                <td class="w-1/2 max-w-xs truncate break-all px-6 py-4">
                  {{ equipementTemp.libelle }}
                </td>
                <td class="w-2/12 px-6 py-4">{{ equipementTemp.ip }}</td>
                <td class="w-1/12 px-6 py-4">
                  <Button
                    label="Détails"
                    type="secondary"
                    @click="showEquipement(equipementTemp.id)"
                  />
                </td>
              </tr>
              <tr v-if="equipementTemp.equipementModes.length">
                <td></td>
                <td colspan="3">
                  <CardConfiguration>
                    <h3 class="pl-10 pt-2">Configuration</h3>
                    <table
                      v-if="equipementTemp.equipementModes.length"
                      class="w-full text-left text-sm text-gray-500 dark:text-gray-400"
                    >
                      <thead>
                        <tr>
                          <th scope="col" class="px-6 py-3">Actif</th>
                          <th scope="col" class="px-6 py-3">Libellé</th>
                          <th scope="col" class="px-6 py-3">Adresse IP</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(
                            equipementMode, i
                          ) in equipementTemp.equipementModes"
                          :key="i"
                          class="bg-white"
                        >
                          <td class="w-3/12 px-6 py-4">
                            <label
                              class="relative inline-flex cursor-pointer items-center"
                            >
                              <input
                                v-model="equipementMode.statut"
                                type="checkbox"
                                value="true"
                                class="peer sr-only"
                              />
                              <div
                                class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"
                              ></div>
                              <span
                                class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                              ></span>
                            </label>
                          </td>
                          <td
                            class="w-7/12 max-w-xs truncate break-all px-6 py-4"
                          >
                            {{ equipementMode.mode.libelle }}
                          </td>
                          <td class="w-2/12 px-6 py-4">
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
    <Button
      id="TaddEquipementNumerique"
      label="Ajouter un équipement motorisé"
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
          id="TTypeActivite"
          v-model="equipement_selected"
          :disabled="readonly == true ? true : false"
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
        <Input
          id="TEquipementLibelle"
          v-model="equipement.libelle"
          :readonly="readonly"
          :type="'text'"
          label="Nom"
          :required="true"
          class="w-full"
        />
      </div>
      <div class="flex items-center">
        <Input
          id="TEquipementIp"
          v-model="equipement.ip"
          :readonly="readonly"
          :type="'text'"
          label="Adresse IP"
          :required="true"
          class="w-full"
        />
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
            class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"
          ></div>
          <span
            class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
          ></span>
        </label>
      </div>
      <CardConfiguration>
        <h3 class="pl-10 pt-2">Configuration</h3>
        <table
          class="w-full text-left text-sm text-gray-500 dark:text-gray-400"
        >
          <thead>
            <tr>
              <th scope="col" class="w-1/5 px-6 py-3"></th>
              <th scope="col" class="w-1/5 px-6 py-3">Libellé</th>
              <th scope="col" class="w-1/5 px-6 py-3">Nom d'Appel</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(equipementMode, i) in equipement.equipementModes"
              :key="i"
              class="bg-white"
            >
              <td class="flex items-center justify-center p-3">
                <Button
                  test="TdeleteClient"
                  borderless
                  icon="delete"
                  type="secondary"
                  @click="removeEquipementConfiguration(equipementMode.id)"
                />
                <Button
                  test="TeditClient"
                  borderless
                  icon="edit"
                  type="secondary"
                  @click="editEquipementConfiguration(equipementMode.id)"
                />
              </td>
              <td class="px-6 py-4">
                <Input
                  v-model="equipementMode.mode.libelle"
                  :readonly="equipementMode.mode.readonly"
                />
              </td>
              <td class="px-6 py-4">
                <Input
                  v-model="equipementMode.nomAppel"
                  :readonly="equipementMode.mode?.readonly ? true : false"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <Button
          v-if="!readonly"
          id="TaddConfiguration"
          label="Ajouter une configuration"
          icon="add"
          type="secondary"
          @click="addEquipementConfiguration"
        />
      </CardConfiguration>
    </Modal>
  </form>

  <form @submit.prevent="deleteEquipmentValidation(deleteEquipmentId)">
    <ValidationModal
      v-if="delete_modal"
      type="delete"
      @cancel="delete_modal = false"
    >
    </ValidationModal>
  </form>

  <form @submit.prevent="updateEquipmentValidation()">
    <ValidationModal v-if="edit_modal" type="edit" @cancel="edit_modal = false">
    </ValidationModal>
  </form>

  <form @submit.prevent="addEquipmentValidation()">
    <ValidationModal v-if="add_modal" type="add" @cancel="add_modal = false">
    </ValidationModal>
  </form>
</template>

<script setup>
import Card from '../../components/common/Card.vue'
import CardConfiguration from '../../components/common/CardConfiguration.vue'
import Modal from '../../components/common/Modal.vue'
import ValidationModal from '../../components/common/ValidationModal.vue'
import Button from '../../components/common/Button.vue'
import Input from '../../components/common/Input.vue'
import {
  deleteEquipements,
  getEquipement,
  getEquipements,
  postEquipements,
  updateEquipements,
  patchEquipements,
} from '../../api/equipement.js'
import { getTypeEquipements } from '../../api/typeEquipement.js'
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const props = defineProps(['id'])

const delete_modal = ref(false)
const deleteEquipmentId = ref(0)
const edit_modal = ref(false)
const add_modal = ref(false)
const equipmentTemp = ref({})

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

onMounted(async () => {
  equipements.value = await getEquipements(
    props.id,
    1,
    '&typeEquipement.categoryTypeEquipement.code=motorise'
  )
  typeEquipements.value = await getTypeEquipements(
    1,
    '&categoryTypeEquipement.code=motorise&equipements.fitArena=' + id_fa
  )
})

const addEquipement = () => {
  cancel()
  equipement_modal.value = true
  readonly.value = false
  modal_title.value = 'Ajouter un équipement motorisé'
}

const removeEquipement = (id) => {
  deleteEquipmentId.value = id
  delete_modal.value = true
}

const deleteEquipmentValidation = async (id) => {
  try {
    await deleteEquipements(id)
    toast.success('Suppression effectuée avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }

  delete_modal.value = false
  deleteEquipmentId.value = 0
  cancel()
  equipements.value = await getEquipements(
    props.id,
    1,
    '&typeEquipement.categoryTypeEquipement.code=motorise'
  )
  typeEquipements.value = await getTypeEquipements(
    1,
    '&categoryTypeEquipement.code=motorise'
  )
  equipement_modal.value = false
}

const modifieEquipement = async ({ statut, id }) => {
  try {
    await patchEquipements({ statut }, id)
    toast.success('Modification effectuée avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
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
  const mode = { libelle: '', type: '', readonly: false }
  equipement.value.equipementModes.push(mode)
}

const removeEquipementConfiguration = () => {}

const editEquipementConfiguration = () => {}

const saveEquipement = () => {
  equipmentTemp.value = {
    typeEquipement: '/api/type_equipements/' + equipement_selected.value,
    fitArena: '/api/fit_arenas/' + props.id,
    libelle: equipement.value.libelle,
    statut: equipement.value.statut == true ? equipement.value.statut : false,
    ip: equipement.value.ip,
  }

  if (id_selected.value) {
    edit_modal.value = true
  } else {
    add_modal.value = true
  }
}

const updateEquipmentValidation = async () => {
  try {
    await updateEquipements(equipmentTemp, id_selected.value)
    toast.success('Modification effectuée avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }

  edit_modal.value = false
  equipement_modal.value = false
  cancel()
  equipements.value = await getEquipements(
    props.id,
    1,
    '&typeEquipement.categoryTypeEquipement.code=motorise'
  )
  typeEquipements.value = await getTypeEquipements(
    1,
    '&categoryTypeEquipement.code=motorise&equipements.fitArena=' + id_fa
  )
}

const addEquipmentValidation = async () => {
  try {
    await postEquipements(equipmentTemp)
    toast.success('Ajout effectué avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }

  add_modal.value = false
  equipement_modal.value = false
  cancel()
  equipements.value = await getEquipements(
    props.id,
    1,
    '&typeEquipement.categoryTypeEquipement.code=motorise'
  )
  typeEquipements.value = await getTypeEquipements(
    1,
    '&categoryTypeEquipement.code=motorise&equipements.fitArena=' + id_fa
  )
}

const cancel = () => {
  equipement.value = {}
  id_selected.value = 0
  equipement_selected.value = {}
}
</script>
