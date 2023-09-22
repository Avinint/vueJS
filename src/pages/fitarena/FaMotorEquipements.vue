<template>
  <Card>
    <h1 class="mb-6">équipements motorisés de la fit arena</h1>

    <div v-for="(typeEquipement, i) in typeEquipements" :key="`type_equipement-`+ i">
      <div v-for="(equipement, i) in typeEquipement.equipements" :key="`type_equipement-equipements-`+ i">
        <CardModalSection :title="equipement.libelle" :params="true" class="border border-gray-200 pr-6 py-6 rounded-lg mb-6">
          <template #topParams>
            <div class="px-6 py-4 flex items-center ml-8">
              <p class="w-16">{{ equipement.statut ? 'Actif' : 'Inactif' }}</p>
              <label class="relative inline-flex cursor-pointer items-center">
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
              <p class="pl-28"><span class="text-black pr-4">Adresse IP</span> {{ equipement.ip }}</p>
              <div class="ml-28 gap-10 flex">
                <Button
                  test="TshowEquipement"
                  borderless
                  icon="info"
                  couleur="secondary"
                  @click="showEquipement(equipement.id)"
                />
                <Button
                  test="TeditEquipement"
                  borderless
                  icon="edit"
                  couleur="secondary"
                  @click="editEquipement(equipement.id)"
                />
                <Button
                  test="TdeleteEquipement"
                  borderless
                  icon="delete"
                  couleur="secondary"
                  @click="removeEquipement(equipement.id)"
                />
              </div>
            </div>
          </template>
          <template #content>
            <div v-if="equipement.equipementModes && equipement.equipementModes.length" class="pl-8">
              <h2 class="title-conf mb-4">CONFIGURATION ÉQUIPEMENTS</h2>
              <table
                class="w-full text-left text-sm text-gray-500 bg-gray-200 border border-gray-200"
              >
                <thead>
                  <tr>
                    <th scope="col" class="px-6 py-3">Statut</th>
                    <th scope="col" class="px-6 py-3">Libellé</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(
                      equipementMode, i
                    ) in equipement.equipementModes"
                    :key="`equipementModes`+ i"
                    class="bg-white border border-gray-200"
                  >
                    <td class="px-6 py-4 flex">
                      <p class="w-16">{{ equipementMode.actif ? 'Actif' : 'Inactif' }}</p>
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
                    <td class="px-6 py-4 border border-gray-200">
                      {{ equipementMode.mode?.libelle ?? equipementMode.nomAppel }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
        </CardModalSection>
      </div>
    </div>
    <ButtonRight
      id="TaddEquipement"
      label="Ajouter un équipement motorisé"
      icon="add"
      couleur="danger"
      @click="addEquipement"
    />
  </Card>
  <form @submit.prevent="saveEquipement">
    <Modal
      v-if="equipement_modal"
      :type="readonly ? 'visualiser' : 'classic'"
      :title="modal_title"
      @cancel="equipement_modal = false"
      size="5xl"
      confirmButtonText="Enregistrer"
    >
      <template #topParams>
        <div class="flex items-center">
          <p class="pr-4 label-text"
            >Équipement actif :
          </p>
          <label class="relative inline-flex cursor-pointer items-center">
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
      </template>
      <div class="w-full pl-4 items-center mb-16 flex justify-between">
        <div class="w-3/12">
          <p class="mb-2 label-text"
            >Type d'équipement</p
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
              :key="`typeEquipementsSelect-` + i"
              :value="typeEquipementsSelect.id"
            >
              {{ typeEquipementsSelect.libelle }}
            </option>
          </select>
        </div>
        <div class="w-3/12">
          <Input
            id="TEquipementLibelle"
            v-model="equipement.libelle"
            :readonly="readonly"
            type="text"
            label="Nom"
            required
            class="w-full"
          />
        </div>
        <div class="w-3/12">
          <Input
            id="TEquipementIp"
            v-model="equipement.ip"
            :readonly="readonly"
            type="text"
            label="Adresse IP"
            required
            class="w-full"
            :validation="[ipValidation]"
          />
        </div>
      </div>
      <CardModalSection title="CONFIGURATION ÉQUIPEMENTS" class="pl-4" v-if="equipement.equipementModes.length > 0">
        <table
          class="w-full text-left text-sm text-gray-500 bg-gray-200 border border-gray-200"
        >
          <thead>
            <tr>
              <th scope="col" class="px-6 py-3">Statut</th>
              <th scope="col" class="px-6 py-3">Libellé</th>
              <th scope="col" class="px-6 py-3">Nom d'appel</th>
              <th scope="col" class="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(equipementMode, i) in equipement.equipementModes"
              :key="i"
              class="items-center bg-white"
            >
              <td class="px-6 py-4 flex">
                <p class="w-16">{{ equipementMode.actif ? 'Actif' : 'Inactif' }}</p>
                <label
                  class="relative inline-flex cursor-pointer items-center"
                >
                  <input
                    v-model="equipementMode.actif"
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
              </td>
              <td class="px-4 py-4">
                <select
                  :id="'Tmode-' + i"
                  v-model="equipementMode.mode"
                  class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 disabled:text-gray-400"
                >
                  <option
                    v-for="(mode, j) in selectableModes"
                    :key="j"
                    :value="mode"
                  >
                    {{ mode.libelle }}
                  </option>
                </select>
              </td>
              <td class="px-4 py-4">
                <Input
                  type="text"
                  v-model="equipementMode.nomAppel"
                />
              </td>
              <td class="flex items-center justify-center px-4 py-5">
                <Button
                  test="TdeleteEquipementMode"
                  borderless
                  icon="delete"
                  couleur="secondary"
                  @click="removeEquipementConfiguration(equipement.equipementModes, i)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </CardModalSection>
      <ButtonRight
        v-if="!readonly"
        id="TaddConfiguration"
        label="Ajouter une configuration"
        icon="add"
        couleur="danger"
        @click="addEquipementConfiguration"
        class="mt-4 ml-4"
      />
      <MentionChampsObligatoires class="pl-4" />
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
import Modal from '../../components/common/Modal.vue'
import ValidationModal from '../../components/common/ValidationModal.vue'
import Button from '../../components/common/Button.vue'
import ButtonRight from '../../components/common/ButtonRight.vue'
import Input from '../../components/common/Input.vue'
import CardModalSection from '@components/common/CardModalSection.vue'
import MentionChampsObligatoires from "@components/common/MentionChampsObligatoires.vue";
import Table from '@components/common/Table.vue'

import {
  deleteEquipements,
  getEquipement,
  getEquipements,
  postEquipements,
  updateEquipements,
  patchEquipements
} from '@api/equipement.js'
import { isValid, ipValidation } from '@/validation.js'
import { getTypeEquipements } from '@api/typeEquipement.js'
import { getModes } from "@api/mode.js";

import { onMounted, ref, watch } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

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
const typeEquipement = ref({})
const equipement = ref({})
const equipement_selected = ref({})
const modal_title = ref('')
const validation = ref({})
const selectableModes = ref([])

const props = defineProps({ id: String })

const fetchDonnees = async () => {
  equipements.value = await getEquipements(
    props.id,
    1,
    '&typeEquipement.categoryTypeEquipement.code=motorise&fitArena.id='+ props.id
  )
  typeEquipements.value = setEquipementModes(
    await getTypeEquipements(
      1,
      '&categoryTypeEquipement.code=motorise&equipements.fitArena=' + props.id
    ), setProprieteReadonly)
}

onMounted(async () => {
  fetchDonnees()
  typeEquipementsSelects.value = await getTypeEquipements(
    1,
    '&categoryTypeEquipement.code=motorise'
  )
  selectableModes.value = await getModes({ 'categoryTypeEquipement.code': 'motorisé' })
})

watch(() => props.id, async() => await fetchDonnees())

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
      '&categoryTypeEquipement.code=motorise&equipements.fitArena='+ props.id
  )
  typeEquipementsSelects.value = await getTypeEquipements(
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
  if (!equipement.value.hasOwnProperty('equipementModes'))
    equipement.value.equipementModes = []
  equipement.value.equipementModes.push(mode)
}

