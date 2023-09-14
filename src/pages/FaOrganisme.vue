<template>
    <CrudList
      entity="organisme"
      plural="organismes"
      :columns="crud_columns"
      :data="getTableData()"
      :can-all="isAdmin || isGestCo"
      @entity:new="addOrganisme"
      @entity:edit="editOrganisme"
      @entity:remove="removeOrganisme"
    />

    <form @submit.prevent="saveOrganisme">
      <Modal
        v-if="afficherFormulaire"
        :type="readonly ? 'visualiser' : 'classic'"
        :title="modal_title"
        @cancel="cancel()"
      >
        <CardModalSection title="Informations générales">
          <div class="space-y-2">
            <div class="flex items-center">
              <Input
                id="TfaNom"
                v-model="name"
                :readonly="readonly"
                :type="'text'"
                label="Nom"
                :required="true"
                class="w-full"
                inline
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
            <div v-if="!readonly && address.length" class="flex items-center">
              <div class="mr-1.5 block w-1/2"></div>
              <select
                id="TorgaSelectAdresse"
                v-model="address_selected"
                class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                @change="addressSelect"
              >
                <option v-for="(address, i) in addresses" :key="i" :value="address">
                  {{ address.label }}
                </option>
              </select>
            </div>
            <template v-if="address_selected">
              <Input
                id="TadresseComplement"
                v-model="complement"
                :readonly="readonly"
                :type="'text'"
                label="Complément"
                class="w-full"
                inline
              />
              <Input
                id="TadressePostcode"
                v-model="address_selected.postcode"
                :readonly="readonly"
                :type="'text'"
                required
                label="Code postal"
                class="w-full"
                pattern="[0-9]{5}"
                inline
              />
              <Input
                id="TadresseCity"
                v-model="address_selected.city"
                :readonly="readonly"
                :type="'text'"
                required
                label="Ville"
                class="w-full"
                pattern="^[a-zA-ZÀ-ÿœ\- ]{1,50}$"
                inline
              />
              <Input
                inline
                label="Latitude"
                v-model="address_selected.latitude"
                :readonly="readonly"
                type="text"
                class="w-full"
                pattern="-?[0-9]{1,2}\.[0-9]{1,10}"
              />
              <Input
                id="TfaLongitude"
                v-model="address_selected.longitude"
                :readonly="readonly"
                type="text"
                label="Longitude"
                inline
                class="w-full"
                pattern="-?[0-9]{1,2}\.[0-9]{1,10}"
              />
            </template>
            <div v-if="isAdmin && !readonly" class="flex items-center">
              <label
                for="TclientSelect"
                class="mb-2 block w-1/2 text-sm font-medium text-gray-900"
              >Client :</label
              >
              <select
                v-if="clients.length"
                id="TclientSelect"
                v-model="client"
                class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              >
                <option
                  v-for="(client, i) in clients"
                  :key="i"
                  :value="client.id"
                >
                  {{ client.nom }}
                </option>
              </select>
            </div>
            <div class="flex items-center">
          <span class="mb-2 block w-4/12 text-sm font-medium text-gray-900"
          >Actif :</span
          >
              <label class="relative inline-flex cursor-pointer items-center">
                <input
                  v-model="actif"
                  :disabled="readonly"
                  type="checkbox"
                  :value="true"
                  class="peer sr-only"
                />
                <div
                  class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"
                ></div>
                <!-- <span class="ml-3 text-sm font-medium text-gray-900></span> -->
              </label>
            </div>
          </div>
        </CardModalSection>
        <CardModalSection title="Comptes gestionnaires">
          <div v-if="donneesPDF !== null" class="offset">
            <CarteAcces ref="templatePDF" :carte="donneesPDF"/>
          </div>
          <Card
            v-for="(gestionnaire, i) in gestionnairesOrganisme"
            :key="i"
            class="relative space-y-2 my-5"
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
                inline
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
                inline
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
                inline
              />
            </div>
            <div class="h-4"/>
            <CardModalSection title="Carte d'accès">
                <div class="my-6 flex items-center">
                  <p class="w-4/12 label-text"
                  >Titulaire d'une carte d'accès :</p
                  >
                  <label class="relative inline-flex cursor-pointer items-center">
                    <input
                      v-model="gestionnaire.titulaireCarte"
                      :disabled="readonly"
                      type="checkbox"
                      :value="false"
                      class="peer sr-only"
                    />
                    <div
                      class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"
                    ></div>
                  </label>
                </div>
                <div class="flex items-center"  v-if="gestionnaire.titulaireCarte">
                  <Input
                    id="TcodePin"
                    v-model="gestionnaire.codePin"
                    inline
                    :readonly="readonly"
                    pattern="\d{6}"
                    label="Code PIN"
                    class="w-full"
                    max-length="6"
                    min-length="6"
                    :validation="[codePinValidation]"
                    v-model:valid="validation.codePin"
                    required
                  />
                </div>
            </CardModalSection>
            <CardModalSection class="pt-6" v-if="gestionnaire.afficherCarte" title="Qr code">
                <div>
                  <p class="text-info">Le gestionnaire peut retrouver son QR code sur son profil Fit Arena en se connectant à fit-arena.fr via l’adresse mail renseignée ci-dessus.</p>
                  <div class="flex items-center justify-between mt-10">
                    <div v-if="gestionnaire.infoCarte?.qrCode" class="w-3/12 p-4 ml-2 ring-2 ring-offset-4 rounded-lg ring-gray-200">
                      <img
                        alt="QR CODE Fit Arena"
                        :src="gestionnaire.infoCarte?.qrCode"
                      />
                    </div>
                    <div class="w-8/12">
                      <ButtonRight
                        id="TGestOrgQRCodeImprimer"
                        icon="print"
                        couleur="danger"
                        class="w-full"
                        label="Imprimer le QR Code"
                        @click="imprimerPdf(gestionnaire)"
                      />
                    </div>
                  </div>
                </div>
            </CardModalSection>
          </Card>

          <Button
            v-if="!readonly"
            id="TaddOrgaManager"
            label="Ajouter un compte gestionnaire"
            icon="add"
            couleur="danger"
            @click="gestionnairesOrganisme.push({})"
          />
        </CardModalSection>
        <MentionChampsObligatoires/>
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

