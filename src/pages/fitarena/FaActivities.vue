<template>
  <Card class="space-y-3">
    <h1>Activités pratiquables dans la fit arena</h1>

    <div class="relative overflow-x-auto">
      <table class="w-full text-left text-sm text-gray-500">
        <thead
          class="text-xs text-gray-700 bg-gray-200"
        >
          <tr>
            <th scope="col" class="px-6 py-3">Statut</th>
            <th scope="col" class="px-6 py-3">Libellé</th>
            <th scope="col" class="px-6 py-3">Ordre</th>
            <th scope="col" class="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(act, i) in activites" :key="i" class="bg-white">
            <td class="px-6 py-4 flex gap-4">
              <p class="w-16">{{ act.actif ? 'Active' : 'Inactive' }}</p>
              <label class="relative inline-flex cursor-pointer items-center">
                <input
                  v-model="act.actif"
                  type="checkbox"
                  value="true"
                  class="peer sr-only"
                  @change="modifieActivite(act)"
                />
                <div
                  class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"
                ></div>
                <span
                  class="ml-3 text-sm font-medium text-gray-900"
                ></span>
              </label>
            </td>
            <td class="px-6 py-4">{{ act.libelle }}</td>

            <td class="px-6 py-4">{{ act.ordre }}</td>
            <td class="flex items-center justify-end p-3 gap-10">
              <div @click="showActivite(i)" class="cursor-pointer px-3 py-2">
                <img src="/src/assets/info.svg" />
              </div>
              <Button
                test="TeditActivite"
                borderless
                icon="edit"
                couleur="secondary"
                @click="editActivite(i)"
              />
              <Button
                test="TdeleteActivite"
                borderless
                icon="delete"
                couleur="secondary"
                @click="removeActivite(act.id)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <ButtonRight
      id="TaddActivite"
      label="Ajouter une activité"
      icon="add"
      couleur="danger"
      @click="addActivite"
    />
  </Card>
  <form @submit.prevent="saveActivite">
    <Modal
      v-if="activite_modal"
      :type="readonly ? 'visualiser' : 'classic'"
      :title="modal_title"
      @cancel="activite_modal = false"
    >
      <div class="flex items-center">
        <label class="mb-2 block w-1/2 text-sm font-medium text-gray-900"
          >Type d'activité</label
        >
        <select
          v-if="typeActivites.length"
          id="TTypeActivite"
          v-model="activite_selected"
          :disabled="readonly == true ? true : false"
          class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
        >
          <option
            v-for="(typeActivite, i) in typeActivites"
            :key="i"
            :value="typeActivite.id"
          >
            {{ typeActivite.libelle }}
          </option>
        </select>
      </div>
      <div class="flex items-center">
        <Input
          id="TActiviteLibelle"
          v-model="activite.libelle"
          :readonly="readonly"
          type="text"
          label="Nom"
          :inline="true"
          required
          class="w-full"
        />
      </div>
      <div class="flex items-center">
        <p class="label-text w-1/2">Type de réservation</p>
        <div class="w-full flex items-center justify-between">
          <span class="text-sm font-medium text-gray-900"
            >Réservation individuelle</span
          >
          <label class="relative inline-flex cursor-pointer items-center">
            <input
              v-model="activite.reservationDeGroupe"
              :disabled="readonly == true ? true : false"
              type="checkbox"
              value="true"
              class="peer sr-only"
            />
            <div
              class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"
            ></div>
          </label>
          <span class="ml-3 text-sm font-medium text-gray-900"
            >Réservation de groupe</span
          >
        </div>
      </div>
      <div class="flex items-center">
        <Input
          v-if="!readonly"
          id="TActiviteOrdre"
          v-model="activite.ordre"
          type="number"
          label="Ordre"
          :inline="true"
          class="w-full"
        />
        <Input
          v-else
          id="TActiviteOrdre"
          v-model="activite.ordre"
          readonly
          type="text"
          label="Ordre"
          class="w-full"
        />
      </div>
      <div class="flex items-center">
        <!-- <Input :readonly="readonly" id="small_size" :type="'file'" label="Icône" class="w-full" /> -->
        <label
          class="mb-2 block pr-3 w-1/2 text-sm font-medium text-gray-900"
          for="small_size"
          >Icône</label
        >
        <input
          @change="chargeFichier"
          id="small_size"
          class="mb-5 block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-xs text-gray-900 focus:outline-none"
          type="file"
        />
      </div>
      <div class="flex">
        <label class="mb-2 block w-1/2 text-sm font-medium text-gray-900"
          >Description</label
        >
        <textarea
          id="TActiviteDescription"
          v-model="activite.description"
          :readonly="readonly"
          rows="8"
          class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
        ></textarea>
      </div>
      <div class="flex items-center">
        <span class="w-1/2 text-sm font-medium text-gray-900"
          >Rendre active
        </span>
        <label class="relative inline-flex w-full cursor-pointer items-center">
          <input
            v-model="activite.actif"
            :disabled="readonly == true ? true : false"
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
      <MentionChampsObligatoires margin-top="40px"/>
    </Modal>
  </form>

  <form @submit.prevent="deleteActivityValidation(deleteActivityId)">
    <ValidationModal
      v-if="delete_modal"
      type="delete"
      @cancel="delete_modal = false"
    >
    </ValidationModal>
  </form>

  <form @submit.prevent="updateActivityValidation()">
    <ValidationModal v-if="edit_modal" type="edit" @cancel="edit_modal = false">
    </ValidationModal>
  </form>

  <form @submit.prevent="addActivityValidation()">
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
import MentionChampsObligatoires from "@components/common/MentionChampsObligatoires.vue";

