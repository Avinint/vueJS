<template>
  <Card class="space-y-3">
    <h1> Mes groupes d'Adhérents</h1>
    <Card :shadow="false" class="overflow-hidden" v-for="(groupe, key) in groupes" :key="key">
      <div class="flex items-center gap-4 mb-4">
        <LabelText :text="groupe.libelle"/>
        <Input placeholder="Rechercher"/>
        <Button couleur="secondary" label="Filtrer" />
        <Button couleur="secondary" label="Modifier le groupe" />
      </div>
      <Table :columns="table_columns" :data="getGroupTableData(groupe)"/>
    </Card>
    <Button
      id="TaddGroupe"
      label="Ajouter un Groupe"
      icon="add"
      couleur="secondary"
      @click="create"
    />
  </Card>
  <form @submit.prevent="save">
    <Modal
      v-if="afficherFormulaire"
      :type="readonly ? 'visualiser' : 'classic'"
      :title="modal_title"
      @cancel="cancel()"
    >
      <Card class="w-full space-y-2">
        <!--        <h3>Ajouter un adhérent</h3>-->

        <div class="flex items-center">
          <Input
            id="TadhNom"
            v-model="nom"
            :readonly="readonly"
            type="text"
            label="Nom"
            :required="true"
            class="w-full"
          />
        </div>
        <div class="flex items-center">
          <Input
            id="TadhPrenom"
            v-model="prenom"
            :readonly="readonly"
            type="text"
            label="Prénom"
            :required="true"
            class="w-full"
          />
        </div>
        <div class="flex items-center">
          <div class="mr-1.5 w-half block"><label for="TadhDateNaissance">Date de naissance</label></div>
          <div class="w-half">
            <vue-tailwind-datepicker placeholder="JJ/MM/AAAA" v-model="dateNaissance" :disabled="readonly"  :formatter="formatter" as-single required />
          </div>
        </div>

        <div v-if="!readonly" class="flex items-center">
          <div class="mr-1.5 w-half block"><label for="TadhGenre">Genre</label></div>
          <div class="w-half">
            <select
              id="TadhGenre"
              v-model="genre"
              class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
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

        </div>

        <div class="flex items-center">
          <Input
            id="TadhNumero"
            v-model="numero"
            :readonly="readonly"
            type="text"
            label="Numéro"
            :required="true"
            class="w-full"
          />
        </div>

        <div class="flex items-center">
          <Input
            id="TadhLicence"
            v-model="licence"
            :readonly="readonly"
            type="text"
            label="Licence"
            :required="true"
            class="w-full"
          />
        </div>

        <div class="flex items-center">
          <div class="mr-1.5 w-half block"><label for="TadhDateAdhesion">Date d'adhésion</label></div>
          <div class="w-half">
            <vue-tailwind-datepicker placeholder="JJ/MM/AAAA" v-model="dateAdhesion" :disabled="readonly"  :formatter="formatter" as-single required />
          </div>
        </div>

        <div class="flex items-center">
          <div class="mr-1.5 w-half block"><label for="TadhDateFinAdhesion">Date de fin d'adhésion</label></div>
          <div class="w-half">
            <vue-tailwind-datepicker placeholder="JJ/MM/AAAA" v-model="dateFinAdhesion" :disabled="readonly"  :formatter="formatter" as-single   />
          </div>
        </div>

        <div v-if="!readonly" class="flex items-center">
          <div class="mr-1.5 w-half block"><label for="TadhGroupes">Groupe(s)</label></div>
          <div class="w-half">
            <select
                multiple
                id="TadhGroupes"
                v-model="groupes"
                class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
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
                id="TclientAdresse"
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
              required
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
              label="Code Postal"
              class="w-full"
              :required="true"
              :validation="[zipValidation]"
          />
        </div>
        <div class="flex items-center">
          <Input
              v-if="address_selected"
              id="TadresseCity"
              v-model="address_selected.city"
              :readonly="readonly"
              :type="'text'"
              label="Ville"
              class="w-full"
              :required="true"
              :validation="[cityValidation]"
          />
        </div>
        <div class="flex items-center">
          <Input
              id="TadhTelephone"
              v-model="telephone"
              :readonly="readonly"
              :type="'text'"
              label="Numéro de téléphone"
              class="w-full"
              :validation="[phoneValidation]"
          />
        </div>
        <div class="flex items-center">
          <Input
              id="TadhEmail"
              v-model="email"
              v-model:valid="validation.email"
              :readonly="readonly"
              :type="'text'"
              label="Email"
              class="w-full"
              :validation="[emailValidation]"
          />
        </div>

      </Card>
    </Modal>
  </form>

  <form @submit.prevent="removeValidation(0)">
    <ValidationModal
      v-if="modaleConfirmation"
      type="delete"
      @cancel="modaleConfirmation = false"
    >
    </ValidationModal>
  </form>

  <form @submit.prevent="update()">
    <ValidationModal
      v-if="modaleConfirmation"
      type="edit"
      @cancel="modaleConfirmation = false"
    >
    </ValidationModal>
  </form>

  <form @submit.prevent="add()">
    <ValidationModal
      v-if="modaleConfirmation"
      type="add"
      @cancel="modaleConfirmation = false"
    >
    </ValidationModal>
  </form>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import VueTailwindDatepicker from 'vue-tailwind-datepicker'