import { nextTick, computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { watchDebounced } from '@vueuse/core'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { isValid, emailValidation, codePinValidation } from '@/validation.js'
import { selectClients } from '@api/client.js'
import { useUserStore } from '@/stores/user.js'
import CrudList from '@components/molecules/CrudList.vue'
import CarteAcces from "@/pdf/CarteAcces.vue";
import { getCarteAcces } from "@api/carte_acces.js";
import MentionChampsObligatoires from "@components/common/MentionChampsObligatoires.vue";
import CardModalSection from "@components/common/CardModalSection.vue";
import ButtonRight from "@components/common/ButtonRight.vue";

const { isAdmin, isGestCo } = useUserStore()
const crud_columns = [
  { data: (e) => e.libelle, label: 'Nom' },
  { data: (e) => e.adresse.codePostal, label: 'Code Postal' },
  { data: (e) => e.adresse.ville, label: 'Ville' },
]
function getTableData() {
  return organismes.value.map((organisme) => {
    return {
      data: organisme,
      editable: true,
      removable: true,
    }
  })
}

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

const templatePDF = ref(null);
const donneesPDF = ref(null)

watch(() => route.params, async () => {
  getOrganismesParClient(route.params.id).then(response => {
    organismes.value = response;
  })
})

const idClient = computed(() => route.params.id)

onMounted(async () => {
  if (route.name === 'organismes') {
    organismes.value = await getOrganismes()
  } else {
    organismes.value = await getOrganismesParClient(route.params.id)
  }

  if (isAdmin) {
    clients.value = await selectClients()
  }
})

const addOrganisme = () => {
  client.value = idClient.value
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
  donneesPDF.value = null
}

const cancel = () => {
  reset()
  afficherFormulaire.value = false
}

const removeOrganisme = (organisme) => {
  deleteOrganismeId.value = organisme.id
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
  organismes.value = await getOrganismesParClient(idClient.value)
}

const editOrganisme = (organisme) => {
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
  modal_title.value = 'Informations de l\'organisme'
}

const mapApiToData = (organisme) => {

  name.value = organisme.libelle
  actif.value = organisme.actif
  client.value = idClient.value
  gestionnairesOrganisme.value = organisme.gestionnaireOrganismes?.map(gest =>  ({
    afficherCarte: !!gest.codePin?.length,
    titulaireCarte: !!gest.codePin?.length,
    ...gest})) ??  []


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
    client: 'api/clients/' + client.value,
    gestionnaireOrganismes: gestionnairesOrganisme.value,
    adresse: {
      adresse: address_selected.value.name,
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
  organismes.value = await getOrganismesParClient(idClient.value)
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
  organismes.value = await getOrganismesParClient(idClient.value)
}

watchDebounced(
  address,
  async () => {
    address_selected.value = {}
    try {
      addresses.value = await getAdresses(address.value)
    } catch (e) {}
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

const getDonneesCarte = async (gestionnaire) => {
  return (await getCarteAcces(gestionnaire.infoCarte.id)) ?? null
}

const imprimerPdf = async (gestionnaire) => {
  donneesPDF.value = await getDonneesCarte(gestionnaire)
  await nextTick()
  templatePDF.value.imprimer()
}

const addressSelect = (event) => {
  address.value  = address_selected.value.name
}

</script>

<style scoped>
 .offset {
   position: absolute;
   right: -2000px;
 }
</style>