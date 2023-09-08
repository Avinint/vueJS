<template>
   <CrudList
    entity="adhérent"
    plural="adhérents"
    :columns="crud_columns"
    :data="getTableData()"
    :can-all="isAdmin || isGestCo || isGestOrg"
    @entity:new="createAdherent"
    @entity:edit="editAdherent"
    @entity:remove="removeAdherent"
  />
  <form @submit.prevent="saveAdherent">
    <Modal
      v-if="afficherFormulaire"
      :type="readonly ? 'visualiser' : 'classic'"
      :title="modal_title"
      @cancel="cancel()"
    >
      <CardModalSection title="ÉTAT CIVIL">
        <template #content>
          <Input
            id="TadhNom"
            v-model="nom"
            :readonly="readonly"
            type="text"
            label="Nom"
            :inline="true"
            placeholder="Nom"
            class="mb-4"
            required
          />
          <Input
            id="TadhPrenom"
            v-model="prenom"
            :readonly="readonly"
            type="text"
            label="Prénom"
            :inline="true"
            placeholder="Prénom"
            class="mb-4"
            required
          />
          <div class="flex items-center mb-4">
            <label class="w-1/2 label-text" for="TadhDateNaissance">Date de naissance</label>
            <vue-tailwind-datepicker placeholder="JJ/MM/AAAA" v-model="dateNaissance" :disabled="readonly" :formatter="formatter" as-single />
          </div>
          <div class="flex items-center">
            <label class="w-1/2 label-text" for="TadhGenre">Genre</label>
            <select
              id="TadhGenre"
              v-model="genre"
              class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            >
              <option
                v-for="unGenre in genres"
                :key="unGenre.code"
                :value="unGenre.code"
              >
                {{ unGenre.libelle }}
              </option>
            </select>
          </div>
        </template>
      </CardModalSection>
      <CardModalSection title="ADHÉSION">
        <template #content>
          <Input
            id="TadhNumero"
            v-model="numero"
            :readonly="readonly"
            type="text"
            label="Numéro d'adhérent"
            :inline="true"
            placeholder="000023"
            class="mb-4"
          />
          <Input
            id="TadhLicence"
            v-model="licence"
            :readonly="readonly"
            type="text"
            label="Licence"
            :inline="true"
            class="mb-4"
          />
          <div class="flex items-center mb-4">
            <label class="w-1/2 label-text" for="TadhDateAdhesion">Date d'adhésion</label>
            <vue-tailwind-datepicker placeholder="JJ/MM/AAAA" v-model="dateAdhesion" :disabled="readonly" :formatter="formatter" as-single />
          </div>
          <div class="flex items-center mb-4">
            <label class="w-1/2 label-text" for="TadhDateFinAdhesion">Date de fin d'adhésion</label>
            <vue-tailwind-datepicker placeholder="JJ/MM/AAAA" v-model="dateFinAdhesion" :disabled="readonly" :formatter="formatter" as-single />
          </div>
          <div class="flex items-center mb-4">
            <label class="w-1/2 label-text" for="TadhGroupes">Groupe(s)</label>
            <select
              id="TadhGroupes"
              v-model="groupes"
              class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            >
              <option
                v-for="unGroupe in listeGroupes"
                :key="unGroupe.id"
                :value="unGroupe"
              >
                {{ unGroupe.libelle }}
              </option>
            </select>
          </div>
        </template>
      </CardModalSection>
      <CardModalSection title="COORDONNÉES">
        <template #content>
          <Input
            id="TadhEmail"
            v-model="email"
            v-model:valid="validation.email"
            :readonly="readonly"
            :type="'text'"
            label="Email"
            :inline="true"
            class="mb-4"
            :validation="[emailValidation]"
          />
          <div class="flex items-center mb-4">
            <label class="mb-2 block w-1/2 text-sm font-medium text-gray-900"
            >Adresse</label>
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
                id="TclientAdresse"
                v-model="address"
                :readonly="readonly"
                type="search"
                class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                data-dropdown-toggle="dropdown"
                placeholder="Rue, ville, ..."
              />
            </div>
          </div>
          <div class="flex items-center mb-4">
            <div class="w-1/2"></div>
            <div v-if="!readonly" class="w-full">
              <div class="mr-1.5 block w-1/2"></div>
              <select
                v-if="address && address.length"
                id="TclientSelectAdresse"
                v-model="address_selected"
                class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                @change="addressSelect"
              >
                <option
                  v-for="(address, i) in addresses"
                  :key="i"
                  :value="address"
                >
                  {{ address.label }}
                </option>
              </select>
            </div>
          </div>
          <Input
            v-if="address && address.length"
            id="TadresseComplement"
            v-model="complement"
            :readonly="readonly"
            :type="'text'"
            label="Complément"
            :inline="true"
            class="mb-4"
          />
          <Input
            v-if="address && address.length"
            id="TadressePostcode"
            v-model="address_selected.postcode"
            :readonly="readonly"
            type="text"
            label="Code Postal"
            class="mb-4"
            :inline="true"
            :validation="[zipValidation]"
          />
          <Input
            v-if="address && address.length"
            id="TadresseCity"
            v-model="address_selected.city"
            :readonly="readonly"
            type="text"
            label="Ville"
            class="mb-4"
            :inline="true"
            :validation="[cityValidation]"
          />
          <Input
            id="TadhTelephone"
            v-model="telephone"
            :readonly="readonly"
            type="text"
            label="Numéro de téléphone"
            class="mb-4"
            :inline="true"
            :validation="[phoneValidation]"
          />
        </template>
      </CardModalSection>
      <MentionChampsObligatoires class="ml-4" />
    </Modal>
  </form>

  <form @submit.prevent="removeAdherentValidation()">
    <ValidationModal
      v-if="modaleConfirmation === 'delete'"
      type="delete"
      @cancel="modaleConfirmation = false"
    >
    </ValidationModal>
  </form>

  <form @submit.prevent="updateAdherent()">
    <ValidationModal
      v-if="modaleConfirmation === 'edit'"
      type="edit"
      @cancel="modaleConfirmation = false"
    >
    </ValidationModal>
  </form>

  <form @submit.prevent="addAdherent()">
    <ValidationModal
      v-if="modaleConfirmation === 'add'"
      type="add"
      @cancel="modaleConfirmation = false"
    >
    </ValidationModal>
  </form>
