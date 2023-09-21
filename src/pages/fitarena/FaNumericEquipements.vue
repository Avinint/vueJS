<template>
  <Card>
    <h1 class="mb-6">équipements numériques de la fit arena</h1>
    <div v-for="(typeEquipement, i) in typeEquipements" :key="`type_equipement-`+ i">
      <CardModalSection :title="typeEquipement.libelle" class="border border-gray-200 pr-6 py-6 rounded-lg mb-6">
        <template #content>
          <div class="pl-8">
            <table class="w-full text-left text-sm text-gray-500 border border-gray-200">
              <thead
                class="text-xs text-gray-700 bg-gray-200"
              >
                <tr>
                  <th scope="col" class="px-6 py-3">Statut</th>
                  <th scope="col" class="px-6 py-3">Libellé</th>
                  <th scope="col" class="px-6 py-3">Adresse IP</th>
                  <th scope="col" class="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(type, i) in typeEquipement.equipements" :key="`type_equipement-equipements-` + i" class="bg-white">
                  <td class="px-6 py-4 flex gap-4">
                    <p class="w-16">{{ type.statut ? 'Actif' : 'Inactif' }}</p>
                    <label class="relative inline-flex cursor-pointer items-center">
                      <input
                        v-model="type.statut"
                        type="checkbox"
                        value="true"
                        class="peer sr-only"
                        @change="modifieEquipement(type)"
                      />
                      <div
                        class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"
                      ></div>
                      <span
                        class="ml-3 text-sm font-medium text-gray-900"
                      ></span>
                    </label>
                  </td>
                  <td class="px-6 py-4">{{ type.libelle }}</td>
                  <td class="px-6 py-4">{{ type.ip }}</td>
                  <td class="flex items-center justify-end p-3 gap-8">
                    <Button
                      test="TshowEquipement"
                      borderless
                      icon="info"
                      couleur="secondary"
                      @click="showEquipement(type.id)"
                    />
                    <Button
                      test="TeditEquipement"
                      borderless
                      icon="edit"
                      couleur="secondary"
                      @click="editEquipement(type.id)"
                    />
                    <Button
                      test="TdeleteEquipement"
                      borderless
                      icon="delete"
                      couleur="secondary"
                      @click="removeEquipement(type.id)"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </CardModalSection>
    </div>
    <ButtonRight
      id="TaddEquipement"
      label="Ajouter un équipement numérique"
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
      <div class="w-full items-center flex justify-between">
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
      <MentionChampsObligatoires v-if="!readonly" />
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

<script setup lang="ts">
import Card from '../../components/common/Card.vue'
import CardConfiguration from '../../components/common/CardConfiguration.vue'
import Modal from '../../components/common/Modal.vue'
import ValidationModal from '../../components/common/ValidationModal.vue'
import Button from '../../components/common/Button.vue'
import ButtonRight from '../../components/common/ButtonRight.vue'
import Input from '../../components/common/Input.vue'
import MentionChampsObligatoires from "@components/common/MentionChampsObligatoires.vue"
import CardModalSection from '@components/common/CardModalSection.vue'
import Table from '@components/common/Table.vue'

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
import { getModes } from "@api/mode.js";

import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const fitArenaId = parseInt(useRoute().params.id)
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

function getGroupTableData(typeEquipement) {
  return typeEquipement.equipements.map((type: any) => {
    return {
      id: type.id,
      data: type,
      editable: true,
      removable: true,
      readable: true
    }
  })
}

const table_columns = [
  { label: 'Actif', data: (e) => e.statut },
  { label: 'Libellé', data: (e) => e.libelle },
  { label: 'Adresse IP', data: (e) => e.ip }
]

onMounted(async () => {
  equipements.value = await getEquipements(
    fitArenaId,
    1,
      '&typeEquipement.categoryTypeEquipement.code=numerique&fitArena.id='+ fitArenaId
  )
  typeEquipements.value = setEquipementModes(
    await getTypeEquipements(
      1,
      '&categoryTypeEquipement.code=numerique&equipements.fitArena=' + fitArenaId
    ), setProprieteReadonly)

  typeEquipementsSelects.value = await getTypeEquipements(
    1,
    '&categoryTypeEquipement.code=numerique'
  )
  selectableModes.value = await getModes({ 'categoryTypeEquipement.code': 'numerique' })
})

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
  modal_title.value = 'Ajouter un équipement numérique'
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
    '&typeEquipement.categoryTypeEquipement.code=numerique'
  )
  typeEquipements.value = await getTypeEquipements(
    1,
      '&categoryTypeEquipement.code=numerique&equipements.fitArena='+ fitArenaId
  )
  typeEquipementsSelects.value = await getTypeEquipements(
      1,
      '&categoryTypeEquipement.code=numerique'
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
    fitArena: '/api/fit_arenas/' + fitArenaId,
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
    fitArenaId,
    1,
    '&typeEquipement.categoryTypeEquipement.code=numerique&fitArena.id='+ fitArenaId
  )
  typeEquipements.value = await getTypeEquipements(
    1,
      '&categoryTypeEquipement.code=numerique&equipements.fitArena='+ fitArenaId
  )
  typeEquipementsSelects.value = await getTypeEquipements(
      1,
      '&categoryTypeEquipement.code=numerique'
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
      '&typeEquipement.categoryTypeEquipement.code=numerique&fitArena.id='+ fitArenaId
  )
  typeEquipements.value = await getTypeEquipements(
    1,
      '&categoryTypeEquipement.code=numerique&equipements.fitArena='+ fitArenaId
  )
  typeEquipementsSelects.value = await getTypeEquipements(
      1,
      '&categoryTypeEquipement.code=numerique'
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
</style>