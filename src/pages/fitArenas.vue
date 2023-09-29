<template>
  <Card class="space-y-3">
    <h1>Fit Arena</h1>

    <div class="relative overflow-x-auto">
      <table class="w-full text-left text-sm text-gray-500">
        <thead
          class="bg-gray-50 text-xs text-gray-700"
        >
          <tr>
            <th scope="col" class="px-6 py-3">Nom</th>
            <th scope="col" class="px-6 py-3">Code postal</th>
            <th scope="col" class="px-6 py-3">Ville</th>
            <th scope="col" class="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(fit_arena, i) in fit_arenas" :key="i" class="bg-white">
            <td class="px-6 py-4">{{ fit_arena.libelle }}</td>
            <td class="px-6 py-4">{{ fit_arena.adresse.codePostal }}</td>
            <td class="px-6 py-4">{{ fit_arena.adresse.ville }}</td>
            <td class="flex items-center justify-center p-3 gap-4">
              <Button
              test="TeditClient"
              borderless
              icon="edit"
              couleur="secondary"
              @click="editFa(i)"
              />
              <Button
                test="TdeleteClient"
                borderless
                icon="delete"
                couleur="secondary"
                @click="removeFa(fit_arena.id)"
              />
            </td>
            <!-- <td class="px-6 py-4">
              <Button label="Détails" couleur="secondary" @click="showFa(i)" />
            </td> -->
          </tr>
        </tbody>
      </table>
    </div>
    <ButtonRight
      id="TaddFitArena"
      label="Ajouter une Fit Arena"
      icon="add"
      couleur="danger"
      @click="addFa"
    />
  </Card>
  <form @submit.prevent="saveFA">
    <Modal
      v-if="fa_modal"
      :type="readonly ? 'visualiser' : 'classic'"
      :title="modal_title"
      @cancel="(fa_modal = false), cancel()"
    >
      <div class="flex items-center">
        <label class="mb-2 block w-1/2 text-sm font-medium text-gray-900"
          >Client</label
        >
        <select
          v-if="clients.length"
          id="TfaSelectCollectivite"
          v-model="client_selected"
          :disabled="readonly == true ? true : false"
          class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
        >
          <option v-for="client in clients" :key="client.id" :value="client.id">
            {{ client.nom }}
          </option>
        </select>
      </div>
      <div class="flex items-center">
        <Input
          id="TfaNom"
          v-model="name"
          :readonly="readonly"
          :type="'text'"
          label="Nom"
          :inline="true"
          required
          class="w-full"
        />
      </div>
      <div class="flex items-center">
        <label class="mb-2 block w-1/2 text-sm font-medium text-gray-900"
          >Adresse</label
        >
        <div class="relative w-full">
          <div
            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
          >
            <svg
              aria-hidden="true"
              class="h-5 w-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <input
            id="TfaAdresse"
            v-model="address"
            :readonly="readonly"
            type="search"
            class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            data-dropdown-toggle="dropdown"
            placeholder="Rue, ville, ..."
            required
          />
        </div>
      </div>
      <div v-if="!readonly" class="flex items-center">
        <div class="mr-1.5 block w-1/2"></div>
        <select
          v-if="address.length"
          id="TclientSelectAdresse"
          v-model="address_selected"
          class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          @change="addressSelect"
        >
          <option v-for="(address, i) in addresses" :key="i" :value="address">
            {{ address.label }}
          </option>
        </select>
      </div>
      <div class="flex items-center">
        <Input
          id="TadresseComplement"
          v-model="complement"
          :readonly="readonly"
          type="text"
          :inline="true"
          label="Complément"
          class="w-full"
        />
      </div>
      <div class="flex items-center">
        <Input
          v-if="address_selected"
          id="TadressePostcode"
          v-model="address_selected.postcode"
          :readonly="readonly"
          type="text"
          required
          :inline="true"
          label="Code postal"
          class="w-full"
          :validation="[zipValidation]"
        />
      </div>
      <div class="flex items-center">
        <Input
          v-if="address_selected"
          id="TadresseCity"
          v-model="address_selected.city"
          :readonly="readonly"
          type="text"
          :inline="true"
          required
          label="Ville"
          class="w-full"
          :validation="[cityValidation]"
        />
      </div>
      <div class="flex items-center">
        <InputDescription
          v-if="address_selected"
          id="TfaLatitude"
          v-model="address_selected.latitude"
          :readonly="readonly"
          type="text"
          required
          label="Latitude"
          description="Format : 46.7897"
          class="w-full"
          :validation="[latitudeAndLongitudeValidation]"
        />
      </div>
      <div v-if="address_selected" class="flex items-center">
        <InputDescription
          v-if="address_selected"
          id="TfaLongitude"
          v-model="address_selected.longitude"
          :readonly="readonly"
          type="text"
          required
          label="Longitude"
          description="Format : 46.7897"
          class="w-full"
          :validation="[latitudeAndLongitudeValidation]"
        />
      </div>
      <div class="flex items-center">
        <label class="mb-2 block w-1/2 text-sm font-medium text-gray-900"
          >Commentaire</label
        >
        <textarea
          v-model="commentaire"
          :readonly="readonly"
          class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
        ></textarea>
      </div>
      <div class="flex items-center">
        <span class="mb-2 block w-4/12 text-sm font-medium text-gray-900"
          >Actif :</span
        >
        <label class="relative inline-flex cursor-pointer items-center">
          <input
            v-model="actif"
            :disabled="readonly == true ? true : false"
            type="checkbox"
            value="true"
            class="peer sr-only"
          />
          <div
            class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"
          ></div>
          <!-- <span class="ml-3 text-sm font-medium text-gray-900"></span> -->
        </label>
      </div>
      <MentionChampsObligatoires/>
    </Modal>
  </form>

  <form @submit.prevent="deleteFitArenaValidation(deleteFitArenaId)">
    <ValidationModal
      v-if="delete_modal"
      type="delete"
      @cancel="delete_modal = false"
    >
    </ValidationModal>
  </form>

  <form @submit.prevent="updateFitArenaValidation()">
    <ValidationModal v-if="edit_modal" type="edit" @cancel="edit_modal = false">
    </ValidationModal>
  </form>

  <form @submit.prevent="addFitArenaValidation()">
    <ValidationModal v-if="add_modal" type="add" @cancel="add_modal = false">
    </ValidationModal>
  </form>
