<template>
  <Card class="space-y-3">
    <h1>Fit Arena</h1>
    <div class="items-center mb-3">
      <div class="relative mt-1 lg:w-64 xl:w-96 mb-5">
        <input id="TsearchClientName" v-model="search_name" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Recherche par nom">
      </div>
    </div>
    <div class="relative overflow-x-auto">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3"></th>
          <th scope="col" class="px-6 py-3">Nom</th>
          <th scope="col" class="px-6 py-3">Code postal</th>
          <th scope="col" class="px-6 py-3">Ville</th>
          <th scope="col" class="px-6 py-3"></th>
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
    <Button label="Ajouter un client" icon="add" type="secondary" @click="addClient" id="TaddFitArena"/>
  </Card>
  <Modal title="Ajout d'une Fit Arena" v-if="true">

    <div class="flex items-center">
      <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Collectivité</label>
      <select v-if="gestionnaire_collectivites.length" v-model="gestionnaire_collectivites_selected" id="TfaSelectCollectivity" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <option v-for="gestionnaire_collectivite in gestionnaire_collectivites" :value="gestionnaire_collectivite">{{gestionnaire_collectivite.nom}} {{gestionnaire_collectivite.prenom}}</option>
      </select>
    </div>
    <div class="flex items-center">
      <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Nom</label>
      <input :readonly="readonly" v-model="name" id="TclientName" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required>
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
      <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Code postal</label>
      <input :readonly="readonly" id="TfaPostalCode" v-model="address_selected.postcode" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required>
    </div>
    <div class="flex items-center">
      <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Ville</label>
      <input :readonly="readonly" v-model="address_selected.city" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required>
    </div>
    <div class="flex items-center">
      <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Complement</label>
      <input :readonly="readonly" v-model="address_selected.complement" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required>
    </div>
  </Modal>
</template>

<script setup>
  import Card from '../components/common/Card.vue'
  import Modal from '../components/common/Modal.vue'
  import {watchDebounced} from "@vueuse/core";
  import {getAdresses} from "../api/address.js";
  import {onMounted, ref} from "vue";
  import {getGestionnaireCollectivites} from "../api/api.js";

  const readonly = ref(false)

  const gestionnaire_collectivites = ref([])
  const gestionnaire_collectivites_selected = ref({})

  const addresses = ref([])
  const address = ref("")
  const address_selected = ref({})

  watchDebounced(
      address,
      async () => {
        address_selected.value = {}
        addresses.value = await getAdresses(address.value)
        address_selected.value = addresses.value[0]
      },
      { debounce: 500, maxWait: 1000 },
  )

  onMounted(async () => {
    gestionnaire_collectivites.value = await getGestionnaireCollectivites()
  })



</script>
