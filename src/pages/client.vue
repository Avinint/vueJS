<template>
  <Card class="space-y-3">
    <h1>Clients</h1>
    <div class="relative overflow-x-auto">
      <table class="w-full text-left text-sm text-gray-500">
        <thead
          class="bg-gray-50 text-xs uppercase text-gray-700"
        >
          <tr>
            <th scope="col" class="px-6 py-3"></th>
            <th scope="col" class="px-6 py-3">Nom</th>
            <th scope="col" class="px-6 py-3">Code postal</th>
            <th scope="col" class="px-6 py-3">Ville</th>
            <th scope="col" class="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(client, i) in clients" :key="i" class="bg-white">
            <td class="flex items-center justify-center p-3">
              <Button
                test="TdeleteClient"
                borderless
                icon="delete"
                couleur="secondary"
                @click="removeClient(client.id)"
              />
              <Button
                test="TeditClient"
                borderless
                icon="edit"
                couleur="secondary"
                @click="editClient(i)"
              />
            </td>
            <td class="px-6 py-4">{{ client.nom }}</td>
            <td class="px-6 py-4">{{ client.adresse.codePostal }}</td>
            <td class="px-6 py-4">{{ client.adresse.ville }}</td>
            <td class="px-6 py-4">
              <Button label="Détails" couleur="secondary" @click="showClient(i)" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Button
      id="TaddClient"
      label="Ajouter un client"
      icon="add"
      icon_placement="right"
      couleur="secondary"
      @click="addClient"
    />

    <form @submit.prevent="saveClient">
      <Modal
        v-if="client_modal"
        :type="readonly ? 'visualiser' : 'classic'"
        :title="modal_title"
        @cancel="client_modal = false"
      >
        <Card class="w-full">
          <h3>Ajouter un client</h3>
          <div class="space-y-2">
            <div class="flex items-center">
              <Input
                id="TclientName"
                v-model="name"
                :readonly="readonly"
                :type="'text'"
                label="Nom"
                class="w-full"
                :required="true"
              />
            </div>

            <div class="flex items-center">
              <label class="required mb-2 block w-1/2 text-sm font-medium text-gray-900"
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
                class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
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
          </div>
        </Card>

        <Card class="space-y-2">
          <h3>Référents d’exploitation</h3>
          <Card
            v-for="(exploit_referent, i) in exploit_referents"
            :key="i"
            class="relative space-y-2"
          >
            <p v-if="error[i]" class="error">
              Au moins un des champs doit être renseigné.
            </p>
            <!-- BOUTON DELETE VISIBLE SEULEMENT EN MODE MODIFICATION / AJOUT, ET À PARTIR DE LA DEUXIÈME ITÉRATION -->
            <Button
              v-if="!readonly && i !== 0"
              class="absolute right-2 top-2 border-0"
              icon="delete"
              couleur="secondary"
              size="s"
              @click="removeExploitReferent(i)"
            />
            <div class="flex items-center pt-6">
              <Input
                id="TrefNom"
                v-model="exploit_referent.nom"
                :readonly="readonly"
                :type="'text'"
                label="Nom"
                class="w-full"
              />
            </div>
            <div class="flex items-center">
              <Input
                id="TrefPrenom"
                v-model="exploit_referent.prenom"
                :readonly="readonly"
                :type="'text'"
                label="Prénom"
                class="w-full"
              />
            </div>
            <div class="flex items-center">
              <Input
                id="TrefFonction"
                v-model="exploit_referent.fonction"
                :readonly="readonly"
                :type="'text'"
                label="Fonction"
                class="w-full"
              />
            </div>
            <div class="flex items-center">
              <Input
                id="TrefTelephone"
                v-model="exploit_referent.telephone"
                :readonly="readonly"
                :type="'text'"
                label="Numéro de téléphone"
                class="w-full"
                :validation="[phoneValidation]"
              />
            </div>
            <div class="flex items-center">
              <Input
                id="TrefEmail"
                v-model="exploit_referent.email"
                v-model:valid="validation.email"
                :readonly="readonly"
                :type="'text'"
                label="Email"
                class="w-full"
                :validation="[emailValidation]"
              />
            </div>
          </Card>
          <Button
            v-if="!readonly"
            id="TaddRefExploit"
            label="Ajouter un référent d'exploitation supplémentaire"
            icon="add"
            couleur="secondary"
            @click="exploit_referents.push({})"
          />
        </Card>

        <Card class="space-y-2">
          <h3>Comptes gestionnaires</h3>
          <Card
            v-for="(community_manager, i) in community_managers"
            :key="i"
            class="relative space-y-2"
          >
            <!-- BOUTON DELETE VISIBLE SEULEMENT EN MODE MODIFICATION / AJOUT, ET À PARTIR DE LA DEUXIÈME ITÉRATION -->
            <Button
              v-if="!readonly && i !== 0"
              class="absolute right-2 top-2 border-0"
              icon="delete"
              couleur="secondary"
              size="s"
              @click="removeCommunityManager(i)"
            />
            <div class="flex items-center pt-6">
              <Input
                id="TcomNom"
                v-model="community_manager.nom"
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
                v-model="community_manager.prenom"
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
                v-model="community_manager.email"
                v-model:valid="validation.email2"
                :readonly="readonly"
                label="Email"
                class="w-full"
                :required="true"
                :validation="[emailValidation]"
              />
            </div>
            <div class="flex items-center">
              <Input
                id="TcodePin"
                v-model="community_manager.codePin"
                :readonly="readonly"
                type="text"
                pattern="\d{6}"
                label="Code pin carte d'accès"
                class="w-full"
                max-length="6"
                min-length="6"
                :validation="[codePinValidation]"
                v-model:valid="validation.codePin"
                :required="false"
              />
            </div>
            <div v-if="community_manager.qrCode" class="flex items-center">
              <img
                alt="qr code"
                :src="community_manager.qrCode"
              />
            </div>
            <div>
              <Button
                  id="TImprimeComManager"
                  label="Imprimer la carte"
                  icon="print"
                  couleur="primary"
                  @click=""
              />
            </div>
          </Card>
          <Button
            v-if="!readonly"
            id="TaddComManager"
            label="Ajouter un compte supplémentaire"
            icon="add"
            couleur="secondary"
            @click="community_managers.push({})"
          />
        </Card>
        <MentionChampsObligatoires/>
      </Modal>
    </form>

    <form @submit.prevent="deleteClientValidation(deleteClientId)">
      <ValidationModal
        v-if="delete_modal"
        type="delete"
        @cancel="delete_modal = false"
      >
      </ValidationModal>
    </form>

    <form @submit.prevent="updateClientValidation()">
      <ValidationModal
        v-if="edit_modal"
        type="edit"
        @cancel="edit_modal = false"
      >
      </ValidationModal>
    </form>

    <form @submit.prevent="addClientValidation()">
      <ValidationModal v-if="add_modal" type="add" @cancel="add_modal = false">
      </ValidationModal>
    </form>
  </Card>