import Card from '../components/common/Card.vue'
import Modal from '../components/common/Modal.vue'
import ValidationModal from '../components/common/ValidationModal.vue'
import Button from '../components/common/Button.vue'
import Input from '../components/common/Input.vue'
import { getAdresses } from '../api/address.js'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import {
  fetchGroupes
} from '../api/groupe.js'

import { onMounted, reactive, ref, watch } from 'vue'
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
import Table, { type FaTableColumnData } from '../components/common/Table.vue'
import { deleteAdherent, getAdherentsParOrganisme, postAdherent, putAdherent } from '@api/adherent'
import { getDateDMY } from '../services/date_service'
import type { FaTableRow } from '../components/common/Table.vue'
import LabelText from '@components/common/LabelText.vue'

const table_columns: FaTableColumnData<Adherent>[] = [
  {label: 'Nom et Prénom', data: e => `${e.nom} ${e.prenom}`},
  {label: 'Date de naissance', data: e => getDateDMY(e.dateNaissance)},
  {label: "Numéro d'adhérent", data: e => e.numeroAdherent},
  {label: "Date d'adhésion", data: e => getDateDMY(e.dateAdhesion)},
  {label: "Date de fin d'adhésion", data: e => getDateDMY(e.dateFinAdhesion)},
  {label: "Groupes", data: e => e.groupes.map(g => g.libelle).join(', ')}
]

function getGroupTableData(groupe: Groupe): FaTableRow<Adherent>[] {
  return groupe.adherents.map(adherent => {
    return {
      data: adherent,
      editable: false,
      removable: false,
    }
  })
}

const modaleConfirmation = ref(false)
const afficherFormulaire = ref(false)
const readonly = ref(false)
const genres = [
  { code: 'nr', libelle: 'Non renseigné' },
  { code: 'm', libelle: 'Homme' },
  { code: 'f', libelle: 'Femme' },
]

const formatter = {
  date: import.meta.env.VITE_DATE_FORMAT,
  month: 'MMM'
}
const dateFormatFr = import.meta.env.VITE_DATE_FORMAT_FR
const dateFormatBdd = import.meta.env.VITE_DATE_FORMAT_BDD

const adherents = ref([])
const mode = ref<'add' | 'edit' | 'delete'>('add');

const delete_modal = ref(false)
const deleteAdherentId = ref(0)
const adherent = ref({})
const edit_modal = ref(false)
const add_modal = ref(false)

const id_selected = ref(0)
const nom = ref('')
const prenom = ref('')
const dateNaissance = ref<string>("")
const genre = ref('nr')

const numero = ref("")
const licence = ref("")
const dateAdhesion = ref("")
const dateFinAdhesion = ref("")
const groupes = ref<Groupe[]>([])

const addresses = ref<any[]>([])
const address = ref('')
const address_selected = ref<any>({})
const complement = ref('')

const email = ref('')
const telephone = ref('')
const titulaireCarte = ref(false)
const organismeId = ref(0)
const organisme = ref({})

const modal_title = ref('')
const client = ref({})
const validation = ref<any>({})
const organismes = ref([])


const route = useRoute()
onMounted(async () => {
  organismeId.value = parseInt(route.params?.id as string)
  if (organismeId.value > 0) {
    groupes.value = await fetchGroupes(organismeId.value)
    console.log(groupes.value)
  }

})

const afficherDate = (date: Date) => dayjs(date).format(dateFormatFr)