</template>

<script setup>
import Card from '../components/common/Card.vue'
import Modal from '../components/common/Modal.vue'
import ValidationModal from '../components/common/ValidationModal.vue'
import ButtonRight from '../components/common/ButtonRight.vue'
import Button from '../components/common/Button.vue'
import Input from '../components/common/Input.vue'
import InputDescription from '../components/common/InputDescription.vue'
import { getAdresses } from '../api/address.js'
import { getClients } from '../api/client.js'
import {
  deleteFitArenas,
  getFitArenas,
  postFitArenas,
  updateFitarenas,
} from '../api/fit-arena.js'
import {
  isValid,
  zipValidation,
  cityValidation,
  latitudeAndLongitudeValidation,
} from '../validation.js'
import { onMounted, ref, watch } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import MentionChampsObligatoires from "@components/common/MentionChampsObligatoires.vue";
import { useMenuStore } from "@stores/menu.js";

const { fitArenas: menuFitArenas } = useMenuStore()
const fa_modal = ref(false)
const readonly = ref(false)

const clients = ref([])

const fit_arenas = ref([])

const delete_modal = ref(false)
const deleteFitArenaId = ref(0)
const fit_arena = ref({})
const edit_modal = ref(false)
const add_modal = ref(false)

const client_selected = ref({})
const id_selected = ref(0)
const name = ref('')
const commentaire = ref('')
const complement = ref('')
const actif = ref('')
const addresses = ref([])
const address = ref('')
const address_selected = ref({})
const modal_title = ref('')
const validation = ref({})

onMounted(async () => {
  fit_arenas.value = await getFitArenas()
  clients.value = await getClients()
})

const addFa = () => {
  cancel()
  fa_modal.value = true
  readonly.value = false
  modal_title.value = 'Ajouter une Fit Arena'
}

