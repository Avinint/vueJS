<template>
  <Card class="space-y-3">
    <h1>Activités pratiquables dans la fit arena</h1>

    <div class="relative overflow-x-auto">
      <table class="w-full text-left text-sm text-gray-500">
        <thead
          class="text-xs uppercase text-gray-700"
        >
          <tr>
            <th scope="col" class="px-6 py-3"></th>
            <th scope="col" class="px-6 py-3">Actif</th>
            <th scope="col" class="px-6 py-3">Libellé</th>
            <th scope="col" class="px-6 py-3">Ordre</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(act, i) in activites" :key="i" class="bg-white">
            <td class="flex items-center justify-center p-3">
              <Button
                test="TdeleteClient"
                borderless
                icon="delete"
                couleur="secondary"
                @click="removeActivite(act.id)"
              />
              <Button
                test="TeditClient"
                borderless
                icon="edit"
                couleur="secondary"
                @click="editActivite(i)"
              />
            </td>
            <td class="px-6 py-4">
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
            <td class="px-6 py-4">
              <Button
                label="Détails"
                couleur="secondary"
                @click="showActivite(i)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Button
      id="TaddActivite"
      label="Ajouter une activité"
      icon="add"
      couleur="secondary"
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
          :type="'text'"
          label="Nom"
          :required="true"
          class="w-full"
        />
      </div>
      <div class="flex items-center">
        <!-- <Input :readonly="readonly" id="small_size" :type="'file'" label="Icône" class="w-full" /> -->
        <label
          class="mb-2 block pr-3 text-sm font-medium text-gray-900"
          for="small_size"
          >Icône</label
        >
        <input
          id="small_size"
          class="mb-5 block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-xs text-gray-900 focus:outline-none"
          type="file"
        />
      </div>
      <div class="flex items-center">
        <label class="mb-2 block w-1/2 text-sm font-medium text-gray-900"
          >Description</label
        >
        <textarea
          id="TActiviteDescription"
          v-model="activite.description"
          :readonly="readonly"
          type="text"
          class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          required
        ></textarea>
      </div>
      <div class="flex items-center">
        <Input
          v-if="!readonly"
          id="TActiviteOrdre"
          v-model="activite.ordre"
          :type="'number'"
          label="Ordre"
          :required="true"
          class="w-full"
        />
        <Input
          v-else
          id="TActiviteOrdre"
          v-model="activite.ordre"
          readonly
          :type="'text'"
          label="Ordre"
          class="w-full"
        />
      </div>
      <div class="flex items-center">
        <span class="w-1/2 text-sm font-medium text-gray-900"
          >Actif :
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
      <div class="flex items-center">
        <span class="mr-3 text-sm font-medium text-gray-900"
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
import Input from '../../components/common/Input.vue'
import { getTypeActivites } from '../../api/typeActivite.js'
import {
  deleteActivites,
  getActivites,
  postActivites,
  updateActivites,
  patchActivites,
} from '../../api/activite.ts'
import { onMounted, ref } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import MentionChampsObligatoires from "@components/common/MentionChampsObligatoires.vue";

const props = defineProps(['id'])

const notify = () => {
  toast('Wow so easy !', {
    autoClose: 1000,
  }) // ToastOptions
}

const activite_modal = ref(false)
const readonly = ref(false)

const delete_modal = ref(false)
const deleteActivityId = ref(0)
const edit_modal = ref(false)
const add_modal = ref(false)
const actTemp = ref({})

const id_selected = ref(0)
const activites = ref([])
const typeActivites = ref([])
const typeActivite = ref({})
const activite = ref({})
const activite_selected = ref({})
const modal_title = ref('')

onMounted(async () => {
  activites.value = await getActivites(props.id, 1, '&order=asc')
  typeActivites.value = await getTypeActivites()
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
    fitArena: '/api/fit_arenas/' + props.id,
    ordre: parseInt(activite.value.ordre),
    libelle: activite.value.libelle,
    description: activite.value.description,
    actif: activite.value.actif == true ? activite.value.actif : false,
    icone: activite.value.icone,
    reservationDeGroupe:
      activite.value.reservationDeGroupe == true
        ? activite.value.reservationDeGroupe
        : false,
  }

  if (id_selected.value) {
    edit_modal.value = true
  } else {
    add_modal.value = true
  }
}

const updateActivityValidation = async () => {
  try {
    await updateActivites(actTemp, id_selected.value)
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