</template>

<script setup>
import dayjs from 'dayjs'
import VueTailwindDatepicker from 'vue-tailwind-datepicker'
import CrudList from '@components/molecules/CrudList.vue'
import Card from '../components/common/Card.vue'
import Modal from '../components/common/Modal.vue'
import CardModalSection from '@components/common/CardModalSection.vue'
import ValidationModal from '../components/common/ValidationModal.vue'
import Button from '../components/common/Button.vue'
import Input from '../components/common/Input.vue'
import { getAdresses } from '../api/address.js'
import { useUserStore } from '@/stores/user.js'

import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import {
  deleteAdherent,
  getAdherentsParOrganisme,
  postAdherent,
  putAdherent,
  selectGroupes
} from '../api/adherent.ts'
import { selectOrganismes } from '../api/organisme.ts'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import {
  isValid,
  emailValidation,
  zipValidation,
  cityValidation,
  phoneValidation
} from '@/validation.js'
import MentionChampsObligatoires from "@components/common/MentionChampsObligatoires.vue";
const { isAdmin, isGestCo, isGestOrg } = useUserStore()

const modaleConfirmation = ref(false)
const afficherFormulaire = ref(false)
const readonly = ref(false)
const genres = [
  { code: 'f', libelle: 'Femme' },
  { code: 'm', libelle: 'Homme' },
]

const crud_columns = [
  { data: (e) => e.nom, label: 'Nom et prénom' },
  { data: (e) => dayjs(e.dateNaissance).format(dateFormatFr), label: 'Date de naissance' },
  { data: (e) => e.licence, label: 'Licence' },
  { data: (e) => dayjs(e.dateAdhesion).format(dateFormatFr), label: 'Date d\'adhésion' },
  { data: (e) => e.groupes, label: 'Groupe(s)' },
]

const dateFormatFr = import.meta.env.VITE_DATE_FORMAT_FR
const dateFormatBdd = import.meta.env.VITE_DATE_FORMAT_BDD

const formatter = {
  date: dateFormatFr,
  month: 'MMM'
}

const adherents = ref([])
const delete_modal = ref(false)
const deleteAdherentId = ref(0)
const adherent = ref({})
const edit_modal = ref(false)
const add_modal = ref(false)

const id_selected = ref(0)
const nom = ref('')
const prenom = ref('')
const dateNaissance = ref([])
const genre = ref('nr')

const numero = ref(null)
const licence = ref(null)
const dateAdhesion = ref([])
const dateFinAdhesion = ref([])
const groupes = ref([])

const addresses = ref([])
const address = ref('')
const address_selected = ref({})
const complement = ref('')

const email = ref('')
const telephone = ref('')
const titulaireCarte = ref(false)
const organismeId = ref(0)
const organisme = ref({})
const carteActive = ref({ codePin: null, actif: false })
const modal_title = ref('')
const client = ref({})
const validation = ref({})
const organismes = ref([])
const listeGroupes = ref([])


function getTableData() {
  return adherents.value.map((adherent) => {
    return {
      data: adherent,
      editable: true,
      removable: true,
    }
  })
}

const route = useRoute()
onMounted(async () => {
  organismeId.value = parseInt(route.params?.id)
  if (organismeId.value > 0) {
    adherents.value = await getAdherentsParOrganisme(organismeId.value)
    listeGroupes.value = (await selectGroupes(organismeId.value)).map(g => ({id: g.id, libelle: g.libelle}))
  }})

const startFrom = (value) => {
  let date;
  if (value === null || value.length === 0) {
    return dayjs().date(1);
  }

  return dayjs(value[0], dateFormatFr).date(1);
}

