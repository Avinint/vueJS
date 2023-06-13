<template>
  <Card class="space-y-3">
    <h1>Organisme</h1>

    <div class="relative overflow-x-auto">
      <table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead
          class="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <th scope="col" class="px-6 py-3"></th>
            <th scope="col" class="px-6 py-3">Nom</th>
            <th scope="col" class="px-6 py-3">Code postal</th>
            <th scope="col" class="px-6 py-3">Ville</th>
            <th scope="col" class="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(organisme, i) in organismes" :key="i" class="bg-white">
            <td class="flex items-center justify-center p-3">
              <Button v-if="isAdmin || isGestCo"
                test="TdeleteClient"
                borderless
                icon="delete"
                couleur="secondary"
                @click="removeOrganisme(organisme.id)"
              />
              <Button
                test="TeditClient"
                borderless
                icon="edit"
                couleur="secondary"
                @click="editOrganisme(i)"
              />
            </td>
            <td class="px-6 py-4">{{ organisme.libelle }}</td>
            <td class="px-6 py-4">{{ organisme.adresse.codePostal }}</td>
            <td class="px-6 py-4">{{ organisme.adresse.ville }}</td>
            <td class="px-6 py-4">
              <Button
                label="Détails"
                couleur="secondary"
                @click="showOrganisme(i)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Button v-if="isAdmin || isGestCo"
      id="TaddOrganisme"
      label="Ajouter un Organisme"
      icon="add"
      couleur="secondary"
      @click="addOrganisme"
    />
  </Card>
  <form @submit.prevent="saveOrganisme">
    <Modal
      v-if="afficherFormulaire"
      :type="readonly ? 'visualiser' : 'classic'"
      :title="modal_title"
      @cancel="cancel()"
    >
      <Card class="w-full space-y-2">
        <h3>Ajouter un organisme</h3>
        <div class="flex items-center"></div>
        <div class="flex items-center">
          <Input
            id="TfaNom"
            v-model="name"
            :readonly="readonly"
            :type="'text'"
            label="Nom"
            :required="true"
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
                class="h-5 w-5 text-gray-500 dark:text-gray-400"
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
            class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
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
            :type="'text'"
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
            :type="'text'"
            :required="true"
            label="Code postal"
            class="w-full"
            pattern="[0-9]{5}"
          />
        </div>
        <div class="flex items-center">
          <Input
            v-if="address_selected"
            id="TadresseCity"
            v-model="address_selected.city"
            :readonly="readonly"
            :type="'text'"
            :required="true"
            label="Ville"
            class="w-full"
            pattern="[A-Za-zÉéÈèËëÊêÀàÂâÄäÛûùÖöÔôÎîÏï -]{1,50}"
          />
        </div>
        <div v-if="address_selected" class="flex items-center">
          <div class="flex w-1/2 items-center justify-between">
            <label class="block w-1/2 text-sm font-medium text-gray-900"
              >Latitude</label
            >
            <p class="text-sm text-blue-400">Format : 46.7897</p>
          </div>
          <input
            id="TfaLatitude"
            v-model="address_selected.latitude"
            :readonly="readonly"
            type="text"
            class="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            pattern="-?[0-9]{1,2}\.[0-9]{1,10}"
          />
        </div>
        <div v-if="address_selected" class="flex items-center">
          <div class="flex w-1/2 items-center justify-between">
            <label class="block w-1/2 text-sm font-medium text-gray-900"
              >Longitude</label
            >
            <p class="text-sm text-blue-400">Format : 46.7897</p>
          </div>
          <input
            v-if="address_selected"
            id="TfaLongitude"
            v-model="address_selected.longitude"
            :readonly="readonly"
            type="text"
            class="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            pattern="-?[0-9]{1,2}\.[0-9]{1,10}"
          />
        </div>
          <div v-if="isAdmin && !readonly" class="flex items-center">
              <label for="TclientSelect" class="mb-2 block w-1/2 text-sm font-medium text-gray-900">Client :</label>
              <select
                  v-if="clients.length"
                  id="TclientSelect"
                  v-model="client"
                  class=" w-full block rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              >
                  <option v-for="client in clients" :key="i" :value="`/api/clients/${client.id}`">
                      {{ client.nom }}
                  </option>
              </select>
        </div>
        <div class="flex items-center">
              <span class="mb-2 block w-4/12 text-sm font-medium text-gray-900">Actif :</span>
          <label class="relative inline-flex cursor-pointer items-center">
            <input
              v-model="actif"
              :disabled="readonly"
              type="checkbox"
              :value="true"
              class="peer sr-only"
            />
            <div
              class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"
            ></div>
            <!-- <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span> -->
          </label>
        </div>
      </Card>

      <Card class="space-y-2">
        <h3>Comptes gestionnaires</h3>
        <Card
          v-for="(gestionnaire, i) in gestionnairesOrganisme"
          :key="i"
          class="relative space-y-2"
        >
          <Button
            v-if="!readonly && i !== 0"
            id="Grr"
            class="absolute right-2 top-2 border-0"
            icon="delete"
            couleur="secondary"
            size="s"
            @click="removeManager(i)"
          />
          <div class="flex items-center pt-6">
            <Input
              id="TcomNom"
              v-model="gestionnaire.nom"
              :readonly="readonly"
              :type="'text'"
              label="Nom"
              class="w-full"
              :required="true"
            />
          </div>
          <div class="flex items-center">
            <Input
              id="TcomPrenom"
              v-model="gestionnaire.prenom"
              :readonly="readonly"
              :type="'text'"
              label="Prénom"
              class="w-full"
              :required="true"
            />
          </div>
          <div class="flex items-center">
            <Input
              id="TcomMail"
              v-model:valid="validation.email"
              v-model="gestionnaire.email"
              :readonly="readonly"
              :type="'text'"
              label="Email"
              class="w-full"
              :required="true"
              :validation="[emailValidation]"
            />
          </div>
        </Card>

        <Button
          v-if="!readonly"
          id="TaddOrgaManager"
          label="Ajouter un compte gestionnaire"
          icon="add"
          couleur="secondary"
          @click="gestionnairesOrganisme.push({})"
        />
      </Card>
    </Modal>
  </form>

  <form @submit.prevent="deleteOrganismeValidation()">
    <ValidationModal
      v-if="modaleConfirmation === 'delete'"
      type="delete"
      @cancel="modaleConfirmation = false"
    >
    </ValidationModal>
  </form>

  <form @submit.prevent="updateOrganismeValidation()">
    <ValidationModal
      v-if="modaleConfirmation === 'edit'"
      type="edit"
      @cancel="modaleConfirmation = false"
    >
    </ValidationModal>
  </form>

  <form @submit.prevent="addOrganismeValidation()">
    <ValidationModal
      v-if="modaleConfirmation === 'add'"
      type="add"
      @cancel="modaleConfirmation = false"
    >
    </ValidationModal>
  </form>
