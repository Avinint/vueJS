<template>
  <Card class="space-y-3">
    <h1>Clients</h1>
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
            <th scope="col" class="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(client, i) in clients" :key="i" class="bg-white">
            <td class="px-6 py-4">{{ client.nom }}</td>
            <td class="px-6 py-4">{{ client.adresse.codePostal }}</td>
            <td class="px-6 py-4">{{ client.adresse.ville }}</td>
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
            <!-- <td class="px-6 py-4">
              <Button label="Détails" couleur="secondary" @click="showClient(i)" />
            </td> -->
          </tr>
        </tbody>
      </table>
    </div>
    <ButtonRight
      id="TaddClient"
      label="Ajouter un client"
      icon="add"
      couleur="danger"
      @click="addClient"
    />
    <form @submit.prevent="saveClient">
      <Modal
        v-if="client_modal"
        :type="readonly ? 'visualiser' : 'classic'"
        :title="modal_title"
        @cancel="client_modal = false"
      >
        <CardModalSection title="CLIENT">
          <template #content>
            <div class="space-y-2">
              <div class="flex items-center">
                <Input
                  id="TclientName"
                  v-model="name"
                  :readonly="readonly"
                  type="text"
                  label="Nom"
                  class="w-full"
                  required
                  :inline="true"
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
              <div v-if="!readonly" class="flex items-center">
                <div class="mr-1.5 block w-1/2"></div>
                <select
                  v-if="address.length"
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
              <div class="flex items-center">
                <Input
                  v-if="address_selected"
                  id="TadresseComplement"
                  v-model="complement"
                  :readonly="readonly"
                  type="text"
                  label="Complément"
                  :inline="true"
                  class="w-full"
                />
              </div>
              <div class="flex items-center">
                <Input
                  v-if="address_selected"
                  id="TadressePostcode"
                  v-model="address_selected.postcode"
                  :readonly="readonly"
                  :inline="true"
                  type="text"
                  label="Code Postal"
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
                  :inline="true"
                  type="text"
                  label="Ville"
                  class="w-full"
                  :validation="[cityValidation]"
                />
              </div>
            </div>
          </template>
        </CardModalSection>

        <CardModalSection title="RÉFÉRENTS D'EXPLOITATION">
          <template #content>
            <Card
              v-for="(exploit_referent, i) in exploit_referents"
              :key="i"
              class="relative space-y-2 mt-4"
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
                  type="text"
                  :inline="true"
                  label="Nom"
                  class="w-full"
                />
              </div>
              <div class="flex items-center">
                <Input
                  id="TrefPrenom"
                  v-model="exploit_referent.prenom"
                  :readonly="readonly"
                  type="text"
                  :inline="true"
                  label="Prénom"
                  class="w-full"
                />
              </div>
              <div class="flex items-center">
                <Input
                  id="TrefFonction"
                  v-model="exploit_referent.fonction"
                  :readonly="readonly"
                  type="text"
                  :inline="true"
                  label="Fonction"
                  class="w-full"
                />
              </div>
              <div class="flex items-center">
                <Input
                  id="TrefTelephone"
                  v-model="exploit_referent.telephone"
                  :readonly="readonly"
                  type="text"
                  label="Numéro de téléphone"
                  :inline="true"
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
                  type="text"
                  label="Email"
                  :inline="true"
                  class="w-full"
                  :validation="[emailValidation]"
                />
              </div>
            </Card>
          </template>
        </CardModalSection>
        <ButtonRight
          v-if="!readonly"
          id="TaddRefExploit"
          label="Ajouter un référent d'exploitation supplémentaire"
          icon="add"
          couleur="danger"
          class="ml-4"
          @click="exploit_referents.push({})"
        />
        <div v-if="donneesPDF !== null" class="offset">
          <CarteAcces ref="templatePDF" :carte="donneesPDF"/>
        </div>
        <CardModalSection title="COMPTES GESTIONNAIRES">
          <template #content>
            <Card
              v-for="(gestionnaire, i) in community_managers"
              :key="i"
              class="relative space-y-2 mt-4"
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
              <div class="flex items-center">
                <Input
                  id="TcomNom"
                  v-model="gestionnaire.nom"
                  :readonly="readonly"
                  type="text"
                  label="Nom"
                  class="w-full"
                  :inline="true"
                  required
                />
              </div>
              <div class="flex items-center">
                <Input
                  id="TcomPrenom"
                  v-model="gestionnaire.prenom"
                  :readonly="readonly"
                  :inline="true"
                  type="text"
                  label="Prénom"
                  class="w-full"
                  required
                />
              </div>
              <div class="flex items-center">
                <Input
                  id="TcomMail"
                  v-model="gestionnaire.email"
                  v-model:valid="validation.email2"
                  :readonly="readonly"
                  label="Email"
                  class="w-full"
                  :inline="true"
                  required
                  :validation="[emailValidation]"
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
              <CardModalSection class="pt-6" v-if="gestionnaire.afficherCarte" title="QR CODE">
                <template #content>
                  <div>
                    <div class="flex items-center justify-between mt-10">
                      <div v-if="gestionnaire.carteAcces[0].qrCode" class="w-3/12 p-4 ml-2 ring-2 ring-offset-4 rounded-lg ring-gray-200">
                        <img
                          alt="QR CODE Fit Arena"
                          :src="gestionnaire.carteAcces[0].qrCode"
                        />
                      </div>
                      <div class="w-8/12">
                        <ButtonRight
                          id="TGestColQRCodeImprimer"
                          icon="print"
                          couleur="danger"
                          class="w-full"
                          label="Imprimer le QR Code"
                          @click="imprimerPdf(gestionnaire)"
                        />
                      </div>
                    </div>
                  </div>
                </template>
              </CardModalSection>
            </Card>
          </template>
        </CardModalSection>
        <ButtonRight
          v-if="!readonly"
          id="TaddComManager"
          label="Ajouter un compte gestionnaire supplémentaire"
          icon="add"
          couleur="danger"
          class="ml-4"
          @click="community_managers.push({})"
        />
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
import ButtonRight from '../components/common/ButtonRight.vue'
import Modal from '../components/common/Modal.vue'
import CardModalSection from '@components/common/CardModalSection.vue'
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
import { nextTick, onMounted, ref, watch } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import MentionChampsObligatoires from "@components/common/MentionChampsObligatoires.vue";
import { useMenuStore } from "@stores/menu.js";
import { getCarteAcces } from "@api/carte_acces.js";
import CarteAcces from "@/pdf/CarteAcces.vue";
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
const donneesPDF = ref(null)
const templatePDF = ref(null);
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
      adresse: address_selected.value.name,
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
  donneesPDF.value = null
}

const addressSelect = () => {
  address.value = address_selected.value.name
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
  community_managers.value = client.gestionnaireCollectivites?.map(gest => ({
    afficherCarte: !!gest.codePin?.length,
    titulaireCarte: !!gest.codePin?.length,
    ...gest,
  }))
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

const getDonneesCarte = async (gestionnaire) => (await getCarteAcces(gestionnaire.carteAcces[0].id)) ?? null

const imprimerPdf = async (gestionnaire) => {
  donneesPDF.value = await getDonneesCarte(gestionnaire)
  await nextTick()
  templatePDF.value.imprimer()
}
</script>

<style scoped>
.error {
  color: #de001a;
  font-size: 16px;
  font-weight: 700;
}
.offset {
  position: absolute;
  right: -2000px;
}
</style>