const createAdherent = () => {
  afficherFormulaire.value = true
  readonly.value = false
  modal_title.value = 'Ajouter un Adhérent'
}

const reset = async () => {
  nom.value = ''
  prenom.value = ''
  email.value = ''
  telephone.value = ''
  id_selected.value = 0
  numero.value = null
  licence.value = null
  dateNaissance.value = []
  address.value = '',
  address_selected.value = {}
  groupes.value = []
}

// const desactiverCarte = () => {
//   carteActive.value.actif = false
// }

const cancel = () => {
  reset()
  afficherFormulaire.value = false
}

const removeAdherent = (adherent) => {
  deleteAdherentId.value = adherent.id
  modaleConfirmation.value = 'delete'
}

const removeAdherentValidation = async () => {
  try {
    await deleteAdherent(deleteAdherentId.value)
    toast.success('Suppression effectuée avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }
  modaleConfirmation.value = false
  deleteAdherentId.value = 0
  adherents.value = await getAdherentsParOrganisme(organismeId.value)
}

const editAdherent = (adherent) => {
  mapApiToData(adherent)
  afficherFormulaire.value = true
  readonly.value = false
  modal_title.value = 'Modifier un adhérent'
}

const showAdherent = async (i) => {
  const adherent = adherents.value[i]
  mapApiToData(adherent)
  afficherFormulaire.value = true
  readonly.value = true
  modal_title.value = "Informations de l'adhérent"
}

const mapApiToData = (adherent) => {
  nom.value = adherent.nom
  prenom.value = adherent.prenom
  numero.value =adherent.numeroAdherent
  licence.value =adherent.licence
  email.value = adherent.email
  telephone.value = adherent.telephone
  genre.value = adherent.genre
  id_selected.value = adherent.id
  address_selected.value =  adherent.adresse ? {
    address: adherent.adresse.adresse,
    postcode: adherent.adresse.codePostal,
    complement: adherent.adresse.complement,
    pays: 'France',
    city: adherent.adresse.ville,
    citycode: adherent.adresse.codeInsee,
    latitude: adherent.adresse.latitude,
    longitude: adherent.adresse.longitude,
  } : {}

  address.value = address_selected.value?.address
  complement.value = address_selected.value?.complement
  dateNaissance.value = [dayjs(adherent.dateNaissance).format(dateFormatFr)]
  dateAdhesion.value = [dayjs(adherent.dateAdhesion).format(dateFormatFr)]
  dateFinAdhesion.value = [dayjs(adherent.dateFinAdhesion).format(dateFormatFr)]
  groupes.value = adherent.groupes
}

const afficherDate = (date) => dayjs(date).format(dateFormatFr)

const saveAdherent = () => {
  if (!isValid(validation)) return

  const adresseSaisie = Object.keys(address_selected.value).length

  adherent.value = {
    nom: nom.value,
    prenom: prenom.value,
    mail: email.value,
    telephone: telephone.value,
    dateNaissance:dateNaissance.value.length ?  dayjs(dateNaissance.value[0], dateFormatFr).format(dateFormatBdd) : null,
    dateAdhesion: dateAdhesion.value.length ? dayjs(dateAdhesion.value[0], dateFormatFr).format(dateFormatBdd) : null,
    dateFinAdhesion: dateFinAdhesion.value.length ? dayjs(dateFinAdhesion.value[0], dateFormatFr).format(dateFormatBdd) : null,
    idOrganisme: organismeId.value,
    genre: genre.value,
    groupes: groupes.value,
    numeroAdherent: numero.value,
    licence: licence.value,
    adresse: adresseSaisie ? {
      adresse: address_selected.value.label,
      codePostal: address_selected.value.postcode,
      ville: address_selected.value.city,
      pays: 'france',
      codeInsee: '' + address_selected.value.citycode,
      latitude: '' + address_selected.value.latitude,
      longitude: '' + address_selected.value.longitude,
      numeroDepartement: '' + address_selected.value.context?.split(',')[0],
      nomDepartement: '' + address_selected.value.context?.split(',')[1],
      complement: complement.value,
    } : null
  }

  if (id_selected.value) {
    modaleConfirmation.value = 'edit'
  } else {
    modaleConfirmation.value = 'add'
  }
}

const updateAdherent = async () => {
  try {
    await putAdherent(adherent, id_selected.value)
    toast.success('Modification effectuée avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }

  modaleConfirmation.value = false
  afficherFormulaire.value = false
  cancel()
  adherents.value = await getAdherentsParOrganisme(organismeId.value)
}

const addAdherent = async () => {
  try {
    await postAdherent(adherent)
    toast.success('Ajout effectué avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }

  modaleConfirmation.value = false
  afficherFormulaire.value = false
  cancel()
  adherents.value = await getAdherentsParOrganisme(organismeId.value)
}

watchDebounced(
    address,
    async () => {
      address_selected.value = {}
      addresses.value = await getAdresses(address.value)
      address_selected.value = addresses.value[0] ?? {}
    },
    { debounce: 500, maxWait: 1000 }
)

const addressSelect = () => {
  address.value = address_selected.value.label
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