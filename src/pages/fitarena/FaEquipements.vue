<template>
  <Card>
    <h1>équipements {{ libelleType }}s de la fit arena</h1>
    <div v-for="(typeEquipement, i) in typeEquipements" :key="i">
      <div
        v-if="typeEquipement.equipements"
        class="m-5 border border-gray-200 p-4"
      >
        <h2 class="pb-5 pt-2">
          {{ typeEquipement.libelle }}
        </h2>
        <div class="relative overflow-x-auto">
          <table
            v-for="(equipement, i) in typeEquipement.equipements"
            :key="i"
            class="w-full text-left text-sm text-gray-500"
          >
            <thead
              class="text-xs uppercase text-gray-700"
            >
              <tr>
                <th scope="col" class="px-6 py-3"></th>
                <th scope="col" class="px-6 py-3">Actif</th>
                <th scope="col" class="px-6 py-3">Libellé</th>
                <th scope="col" class="px-6 py-3">Adresse IP</th>
              </tr>
            </thead>
            <tbody>
              <tr class="bg-white">
                <td class="flex w-2/12 p-3">
                  <Button
                    test="TdeleteClient"
                    borderless
                    icon="delete"
                    couleur="secondary"
                    @click="removeEquipement(equipement.id)"
                  />
                  <Button
                    test="TeditClient"
                    borderless
                    icon="edit"
                    couleur="secondary"
                    @click="editEquipement(equipement.id)"
                  />
                </td>
                <td class="w-1/12 px-6 py-4">
                  <label
                    class="relative inline-flex cursor-pointer items-center"
                  >
                    <input
                      v-model="equipement.statut"
                      type="checkbox"
                      value="true"
                      class="peer sr-only"
                      @change="modifieEquipement(equipement)"
                    />
                    <div
                      class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"
                    ></div>
                    <span
                      class="ml-3 text-sm font-medium text-gray-900"
                    ></span>
                  </label>
                </td>
                <td class="w-1/2 max-w-xs truncate break-all px-6 py-4">
                  {{ equipement.libelle }}
                </td>
                <td class="w-2/12 px-6 py-4">{{ equipement.ip }}</td>
                <td class="w-1/12 px-6 py-4">
                  <Button
                    label="Détails"
                    couleur="secondary"
                    @click="showEquipement(equipement.id)"
                  />
                </td>
              </tr>
              <tr>
                <td></td>
                <td colspan="3">
                  <CardConfiguration>
                    <h3 class="pl-10 pt-2">Configuration</h3>
                    <table
                      v-if="equipement.equipementModes && equipement.equipementModes.length"
                      class="w-full text-left text-sm text-gray-500"
                    >
                      <thead>
                        <tr>
                          <th scope="col" class="px-6 py-3">Actif</th>
                          <th scope="col" class="px-6 py-3">Libellé</th>
                          <th scope="col" class="px-6 py-3">Nom d'appel</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(
                            equipementMode, i
                          ) in equipement.equipementModes"
                          :key="i"
                          class="bg-white"
                        >
                          <td class="w-3/12 px-6 py-4">
                            <label
                              class="relative inline-flex cursor-pointer items-center"
                            >
                              <input
                                v-model="equipementMode.actif"
                                type="checkbox"
                                :disabled="true"
                                class="peer sr-only"
                              />
                              <div
                                class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"
                              ></div>
                              <span
                                class="ml-3 text-sm font-medium text-gray-900"
                              ></span>
                            </label>
                          </td>
                          <td
                            class="w-7/12 max-w-xs truncate break-all px-6 py-4"
                          >
                            {{ equipementMode.mode?.libelle }}
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
      id="TaddEquipement"
      :label="'Ajouter un équipement ' + libelleType"
      icon="add"
      couleur="secondary"
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
          v-if="typeEquipementsSelects.length"
          id="TequipementSelect"
          v-model="equipement_selected"
          :disabled="readonly"
          class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
        >
          <option
            v-for="(typeEquipementsSelect, i) in typeEquipementsSelects"
            :key="i"
            :value="typeEquipementsSelect.id"
          >
            {{ typeEquipementsSelect.libelle }}
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
          :validation="[ipValidation]"
        />
      </div>
      <div class="flex items-center">
        <span class="w-1/2 text-sm font-medium text-gray-900"
          >Actif :
        </span>
        <label class="relative inline-flex w-full cursor-pointer items-center">
          <input
            v-model="equipement.statut"
            :disabled="readonly"
            type="checkbox"
            value="true"
            class="peer sr-only"
          />
          <div
            class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"
          ></div>
          <span
            class="ml-3 text-sm font-medium text-gray-900"
          ></span>
        </label>
      </div>
      <CardConfiguration>
        <h3 class="pl-10 pt-2">Configuration</h3>
        <table
          class="w-full text-left text-sm text-gray-500"
        >
          <thead>
            <tr>
              <th scope="col" class="w-1/5 px-6 py-3"></th>
              <th scope="col" class="w-1/5 px-6 py-3">Libellé</th>
              <th scope="col" class="w-1/5 px-6 py-3">Nom d'Appel</th>
              <th scope="col" class="w-1/5 px-6 py-3">Actif</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(equipementMode, i) in equipement.equipementModes"
              :key="i"
              class="items-center bg-white"
            >
              <td class="flex items-center justify-center p-3">
                <Button
                  test="TdeleteClient"
                  borderless
                  icon="delete"
                  couleur="secondary"

                  @click="removeEquipementConfiguration(equipement.equipementModes, i)"
                />
                <Button
                  test="TeditClient"
                  borderless
                  icon="edit"
                  couleur="secondary"
                  @click="editEquipementConfiguration(equipementMode)"
                />
              </td>
              <td class="px-6 py-4">
                <select
                  :id="'Tmode' + i"
                  v-model="equipementMode.mode"
                  :disabled="equipementMode.readonly ?? true"
                  class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 disabled:text-gray-400"
                >
                  <option
                    v-for="(mode, j) in selectableModes"
                    :key="j"
                    :value="mode.iri"
                  >
                    {{ mode.libelle }}
                  </option>
                </select>
              </td>
              <td class="px-6 py-4">
                <input
                  type="text"
                  class="text-gray-900 disabled:text-gray-400"
                  v-model="equipementMode.nomAppel"
                  :disabled="equipementMode.readonly ?? true"
                />
              </td>
              <td class="px-6 py-4">

                <label
                  class="relative inline-flex cursor-pointer items-center"
                >
                  <input
                    v-model="equipementMode.actif"
                    type="checkbox"
                    value="true"
                    class="peer sr-only disabled:text-gray-300"
                    :disabled="equipementMode.readonly ?? true"
                  />
                  <div
                       :class="{
                            'peer-checked:bg-green-400': ! (equipementMode.readonly ?? true),
                            'peer-checked:bg-green-200': equipementMode.readonly ?? true,
                            'bg-gray-200': !(equipementMode.readonly ?? true),
                            'bg-gray-100': equipementMode.readonly ?? true,
                       }"
                    class="peer h-6 w-11 rounded-full  after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"
                  ></div>