</template>

<script setup>
import Button from '../components/common/Button.vue'
import Modal from '../components/common/Modal.vue'
import ValidationModal from '../components/common/ValidationModal.vue'
import Card from '../components/common/Card.vue'
import Input from '../components/common/Input.vue'
import {
  deleteClient,
  getClients,
  postClient,
  updateClient,
} from '../api/client.js'
import { getAdresses } from '../api/address.js'
import {
  emailValidation,
  isValid,
  zipValidation,
  cityValidation,
  phoneValidation, codePinValidation,
} from '../validation.js'
import { onMounted, ref, watch } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import MentionChampsObligatoires from "@components/common/MentionChampsObligatoires.vue";
import { useMenuStore } from "@stores/menu.js";

const { clients: menuClients } = useMenuStore()
const client_modal = ref(false)

const delete_modal = ref(false)
const deleteClientId = ref(0)
const edit_modal = ref(false)
const add_modal = ref(false)
const client = ref({})

const error = ref([])
const clients = ref([])

const search_name = ref('')

const id_selected = ref(0)
const name = ref('')
const addresses = ref([])
const address = ref('')
const address_selected = ref({})
const complement = ref('')
const modal_title = ref('')

const readonly = ref(true)

const exploit_referents = ref([])
const community_managers = ref([])

const validation = ref({})



onMounted(async () => {
  try {
    clients.value = await getClients(1)
  } catch (e) {
    console.error(e)
  }
})

const refExploitationIsValid = () => {
  let isValid = true // VÉRIFICATION GLOBALE DES CHAMPS POUR LA CARD RÉFÉRENT D'EXPLOITATION
  exploit_referents.value.forEach((ref, i) => {
    // VÉRIFIE SI AU MOINS UN DES CHAMPS EST REMPLI
    error.value[i] = true
    if (ref.nom || ref.email || ref.prenom || ref.fonction || ref.telephone) {
      error.value[i] = false
      return
    } else {
      isValid = false
    }
  })
  return isValid
}