import { getTypeActivites } from '../../api/typeActivite.js'
import {
  deleteActivites,
  getActivites,
  postActivites,
  patchActivites,
  uploadActivite,
} from '../../api/activite.ts'

import { computed, onMounted, ref, watch } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

import { useRoute } from 'vue-router'

const props = defineProps(['id'])

const notify = () => {
  toast('Wow so easy !', {
    autoClose: 1000,
  }) // ToastOptions
}

const route = useRoute()

const activite_modal = ref(false)
const readonly = ref(false)

const delete_modal = ref(false)
const deleteActivityId = ref(0)
const edit_modal = ref(false)
const add_modal = ref(false)
const actTemp = ref({})
const id_selected = ref(0)
const fitArenaId = computed(() => route.params.id)
const activites = ref([])
const typeActivites = ref([])
const typeActivite = ref({})
const activite = ref({})
const activite_selected = ref({})
const modal_title = ref('')
const file = ref(null)

onMounted(async () => {
  activites.value = await getActivites(props.id, 1, '&order=asc')
  typeActivites.value = await getTypeActivites()
})

watch(() => props.id, async (  ) => {
  activites.value = await getActivites(props.id, 1, '&order=asc')
})

const addActivite = () => {
  activite.value = {}
  activite_selected.value = {}
  activite_modal.value = true
  readonly.value = false
  modal_title.value = 'Ajouter une activité'
}

const modifieActivite = async ({ actif, id }) => {
  try {
    await patchActivites({ actif }, id)
    toast.success('Modification effectuée avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }
}

const removeActivite = (id) => {
  deleteActivityId.value = id
  delete_modal.value = true
}

const deleteActivityValidation = async (id) => {
  try {
    await deleteActivites(id)
    toast.success('Suppression effectuée avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }

  delete_modal.value = false
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

const saveActivite = () => {
  actTemp.value = {
    typeActivite: '/api/type_activites/' + activite_selected.value,
    fitArena: '/api/fit_arenas/' + fitArenaId.value,
    ordre: parseInt(activite.value.ordre),
    libelle: activite.value.libelle,
    description: activite.value.description,
    actif: activite.value.actif,
    icone: activite.value.icone,
    reservationDeGroupe: activite.value.reservationDeGroupe,
  }
  if (id_selected.value) {
    edit_modal.value = true
  } else {
    add_modal.value = true
  }
}

const chargeFichier = (e) => {activite.value.icone = e.target.files[0]}

const updateActivityValidation = async () => {
  try {
    await uploadActivite(actTemp.value, id_selected.value)
    toast.success('Modification effectuée avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }

  edit_modal.value = false
  activite_modal.value = false
  cancel()
  activites.value = await getActivites(props.id)
  typeActivites.value = await getTypeActivites()
}

const addActivityValidation = async () => {
  try {
    await postActivites(actTemp.value)
    toast.success('Ajout effectué avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }

  add_modal.value = false
  activite_modal.value = false
  cancel()
  activites.value = await getActivites(props.id)
  typeActivites.value = await getTypeActivites()
}

const cancel = () => {
  activite.value = {}
  id_selected.value = 0
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