const create = () => {
  reset()
  afficherFormulaire.value = true
  readonly.value = false
  modal_title.value = 'Ajouter un Groupe'
}

const reset = async () => {
  nom.value = ''
  prenom.value = ''
  email.value = ''
  telephone.value = ''
  id_selected.value = 0
  numero.value = ""
  licence.value = ""
  dateNaissance.value = ""
  address.value = '',
  address_selected.value = {}
}

// const desactiverCarte = () => {
//   carteActive.value.actif = false
// }

const cancel = () => {
  reset()
  afficherFormulaire.value = false
}

const remove = (id: number) => {
  deleteAdherentId.value = id
  modaleConfirmation.value = false
  // delete_modal.value = true
}

const removeValidation = async (id: number) => {
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

// TODO: Fix typing
const edit = (adherent: any) => {
  mapApiToData(adherent)
  afficherFormulaire.value = true
  readonly.value = false
  modal_title.value = 'Modifier un adhérent'
}

const show = async (i: number) => {
  const adherent = adherents.value[i]
  mapApiToData(adherent)
  afficherFormulaire.value = true
  readonly.value = true
  modal_title.value = "Informations de l'adhérent"
}

// TODO: Fix typing
const mapApiToData = (adherent: any) => {
  nom.value = adherent.nom
  prenom.value = adherent.prenom
  numero.value =adherent.numeroAdherent
  licence.value =adherent.licence
  email.value = adherent.email
  telephone.value = adherent.telephone
  genre.value = adherent.genre
  id_selected.value = adherent.id
  address_selected.value = {
    address: adherent.adresse.adresse,
    postcode: adherent.adresse.codePostal,
    complement: adherent.adresse.complement,
    pays: 'France',
    city: adherent.adresse.ville,
    citycode: adherent.adresse.codeInsee,
    latitude: adherent.adresse.latitude,
    longitude: adherent.adresse.longitude,
  }
  address.value = address_selected.value.address
  complement.value = address_selected.value.complement
  dateNaissance.value = dayjs(adherent.dateNaissance).format('DD/MM/YYYY')
  dateAdhesion.value = dayjs(adherent.dateAdhesion).format('DD/MM/YYYY')
  dateFinAdhesion.value = dayjs(adherent.dateFinAdhesion).format('DD/MM/YYYY')
  groupes.value = adherent.groupes
}

const save = () => {
  if (!isValid(validation)) return
  adherent.value = {
    nom: nom.value,
    prenom: prenom.value,
    mail: email.value,
    telephone: telephone.value,
    dateNaissance:dateNaissance.value.length ?  dayjs(dateNaissance.value[0], 'DD/MM/YYYY').format('YYYY-MM-DD') : null,
    dateAdhesion: dateAdhesion.value.length ? dayjs(dateAdhesion.value[0], 'DD/MM/YYYY').format('YYYY-MM-DD') : null,
    dateFinAdhesion: dateFinAdhesion.value.length ? dayjs(dateFinAdhesion.value[0], 'DD/MM/YYYY').format('YYYY-MM-DD') : null,
    idOrganisme: organismeId.value,
    genre: genre.value,
    groupes: groupes.value,
    numeroAdherent: numero.value,
    licence: licence.value,
    adresse: {
      adresse: address_selected.value.label,
      codePostal: address_selected.value.postcode,
      ville: address_selected.value.city,
      pays: 'france',
      codeInsee: '' + address_selected.value.citycode,
      latitude: '' + address_selected.value.latitude,
      longitude: '' + address_selected.value.longitude,
      numeroDepartement: '' + address_selected.value.context.split(',')[0],
      nomDepartement: '' + address_selected.value.context.split(',')[1],
      complement: complement.value,
    },
  }

  if (id_selected.value) {
    modaleConfirmation.value = false
  } else {
    modaleConfirmation.value = false
  }
}

const update = async () => {
  try {
    await putAdherent(adherent, id_selected.value)
    toast.success('Modification effectuée avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }

  modaleConfirmation.value = false
  afficherFormulaire.value = false

  adherents.value = await getAdherentsParOrganisme(organismeId.value)
}

const add = async () => {
  try {
    await postAdherent(adherent)
    toast.success('Ajout effectué avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }

  modaleConfirmation.value = false
  afficherFormulaire.value = false

  adherents.value = await getAdherentsParOrganisme(organismeId.value)
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

const addressSelect = () => {
  address.value = address_selected.value.label
}

</script>
