<template>
  <Card class="space-y-3">
    <h1>Fit Arena</h1>

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
        <tr class="bg-white" v-for="(fit_arena, i) in fit_arenas">
          <td class="flex justify-center items-center p-3">
            <Button test="TdeleteClient" borderless icon="delete" type="secondary" @click="removeFa(i)"/>
            <Button test="TeditClient" borderless icon="edit" type="secondary" @click="editFa(i)"/>
          </td>
          <td class="px-6 py-4">{{ fit_arena.libelle }}</td>
          <td class="px-6 py-4">{{ fit_arena.adresse.codePostal }}</td>
          <td class="px-6 py-4">{{ fit_arena.adresse.ville }}</td>
          <td class="px-6 py-4">
            <Button label="Détails" type="secondary" @click="showFa(i)"/>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <Button label="Ajouter une Fit Arena" icon="add" type="secondary" @click="addFa" id="TaddFitArena"/>
  </Card>
  <form @submit.prevent="saveFA">
    <Modal v-if="fa_modal" :type="readonly ? 'visualiser' : 'classic' "  :title="readonly ? 'Information Fit Arena' : 'Ajouter ou modifier une Fit Arena'" @cancel="fa_modal = false, cancel()">
      <div class="flex items-center">
        <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Client</label>
        <select :readonly="readonly" v-if="clients.length" v-model="client_selected" id="TfaSelectCollectivite" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option v-for="client in clients" :value="client.id">{{client.nom}}</option>
        </select>
      </div>
      <div class="flex items-center">
        <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Nom</label>
        <input :readonly="readonly" v-model="name" id="TfaNom" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required>
      </div>
      <div class="flex items-center">
        <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Adresse</label>
        <div class="relative w-full">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <input :readonly="readonly" v-model="address" id="TfaAdresse" type="search" class="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" data-dropdown-toggle="dropdown" placeholder="Rue, ville, ..." required>
        </div>
      </div>
      <div>
        <select v-if="address.length" @change="addressSelect" v-model="address_selected" id="TclientSelectAdresse" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option v-for="address in addresses" :value="address">{{address.label}}</option>
        </select>
      </div>
      <div class="flex items-center">
        <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Code postal</label>
        <input :readonly="readonly" id="TadressePostcode" v-model="address_selected.postcode" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required>
      </div>
      <div class="flex items-center">
        <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Ville</label>
        <input :readonly="readonly" v-model="address_selected.city" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required>
      </div>
      <div class="flex items-center">
        <div class="flex justify-between items-center pr-3 w-1/2">
          <label class="block text-sm font-medium text-gray-900 w-1/2">Latitude</label>
          <p class="text-blue-400 text-sm">Format : 46.7897</p>
        </div>
        <input :readonly="readonly" id="TfaLatitude" v-model="address_selected.latitude" type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required>
      </div>
      <div class="flex items-center">
        <div class="flex justify-between items-center pr-3 w-1/2">
          <label class="block text-sm font-medium text-gray-900 w-1/2">Longitude</label>
          <p class="text-blue-400 text-sm">Format : 46.7897</p>
        </div>
        <input :readonly="readonly" id="TfaLongitude" v-model="address_selected.longitude" type="text" class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-2.5" placeholder="" required>
      </div>
      <div class="flex items-center">
        <label class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Commentaire</label>
        <textarea :readonly="readonly" v-model="commentaire" type="" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=""></textarea>
      </div>
      <div class="flex items-center">
        <span class="block mb-2 text-sm font-medium text-gray-900 w-1/2">Actif : </span>
        <label class="relative inline-flex items-center cursor-pointer">
          <input :readonly="readonly" type="checkbox" value="true" class="sr-only peer" v-model="actif" >
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-400"></div>
          <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
        </label>
      </div>
    </Modal>
  </form>
</template>

<script setup>
  import Card from '../components/common/Card.vue'
  import Modal from '../components/common/Modal.vue'
  import Button from '../components/common/Button.vue'
  import {watchDebounced} from "@vueuse/core";
  import {getAdresses} from "../api/address.js";
  import {onMounted, ref} from "vue";
  import {deleteClient, getClients} from "../api/client.js";
  import {deleteFitArenas, getFitArenas, postFitArenas, updateFitarenas} from "../api/fit-arena.js";
  import {postActivites, updateActivites} from "../api/activite";
  import {toast} from "vue3-toastify";

  const fa_modal = ref(false)
  const readonly = ref(false)

  const fas = ref([])
  const clients = ref([])

  const fit_arenas = ref([])

  const client_selected = ref({})
  const id_selected = ref(0)
  const name = ref("")
  const commentaire = ref("")
  const actif = ref("")
  const addresses = ref([])
  const address = ref("")
  const address_selected = ref({})

  const addFa = () => {
    cancel()
    fa_modal.value = true
  }

  const cancel = async () => {
    name.value = []
    commentaire.value = []
    actif.value = []
    address.value = []
    id_selected.value = ''
    address_selected.value = {}
    client_selected.value = {}
  }

  const removeFa = async (i) => {
    const fitArena = fit_arenas.value[i]
    await deleteFitArenas(fitArena.id)
    fit_arenas.value = await getFitArenas()
  }

  const editFa = (i) => {
    const fitArena = fit_arenas.value[i]
    mapApiToData(fitArena)
    fa_modal.value = true
    readonly.value = false
  }

  const showFa = async (i) => {
    const fitArena = fit_arenas.value[i]
    mapApiToData(fitArena)
    fa_modal.value = true
    readonly.value = true
  }

  const mapApiToData = (fitArena) => {
    name.value = fitArena.libelle
    actif: fitArena.actif
    address_selected.value = {
      address: fitArena.adresse.adresse,
      postcode: fitArena.adresse.codePostal,
      pays: 'france',
      city: fitArena.adresse.ville,
      citycode: fitArena.adresse.codeInsee,
      latitude: fitArena.adresse.latitude,
      longitude: fitArena.adresse.longitude
    }
    address.value = address_selected.value.address
    client_selected.value = fitArena.client.id
    commentaire: fitArena.commentaire
    id_selected.value = fitArena.id
  }

  const saveFA = async () => {
    const fa = {
      client: 'api/clients/' + client_selected.value,
      commentaire: commentaire,
      ordre: 1,
      libelle: name.value,
      actif: actif.value == true ? actif.value  : false ,
      adresse: {
        adresse: address_selected.value.label,
        codePostal: address_selected.value.postcode,
        ville: address_selected.value.city,
        pays: 'france',
        codeInsee: ""+address_selected.value.citycode,
        latitude: ""+address_selected.value.latitude,
        longitude: ""+address_selected.value.longitude,
        numeroDepartement: ""+address_selected.value.context.split(',')[0],
        nomDepartement: ""+address_selected.value.context.split(',')[1]
      },
    }
    if (id_selected.value) {
      const {data} = await updateFitarenas(fa, id_selected.value)
    } else {
      try {
        const {data} = await postFitArenas(fa)
        toast.success('Enregistrement de la fitArena avec succes');
      }catch (e) {
        toast.error('Erreur, Veuillez contacter votre administrateur');
      }

    }
    fa_modal.value = false
    fit_arenas.value = await getFitArenas()
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

  onMounted(async () => {
    fit_arenas.value = await getFitArenas()
    clients.value = await getClients()
  })

</script>
