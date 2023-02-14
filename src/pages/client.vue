<template>
  <h1>Clients</h1>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" class="px-6 py-3">

        </th>
        <th scope="col" class="px-6 py-3">
          Nom
        </th>
        <th scope="col" class="px-6 py-3">
          Code postal
        </th>
        <th scope="col" class="px-6 py-3">
          Ville
        </th>
        <th scope="col" class="px-6 py-3">
          Action
        </th>
      </tr>
      </thead>
      <tbody>
      <tr class="bg-white border-b dark:bg-gray-900 dark:border-gray-700" v-for="(client, i) in clients">
        <th class="flex justify-center">
          <Button icon="edit" type="secondary" @click="editClient(i)"/>
          <Button icon="delete" type="secondary"/>
        </th>
        <td class="px-6 py-4">
          {{ client.nom }}
        </td>
        <td class="px-6 py-4">
          {{ client.adresse.codePostal }}
        </td>
        <td class="px-6 py-4">
          {{ client.adresse.ville }}
        </td>
        <td class="px-6 py-4">
          <div class="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer" @click="showClient(i)">Détails</div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
  <Button label="Ajouter un client" icon="add" type="secondary" @click="addClient" id="TaddClient"/>
  <Modal v-if="client_modal" title="Ajout d'un client"  @cancel="client_modal = false" @confirm="saveClient">
    <Card class="w-full">
      <span>Contact administratif</span>
      <div class="space-y-2">
        <div class="flex items-center">
          <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Nom</label>
          <input v-model="name" id="TclientName" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required>
        </div>
        <div class="flex items-center">
          <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Adresse</label>
          <div class="relative w-full">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input v-model="address" id="TclientAdresse" type="search" class="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" data-dropdown-toggle="dropdown" placeholder="Rue, ville, ..." required>
          </div>
        </div>
        <div>
          <select v-if="address.length" v-model="address_selected" id="TclientSelectAdresse" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option v-for="address in addresses" :value="address">{{address.label}}</option>
          </select>
        </div>
        <div class="flex items-center">
          <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Code postal</label>
          <input id="TadressePostcode" v-model="address_selected.postcode" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required>
        </div>
        <div class="flex items-center">
          <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Ville</label>
          <input v-model="address_selected.city" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required>
        </div>
        <div class="flex items-center">
          <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Complement</label>
          <input v-model="address_selected.complement" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required>
        </div>
      </div>
    </Card>
    <Card class="space-y-2">
      <span>Référent d'exploitation</span>
      <Card v-for="(exploit_referent, i) in exploit_referents" class="space-y-2">
        <Button class="flex w-full w-12 justify-end" icon="delete" type="secondary" size="s" @click="removeExploitReferent(i)"/>
        <div class="flex items-center">
          <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Nom</label>
          <input id="TrefNom" v-model="exploit_referent.nom" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required>
        </div>
        <div class="flex items-center">
          <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Prenom</label>
          <input id="TrefPrenom" v-model="exploit_referent.prenom" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required>
        </div>
        <div class="flex items-center">
          <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Fonction</label>
          <input id="TrefFonction" v-model="exploit_referent.fonction" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required>
        </div>
        <div class="flex items-center">
          <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Numero de téléphone</label>
          <input id="TrefTelephone" v-model="exploit_referent.telephone" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required>
        </div>
        <div class="flex items-center">
          <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Mail</label>
          <input id="TrefMail" v-model="exploit_referent.email" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required>
        </div>
      </Card>
      <Button id="TaddRefExploit" label="Ajouter un référent d'exploitation supplémentaire" icon="add" type="secondary" @click="exploit_referents.push({})"/>
    </Card>
    <Card class="space-y-2">
      <span>Comptes Fit Arena avec le rôle de gestionnaire de collectivité</span>
      <Card v-for="(community_manager, i) in community_managers" class="space-y-2">
        <Button class="flex w-full justify-end" icon="delete" type="secondary" size="s" @click="removeCommunityManager(i)"/>
        <div class="flex items-center">
          <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Nom</label>
          <input id="TcomNom" v-model="community_manager.nom" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required>
        </div>
        <div class="flex items-center">
          <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Prenom</label>
          <input id="TcomPrenom" v-model="community_manager.prenom" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required>
        </div>
        <div class="flex items-center">
          <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Mail</label>
          <input id="TcomMail" v-model="community_manager.email" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required>
        </div>
      </Card>
      <Button id="TaddComManager" label="Ajouter un compte supplementaire" icon="add" type="secondary" @click="community_managers.push({})"/>
    </Card>
  </Modal>
</template>

<script setup>
  import Button from '../components/common/Button.vue'
  import Modal from '../components/common/Modal.vue'
  import Card from '../components/common/Card.vue'
  import {getClients, postClient, updateClient} from '../api/api.js'
  import {onMounted, ref} from "vue";
  import {getAdresses} from "../api/address.js";
  import {watchDebounced} from "@vueuse/core";

  const client_modal = ref(false)

  const clients = ref([])

  const id_selected = ref(0)
  const name = ref("")
  const addresses = ref([])
  const address = ref("")
  const address_selected = ref({})

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
        longitude: ""+address_selected.value.longitude
      },
    }
    if (id_selected.value) {
      await updateClient(client, id_selected.value)
    } else {
      await postClient(client)
    }
    client_modal.value = false
    clients.value = await getClients()
  }

  const removeExploitReferent = (referent_index) => {
    exploit_referents.value = exploit_referents.value.filter((_, i) => i !== referent_index)
  }
  const removeCommunityManager = (referent_index) => {
    community_managers.value = community_managers.value.filter((_, i) => i !== referent_index)
  }
  const addClient = () => {
    client_modal.value = true
  }
  const showClient = (i) => {

  }
  const editClient = (i) => {
    const client = clients.value[i]
    community_managers.value = client.gestionnaireCollectivites
    exploit_referents.value = client.referentExploitations
    address_selected.value = {
      address: client.adresse.adresse,
      postcode: client.adresse.codePostal,
      pays: 'france',
      city: client.adresse.ville,
      citycode: client.adresse.codeInsee,
      latitude: client.adresse.latitude,
      longitude: client.adresse.longitude
    }
    name.value = client.nom
    id_selected.value = client.id
    client_modal.value = true
  }

  watchDebounced(
      address,
      async () => {
        address_selected.value = {}
        addresses.value = await getAdresses(address.value)
      },
      { debounce: 500, maxWait: 1000 },
  )

  onMounted(async () => {
    try {
      clients.value = await getClients()
    } catch (e) {
      console.error(e)
    }
  })

</script>
