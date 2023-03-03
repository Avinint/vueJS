<template>
  <Card class="space-y-3">
    <h1>Clients</h1>
    <div class="relative overflow-x-auto">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3"></th>
          <th scope="col" class="px-6 py-3">Nom</th>
          <th scope="col" class="px-6 py-3">Code postal</th>
          <th scope="col" class="px-6 py-3">Ville</th>
          <th scope="col" class="px-6 py-3">Action</th>
        </tr>
        </thead>
        <tbody>
        <tr class="bg-white" v-for="(client, i) in clients">
          <td class="flex justify-center items-center p-3">
            <Button test="TdeleteClient" borderless icon="delete" type="secondary" @click="removeClient(i)"/>
            <Button test="TeditClient" borderless icon="edit" type="secondary" @click="editClient(i)"/>
          </td>
          <td class="px-6 py-4">{{ client.nom }}</td>
          <td class="px-6 py-4">{{ client.adresse.codePostal }}</td>
          <td class="px-6 py-4">{{ client.adresse.ville }}</td>
          <td class="px-6 py-4">
            <Button label="Détails" type="secondary" @click="showClient(i)"/>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <Button  label="Ajouter un client" icon="add"  icon_placement="right" type="secondary" @click="addClient" id="TaddClient"/>

    <form @submit.prevent="saveClient">
      <Modal v-if="client_modal" :type="readonly ? 'visualiser' : 'classic' "  :title="readonly ? 'Consultation d\'un client' : 'Ajouter ou modifier un client'"  @cancel="client_modal = false">
        <Card class="w-full">
          <h3>Ajouter un client</h3>
          <div class="space-y-2">
            <div class="flex items-center">
              <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Nom</label>
              <input :readonly="readonly" v-model="name" id="TclientName" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required>
            </div>

            <div class="flex items-center">
              <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Adresse</label>
              <div class="relative w-full">
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input :readonly="readonly" v-model="address" id="TclientAdresse" type="search" class="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" data-dropdown-toggle="dropdown" placeholder="Rue, ville, ..." required>
              </div>
            </div>
            <div>
              <select v-if="address.length" @change="addressSelect" v-model="address_selected" id="TclientSelectAdresse" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option v-for="address in addresses" :value="address">{{address.label}}</option>
              </select>
            </div>
            <div class="flex items-center">
              <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Complément</label>
              <input :readonly="readonly" v-model="complement" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required>
            </div>
            <div class="flex items-center">
              <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Code postal</label>
              <input :readonly="readonly" id="TadressePostcode" v-model="address_selected.postcode" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required>
            </div>
            <div class="flex items-center">
              <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Ville</label>
              <input :readonly="readonly" v-model="address_selected.city" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required>
            </div>complement
          </div>
        </Card>
        <Card class="space-y-2">
          <h3>Référents d’exploitation</h3>
          <Card v-for="(exploit_referent, i) in exploit_referents" class="space-y-2">
            <Button v-if="!readonly" class="flex w-full w-12 flex-direction: row-reverse " icon="delete" type="secondary" size="s" @click="removeExploitReferent(i)"/>
            <div class="flex items-center">
              <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Nom</label>
              <input :readonly="readonly" id="TrefNom" v-model="exploit_referent.nom" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required>
            </div>
            <div class="flex items-center">
              <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Prénom</label>
              <input :readonly="readonly" id="TrefPrenom" v-model="exploit_referent.prenom" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required>
            </div>
            <div class="flex items-center">
              <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Fonction</label>
              <input :readonly="readonly" id="TrefFonction" v-model="exploit_referent.fonction" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required>
            </div>
            <div class="flex items-center">
              <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Numéro de téléphone</label>
              <input :readonly="readonly" id="TrefTelephone" v-model="exploit_referent.telephone" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required>
            </div>
            <div class="flex items-center">
              <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Mail</label>
              <input :readonly="readonly" id="TrefMail" v-model="exploit_referent.email" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required>
            </div>
          </Card>
          <Button v-if="!readonly" id="TaddRefExploit" label="Ajouter un référent d'exploitation supplémentaire" icon="add" type="secondary" @click="exploit_referents.push({})"/>
        </Card>
        <Card class="space-y-2">
          <h3>Comptes gestionnaires</h3>
          <Card v-for="(community_manager, i) in community_managers" class="space-y-2">
            <Button v-if="!readonly" class="flex w-full justify-end" icon="delete" type="secondary" size="s" @click="removeCommunityManager(i)"/>
            <div class="flex items-center">
              <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Nom</label>
              <input :readonly="readonly" id="TcomNom" v-model="community_manager.nom" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required>
            </div>
            <div class="flex items-center">
              <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Prénom</label>
              <input :readonly="readonly" id="TcomPrenom" v-model="community_manager.prenom" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required>
            </div>
            <div class="flex items-center">
              <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Mail</label>
              <input :readonly="readonly" id="TcomMail" v-model="community_manager.email" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required>
            </div>
          </Card>
          <Button v-tooltips="'COUCOC'" v-if="!readonly" id="TaddComManager" label="Ajouter un compte supplémentaire" icon="add" type="secondary" @click="community_managers.push({})"/>
        </Card>
      </Modal>
    </form>
  </Card>