const removeEquipementConfiguration = (equipementModes, i) => {
  equipementModes.splice(i, 1)
}

const saveEquipement = () => {
  if (!isValid(validation)) return

  equipmentTemp.value = {
    typeEquipement: '/api/type_equipements/' + equipement_selected.value,
    fitArena: '/api/fit_arenas/' + props.id,
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
    props.id,
    1,
    '&typeEquipement.categoryTypeEquipement.code=motorise&fitArena.id='+ props.id
  )
  typeEquipements.value = await getTypeEquipements(
    1,
      '&categoryTypeEquipement.code=motorise&equipements.fitArena='+ props.id
  )
  typeEquipementsSelects.value = await getTypeEquipements(
      1,
      '&categoryTypeEquipement.code=motorise'
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
      '&typeEquipement.categoryTypeEquipement.code=motorise&fitArena.id='+ props.id
  )
  typeEquipements.value = await getTypeEquipements(
    1,
      '&categoryTypeEquipement.code=motorise&equipements.fitArena='+ props.id
  )
  typeEquipementsSelects.value = await getTypeEquipements(
      1,
      '&categoryTypeEquipement.code=motorise'
  )
}

const cancel = () => {
  equipement.value = {}
  id_selected.value = 0
  equipement_selected.value = {}
}
</script>

<style scoped>
.label-text {
  --tw-text-opacity: 1;
  color: rgb(17 24 39 / var(--tw-text-opacity));
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.title-conf {
  font-family: 'Esphimere', 'sans-serif';
}
</style>