const cancel = async () => {
  name.value = ''
  commentaire.value = ''
  complement.value = ''
  actif.value = ''
  address.value = []
  id_selected.value = ''
  address_selected.value = {}
  client_selected.value = {}
  deleteFitArenaId.value = 0
}

const removeFa = (id) => {
  deleteFitArenaId.value = id
  delete_modal.value = true
}

const deleteFitArenaValidation = async (id) => {
  try {
    await deleteFitArenas(id)
    toast.success('Suppression effectuée avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }

  const index = menuFitArenas.findIndex(fit => fit.id ===  deleteFitArenaId.value)
  menuFitArenas.splice(index, 1)

  delete_modal.value = false
  deleteFitArenaId.value = 0
  fit_arenas.value = await getFitArenas()
}

const editFa = (i) => {
  const fitArena = fit_arenas.value[i]
  mapApiToData(fitArena)
  fa_modal.value = true
  readonly.value = false
  modal_title.value = 'Modifier une Fit Arena'
}

const showFa = async (i) => {
  const fitArena = fit_arenas.value[i]
  mapApiToData(fitArena)
  fa_modal.value = true
  readonly.value = true
  modal_title.value = 'Informations de la Fit Arena'
}

const mapApiToData = (fitArena) => {
  name.value = fitArena.libelle
  actif.value = fitArena.actif
  address_selected.value = {
    address: fitArena.adresse.adresse,
    postcode: fitArena.adresse.codePostal,
    complement: fitArena.adresse.complement,
    pays: 'france',
    city: fitArena.adresse.ville,
    citycode: fitArena.adresse.codeInsee,
    latitude: fitArena.adresse.latitude,
    longitude: fitArena.adresse.longitude,
  }
  address.value = address_selected.value.address
  complement.value = address_selected.value.complement
  client_selected.value = fitArena.client.id
  commentaire.value = fitArena.commentaire
  id_selected.value = fitArena.id
}

const saveFA = () => {
  if (!isValid(validation)) return

  fit_arena.value = {
    client: 'api/clients/' + client_selected.value,
    commentaire: commentaire.value,
    ordre: 1,
    libelle: name.value,
    actif: actif.value == true ? actif.value : false,

    adresse: {
      adresse: address_selected.value.name,
      complement: complement.value,
      codePostal: address_selected.value.postcode,
      ville: address_selected.value.city,
      pays: 'france',
      codeInsee: '' + address_selected.value.citycode,
      latitude: '' + address_selected.value.latitude,
      longitude: '' + address_selected.value.longitude,
      numeroDepartement: '' + address_selected.value.context.split(',')[0],
      nomDepartement: '' + address_selected.value.context.split(',')[1],
    },
  }

  if (id_selected.value) {
    edit_modal.value = true
  } else {
    add_modal.value = true
  }
}

const updateFitArenaValidation = async () => {
  try {
    await updateFitarenas(fit_arena.value, id_selected.value)
    toast.success('Modification effectuée avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }

  edit_modal.value = false
  fa_modal.value = false
  cancel()
  fit_arenas.value = await getFitArenas()
}

watch(() => fit_arena.value.libelle, () => {
  const fitArenaMenu = menuFitArenas.find((fit) => fit.id === id_selected.value)
  if (fitArenaMenu) {
    fitArenaMenu.libelle = fit_arena.value.libelle
  }
})

const addFitArenaValidation = async () => {
  try {
    await postFitArenas(fit_arena.value)
    toast.success('Ajout effectué avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }

  add_modal.value = false
  fa_modal.value = false
  cancel()
  fit_arenas.value = await getFitArenas()

  const nouvelle = fit_arenas.value.find(fit => fit.libelle ===  fit_arena.value.libelle)
  menuFitArenas.push({id: nouvelle.id, libelle: nouvelle.libelle, open: false})
}

watchDebounced(
  address,
  async () => {
    address_selected.value = {}
    addresses.value = await getAdresses(address.value)
    address_selected.value = addresses.value[0]
  },
  { debounce: 500, maxWait: 1000 }
)

const addressSelect = (event) => {
  address.value  = address_selected.value.name
}
</script>