</template>

<script setup>
  import Button from '../components/common/Button.vue'
  import Modal from '../components/common/Modal.vue'
  import Card from '../components/common/Card.vue'
  import {deleteClient, getClients, postClient, updateClient} from '../api/client.js'
  import {onMounted, ref} from "vue";
  import {getAdresses} from "../api/address.js";
  import {watchDebounced} from "@vueuse/core";
  import {getFitArenas} from "../api/fit-arena";

  const client_modal = ref(false)

  const clients = ref([])

  const search_name = ref('')

  const id_selected = ref(0)
  const name = ref("")
  const addresses = ref([])
  const address = ref("")
  const address_selected = ref({})
  const complement = ref("")

  const readonly = ref(true)

  const exploit_referents = ref([])
  const community_managers = ref([])

  const saveClient = async () => {
    let client = {
      nom: name.value,
      referentExploitations: exploit_referents.value,
      gestionnaireCollectivites: community_managers.value,
      adresse: {
        adresse: address_selected.value.label,
        codePostal: address_selected.value.postcode,
        ville: address_selected.value.city,
        pays: 'france',
        codeInsee: ""+address_selected.value.citycode,
        latitude: ""+address_selected.value.latitude,
        longitude: ""+address_selected.value.longitude,
        numeroDepartement: ""+address_selected.value.context.split(',')[0],
        nomDepartement: ""+address_selected.value.context.split(',')[1],
        complement:  complement.value
      },
    }
    if (id_selected.value) {
      await updateClient(client, id_selected.value)
    } else {
      await postClient(client)
    }
    client_modal.value = false
    cancel()
    clients.value = await getClients()

  }

  const cancel = async () => {
    address.value = []
    complement.value = ''
  }

  const addressSelect = () => {
    address.value = address_selected.value.label
  }

  const removeExploitReferent = (referent_index) => {
    exploit_referents.value = exploit_referents.value.filter((_, i) => i !== referent_index)
  }

  const removeCommunityManager = (referent_index) => {
    community_managers.value = community_managers.value.filter((_, i) => i !== referent_index)
  }

  const addClient = () => {
    name.value = ''
    complement.value = ''
    exploit_referents.value = []
    community_managers.value = []
    address_selected.value = {}
    id_selected.value = ''
    cancel()
    readonly.value = false
    client_modal.value = true
  }

  const showClient = (i) => {
    const client = clients.value[i]
    console.error(client)
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
      complement: client.adresse.complement
    }
    name.value = client.nom
    complement.value = address_selected.value.complement
    id_selected.value = client.id
    address.value = address_selected.value.address

  }

  const removeClient = async (i) => {
    const client = clients.value[i]
    await deleteClient(client.id)
    clients.value = await getClients(1)
  }

  const editClient = (i) => {
    const client = clients.value[i]
    mapApiToData(client)
    client_modal.value = true
    readonly.value = false
  }

  watchDebounced(
      address,
      async () => {
        address_selected.value = {}
        addresses.value = await getAdresses(address.value)
        address_selected.value = addresses.value[0]

      },
      { debounce: 500, maxWait: 1000 },
  )


  watchDebounced(
      search_name,
      async () => {
        clients.value = await getClients(1, `&nom=${search_name.value}`)
      },
      { debounce: 500, maxWait: 1000 },
  )

  onMounted(async () => {
    try {
      clients.value = await getClients(1)
    } catch (e) {
      console.error(e)
    }
  })

</script>