</template>

<script setup>
import Card from '../components/common/Card.vue'
import Modal from '../components/common/Modal.vue'
import ValidationModal from '../components/common/ValidationModal.vue'
import Button from '../components/common/Button.vue'
import Input from '../components/common/Input.vue'
import { getAdresses } from '../api/address.js'
import {
  deleteOrganismes,
  getOrganismes,
  getOrganismesParClient,
  postOrganismes,
  updateOrganismes,
} from '../api/organisme.ts'
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import { watchDebounced } from '@vueuse/core'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { isValid, emailValidation } from "@/validation.js";
import { selectClients } from "@api/client.js";
import { useUserStore } from "@/stores/user.js";
const { isAdmin, isGestCo } = useUserStore();

const route = useRoute()
const modaleConfirmation = ref(false)
const afficherFormulaire = ref(false)
const readonly = ref(false)

const organismes = ref([])

const delete_modal = ref(false)
const deleteOrganismeId = ref(0)
const organisme = ref({})
const edit_modal = ref(false)
const add_modal = ref(false)

const id_selected = ref(0)
const name = ref('')
const complement = ref('')
const actif = ref(false)
const addresses = ref([])
const address = ref('')
const address_selected = ref({})
const modal_title = ref('')
const client = ref({})
const clients = ref([])
const validation = ref({})

const gestionnairesOrganisme = ref([])