watch(() => client.value.nom, () => {
  const clientMenu = menuClients.find((cli) => cli.id === id_selected.value)
  if (clientMenu) {
    clientMenu.libelle = client.value.nom
  }
})

const saveClient = () => {
  if (!refExploitationIsValid()) return // IL FAUT QU'AU MOINS UN DES CHAMPS SOIT REMPLI POUR ENREGISTRER LA MODIFICATION / L'AJOUT
  if (!isValid(validation)) return

  client.value = {
    nom: name.value,
    referentExploitations: exploit_referents.value,
    gestionnaireCollectivites: community_managers.value,
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
    edit_modal.value = true
  } else {
    add_modal.value = true
  }
}

const updateClientValidation = async () => {
  try {
    await updateClient(client.value, id_selected.value)
    toast.success('Modification effectuée avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }

  edit_modal.value = false
  client_modal.value = false
  cancel()
  clients.value = await getClients()
}

const addClientValidation = async () => {
  try {
    await postClient(client.value)
    toast.success('Ajout effectué avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }

  add_modal.value = false
  client_modal.value = false
  cancel()
  clients.value = await getClients()
  const nouveau = clients.value.find(cli => cli.nom ===  client.value.nom)
  menuClients.push({id: nouveau.id, libelle: nouveau.nom, open: false})
}

const cancel = async () => {
  address.value = []
  complement.value = ''
  community_managers.value = []

}

const addressSelect = () => {
  address.value = address_selected.value.label
}

const removeExploitReferent = (referent_index) => {
  exploit_referents.value = exploit_referents.value.filter(
    (_, i) => i !== referent_index
  )
}

const removeCommunityManager = (referent_index) => {
  community_managers.value = community_managers.value.filter(
    (_, i) => i !== referent_index
  )
}

const addClient = () => {
  name.value = ''
  complement.value = ''
  exploit_referents.value = [
    { nom: '', prenom: '', fonction: '', telephone: '', email: '' },
  ]
  community_managers.value = [{ nom: '', prenom: '', email: '', codePin: null}]
  address_selected.value = {}
  id_selected.value = ''
  cancel()
  readonly.value = false
  client_modal.value = true
  modal_title.value = 'Ajouter un client'
}

const showClient = (i) => {
  const client = clients.value[i]
  modal_title.value = "Consultation d'un client"
  mapApiToData(client)
  client_modal.value = true
  readonly.value = true
}

const mapApiToData = (client) => {
  community_managers.value = client.gestionnaireCollectivites
  exploit_referents.value = client.referentExploitations
  address_selected.value = {
    address: client.adresse.adresse,
    postcode: client.adresse.codePostal,
    pays: 'france',
    city: client.adresse.ville,
    citycode: client.adresse.codeInsee,
    latitude: client.adresse.latitude,
    longitude: client.adresse.longitude,
    complement: client.adresse.complement,
  }
  name.value = client.nom
  complement.value = address_selected.value.complement
  id_selected.value = client.id
  address.value = address_selected.value.address

  // for (const gestionnaire in community_managers.value)
  //   for (const prop in gestionnaire.carteActive) {
  //     carteActive.value[prop] = gestionnaire.carteActive[prop]
  //   }
}

const removeClient = (id) => {
  deleteClientId.value = id
  delete_modal.value = true
}

const deleteClientValidation = async (id) => {
  try {
    await deleteClient(id)
    toast.success('Suppression effectuée avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }

  const indexAncienClient = menuClients.findIndex(cli => cli.id ===  deleteClientId.value)
  menuClients.splice(indexAncienClient, 1)

  delete_modal.value = false
  deleteClientId.value = 0
  clients.value = await getClients(1)
}

const editClient = (i) => {
  const client = clients.value[i]
  mapApiToData(client)
  client_modal.value = true
  readonly.value = false
  modal_title.value = 'Modifier un client'
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

watchDebounced(
  search_name,
  async () => {
    clients.value = await getClients(1, `&nom=${search_name.value}`)
  },
  { debounce: 500, maxWait: 1000 }
)
</script>

<style scoped>
.error {
  color: #de001a;
  font-size: 16px;
  font-weight: 700;
}
</style>