<!--                  <div v-else-->
<!--                       class="peer h-6 w-11 rounded-full bg-gray-100 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-200 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"-->
<!--                  ></div>-->
                  <span
                    class="ml-3 text-sm font-medium text-gray-900"
                  ></span>
                </label>

<!--                <span v-else>{{ // equipementMode.actif ? 'Oui': 'Non' }}</span>-->
              </td>
            </tr>
          </tbody>
        </table>
        <Button
          v-if="!readonly"
          id="TaddConfiguration"
          label="Ajouter une configuration"
          icon="add"
          couleur="secondary"
          @click="addEquipementConfiguration"
        />
      </CardConfiguration>
      <MentionChampsObligatoires/>
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
} from '@api/equipement.js'
import { isValid, ipValidation } from '@/validation.js'
import { getTypeEquipements } from '@api/typeEquipement.js'
import { useRoute } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { getModes } from "@api/mode.js";
import MentionChampsObligatoires from "@components/common/MentionChampsObligatoires.vue";

// libelle éléments motoris&s ou éléménts numériques
const props = defineProps({
  id: String,
  fitArenaId: String,
  libelleType: { type: String,  validator(valeur) {return [ 'motorisé', 'numérique'].includes(valeur)}},
  codeType: { type: String, validator(valeur) {return ['motorise', 'numerique'].includes(valeur)}
  }})
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
const typeEquipementsSelects = ref([])
const typeEquipementsSelect = ref([])
const typeEquipement = ref({})
const equipement = ref({})
const equipement_selected = ref({})
const modal_title = ref('')

const validation = ref({})
const selectableModes = ref([])


onMounted(async () => {
  equipements.value = await getEquipements(
    props.id,
    1,
      '&typeEquipement.categoryTypeEquipement.code=' +  props.codeType + '&fitArena.id='+ props.fitArenaId
  )
  typeEquipements.value = setEquipementModes(
    await getTypeEquipements(
      1,
      '&categoryTypeEquipement.code=' + props.codeType + '&equipements.fitArena=' + props.fitArenaId
    ), setProprieteReadonly)
  typeEquipementsSelects.value = await getTypeEquipements(
      1,
      '&categoryTypeEquipement.code=' + props.codeType
  )
  selectableModes.value = await getModes(
    1,
    '&categoryTypeEquipement.code=' + props.codeType)
})


//
const setEquipementModes = (typeEquipements, setter) => {
  for (let typeEquipement of typeEquipements) {
    for (let equipement of typeEquipement.equipements) {
      for (let equipementMode of equipement.equipementModes ) {
        setter(equipementMode);
      }
    }
  }

  return typeEquipements;
}

const setProprieteReadonly = (objet) =>
{
  objet.readonly = false;
}

const addEquipement = () => {
  cancel()
  equipement_modal.value = true
  readonly.value = false
  modal_title.value = 'Ajouter un équipement ' + props.libelleType
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
    '&typeEquipement.categoryTypeEquipement.code=' + props.codeType
  )
  typeEquipements.value = await getTypeEquipements(
    1,
      '&categoryTypeEquipement.code=' + props.codeType +'&equipements.fitArena='+ props.fitArenaId
  )
  typeEquipementsSelects.value = await getTypeEquipements(
      1,
      '&categoryTypeEquipement.code=' + props.codeType
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
  if (!equipement.value.hasOwnProperty('equipementModes'))
    equipement.value.equipementModes = []
  equipement.value.equipementModes.push(mode)
}

const removeEquipementConfiguration = (equipementModes, i) => {

  equipementModes.splice(i, 1)
}
const editEquipementConfiguration = (equipementMode) => {
  equipementMode.readonly =  !(equipementMode.readonly ?? true)
}

const saveEquipement = () => {
  if (!isValid(validation)) return

  equipmentTemp.value = {
    typeEquipement: '/api/type_equipements/' + equipement_selected.value,
    fitArena: '/api/fit_arenas/' + props.fitArenaId,
    libelle: equipement.value.libelle,
    statut: equipement.value.statut == true ? equipement.value.statut : false,
    ip: equipement.value.ip,
    equipementModes: equipement.value.equipementModes,
  }

  if (id_selected.value) {
    edit_modal.value = true
  } else {
    add_modal.value = true
  }
}

const updateEquipmentValidation = async () => {
  try {
    await updateEquipements(equipmentTemp.value, id_selected.value)
    toast.success('Modification effectuée avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }

  edit_modal.value = false
  equipement_modal.value = false
  cancel()
  equipements.value = await getEquipements(
    props.fitArenaId,
    1,
    '&typeEquipement.categoryTypeEquipement.code=' + props.codeType + '&fitArena.id='+ props.fitArenaId
  )
  typeEquipements.value = await getTypeEquipements(
    1,
      '&categoryTypeEquipement.code=' + props.codeType + '&equipements.fitArena='+ props.fitArenaId
  )
  typeEquipementsSelects.value = await getTypeEquipements(
      1,
      '&categoryTypeEquipement.code=' +  props.codeType
  )
}

const addEquipmentValidation = async () => {
  try {
    await postEquipements(equipmentTemp.value)
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
      '&typeEquipement.categoryTypeEquipement.code=' + props.codeType + '&fitArena.id='+ props.fitArenaId
  )
  typeEquipements.value = await getTypeEquipements(
    1,
      '&categoryTypeEquipement.code=' + props.codeType + '&equipements.fitArena='+ props.fitArenaId
  )
  typeEquipementsSelects.value = await getTypeEquipements(
      1,
      '&categoryTypeEquipement.code=' + props.codeType
  )
}

const cancel = () => {
  equipement.value = {}
  id_selected.value = 0
  equipement_selected.value = {}
}
</script>

<style scoped>

</style>