onBeforeRouteUpdate(async (to, from) => {
  // on recharge le composant si l'id change
  if ((to.params?.id ?? false) && to.params.id !== from.params.id) {
    organismes.value = await getOrganismesParClient(route.params.id)
  }
})

onMounted(async () => {
  if (route.name === 'organismes') {
    organismes.value = await getOrganismes()
  } else {
    organismes.value = await getOrganismesParClient(route.params.id)
  }

  if (isAdmin) {
    clients.value = await selectClients();
  }
})

const addOrganisme = () => {
  reset()
  gestionnairesOrganisme.value = [{ nom: '', prenom: '', email: '' }]
  afficherFormulaire.value = true
  readonly.value = false
  modal_title.value = 'Ajouter un Organisme'
}

const reset = async () => {
  name.value = []
  complement.value = ''
  actif.value = false
  address.value = ''
  id_selected.value = 0
  address_selected.value = {}
  client.value = {}
}

const cancel = () => {
  reset()
  afficherFormulaire.value = false
}

const removeOrganisme = (id) => {
  deleteOrganismeId.value = id
  modaleConfirmation.value = 'delete'
  // delete_modal.value = true
}

const deleteOrganismeValidation = async (id) => {
  try {
    await deleteOrganismes(deleteOrganismeId.value)
    toast.success('Suppression effectuée avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }
  modaleConfirmation.value = false
  deleteOrganismeId.value = 0
  organismes.value = await getOrganismes()
}

const editOrganisme = (i) => {
  const organisme = organismes.value[i]
  mapApiToData(organisme)
  afficherFormulaire.value = true
  readonly.value = false
  modal_title.value = 'Modifier un organisme'
}

const showOrganisme = async (i) => {
  const organisme = organismes.value[i]
  mapApiToData(organisme)
  afficherFormulaire.value = true
  readonly.value = true
  modal_title.value = 'Informations de l organisme'
}

const mapApiToData = (organisme) => {
  name.value = organisme.libelle
  actif.value = organisme.actif
  client.value = organisme.client
  gestionnairesOrganisme.value = organisme.gestionnaireOrganismes ?? []
  address_selected.value = {
    address: organisme.adresse.adresse,
    postcode: organisme.adresse.codePostal,
    complement: organisme.adresse.complement,
    pays: 'france',
    city: organisme.adresse.ville,
    citycode: organisme.adresse.codeInsee,
    latitude: organisme.adresse.latitude,
    longitude: organisme.adresse.longitude,
  }

  address.value = address_selected.value.address
  complement.value = address_selected.value.complement
  id_selected.value = organisme.id
}

const saveOrganisme = () => {
  if (!isValid(validation)) return
  organisme.value = {
    libelle: name.value,
    actif: actif.value,
    client: client.value,
    gestionnaireOrganismes: gestionnairesOrganisme.value,

    adresse: {
      adresse: address_selected.value.label,
      complement: complement.value,
      codePostal: address_selected.value.postcode,
      ville: address_selected.value.city,
      pays: 'france',
      codeInsee: '' + address_selected.value.citycode,
      latitude: '' + address_selected.value.latitude,
      longitude: '' + address_selected.value.longitude,
      numeroDepartement: '' + address_selected.value.context?.split(',')[0],
      nomDepartement: '' + address_selected.value.context?.split(',')[1],
    },
  }

  gestionnairesOrganisme.value = []

  if (id_selected.value) {
    modaleConfirmation.value = 'edit'
  } else {
    modaleConfirmation.value = 'add'
  }
}

const updateOrganismeValidation = async () => {
  try {
    await updateOrganismes(organisme, id_selected.value)
    toast.success('Modification effectuée avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }

  modaleConfirmation.value = false
  afficherFormulaire.value = false
  cancel()
  organismes.value = await getOrganismes()
}

const addOrganismeValidation = async () => {
  try {
    await postOrganismes(organisme)
    toast.success('Ajout effectué avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }

  modaleConfirmation.value = false
  afficherFormulaire.value = false
  cancel()
  organismes.value = await getOrganismes()
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

const removeManager = (i) => {
  removeFrom(gestionnairesOrganisme, i)
}

const removeFrom = (refArray, i) => {
  refArray.value = refArray.value
    .slice(0, i)
    .concat(refArray.value.slice(i + 1))
}
</script>
