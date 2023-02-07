<template>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <div class="sm:flex">
      <div class="items-center hidden mb-3 sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0 dark:divide-gray-700">
        <form class="lg:pr-3" action="#" method="GET">
          <label for="users-search" class="sr-only">Search</label>
          <div class="relative mt-1 lg:w-64 xl:w-96 mb-5">
            <input type="text" name="email" id="users-search" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Search for users">
          </div>
        </form>

      </div>
      <div class="flex items-center ml-auto space-x-2 sm:space-x-3">
        <button type="button" data-modal-toggle="add-user-modal" class="inline-flex items-center justify-center w-1/2 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
          <svg class="w-5 h-5 mr-2 -ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
          Ajouter un utilisateur
        </button>
        <a href="#" class="inline-flex items-center justify-center w-1/2 px-3 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700">
          <svg class="w-5 h-5 mr-2 -ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clip-rule="evenodd"></path></svg>
          Exporter
        </a>
      </div>
    </div>
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" class="p-4" v-if="false">
          <div class="flex items-center">
            <input id="checkbox-all-search" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
            <label for="checkbox-all-search" class="sr-only">checkbox</label>
          </div>
        </th>
        <th scope="col" class="px-6 py-3">
          Nom
        </th>
        <th scope="col" class="px-6 py-3">
          Prenom
        </th>
        <th scope="col" class="px-6 py-3">
          Email
        </th>
        <th scope="col" class="px-6 py-3">
          Mineur
        </th>
        <th scope="col" class="px-6 py-3">
          Actif
        </th>
        <th scope="col" class="px-6 py-3">
          Action
        </th>
      </tr>
      </thead>
      <tbody>
      <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" v-for="user in users" :key="user.id">
        <td class="w-4 p-4" v-if="false">
          <div class="flex items-center">
            <input id="checkbox-table-search-1" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
            <label for="checkbox-table-search-1" class="sr-only">checkbox</label>
          </div>
        </td>
        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
          {{ user.nom }}
        </th>
        <td class="px-6 py-4">
          {{ user.prenom }}
        </td>
        <td class="px-6 py-4">
          {{ user.email }}
        </td>
        <td class="px-6 py-4">
          <div class="flex items-center">
            <input disabled :checked="user.mineur" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
          </div>
        </td>
        <td class="px-6 py-4">
          <div class="flex items-center">
            <input disabled :checked="user.actif" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
          </div>
        </td>
        <td class="px-4 py-4">
          <div class="inline-flex rounded-md shadow-sm " role="group">
            <button @click="editer(user)" type="button" class="inline-flex items-center m-5 px-3 pt-2 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-400 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd"></path></svg>
              Editer
            </button>
            <button @click="consulter(user)" type="button" class="inline-flex items-center m-5 px-3 pt-2 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-400 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd"></path></svg>
              Consulter
            </button>
            <button @click="supprimer(user)" type="button" class=" inline-flex items-center m-5 px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
              Supprimer
            </button>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
  <Modal :title="'Consultation de ' + user.nom + ' ' +user.prenom "  @cancel="cancel" @confirm="cancel" v-if="is_open_modal_consult">
    <div class="grid grid-cols-6 gap-6">
      <div class="col-span-6 sm:col-span-3">
        <label for="first-name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Prénom</label>
        <input readonly type="text" name="first-name" :value=user.prenom id="first-name" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Bonnie" required>
      </div>
      <div class="col-span-6 sm:col-span-3">
        <label for="last-name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom</label>
        <input readonly type="text" name="last-name" :value=user.nom id="last-name" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Green" required>
      </div>
      <div class="col-span-6 sm:col-span-3">
        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
        <input readonly type="email" name="email" :value=user.email id="email" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="example@company.com" required>
      </div>
      <div class="col-span-6 sm:col-span-3">
        <label for="position" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Position</label>
        <input readonly type="text" name="position" value="React Developer" id="position" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="e.g. React developer" required>
      </div>
    </div>
  </Modal>

  <Modal :title="'Edition de ' + user.nom + ' ' +user.prenom " @confirm="confirm" @cancel="cancel" v-if="is_open_modal_edit">
    <div class="grid grid-cols-6 gap-6">
      <div class="col-span-6 sm:col-span-3">
        <label for="first-name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
        <input type="text" name="first-name" v-model="user.prenom"  id="first-name-edit" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Bonnie" required>
      </div>
      <div class="col-span-6 sm:col-span-3">
        <label for="last-name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
        <input type="text" name="last-name" v-model="user.nom" id="last-name-edit" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Green" required>
      </div>
      <div class="col-span-6 sm:col-span-3">
        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
        <input type="email" name="email" v-model="user.email" id="email-edit" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="example@company.com" required>
      </div>
      <div class="col-span-6 sm:col-span-3">
        <label for="position" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Position</label>
        <input type="text" name="position" value="React Developer" id="position-edit" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="e.g. React developer" required>
      </div>
    </div>
  </Modal>

  <Modal :title="'Suppréssion de ' + user.nom + ' ' +user.prenom " @confirm="deleted" @cancel="cancel" v-if="is_open_modal_deleted">
    <div class="grid grid-cols-1 gap-1">
      <p>
        Attention vous allez supprimer un utilisateur, êtes-vous sur de votre choix?
      </p>
    </div>
  </Modal>
</template>

<script setup>

  import Modal from './Modal.vue'

  import {ref} from "vue";

  const users = ref([])

  const user = ref({})

  const is_open_modal_consult = ref(false)

  const is_open_modal_edit = ref(false)

  const is_open_modal_deleted = ref(false)

  const getUsers = async () => {
    const response = await fetch(import.meta.env.VITE_API_URL +'/api/users', {
      method:'GET',
      headers: {'Accept': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem('token')},
    })
    users.value = await response.json()
  }

  const updateUser = async () => {
    const response = await fetch(import.meta.env.VITE_API_URL +'/api/users/'+user.value.id, {
      method:'PATCH',
      body: JSON.stringify(user.value),
      headers: {'Accept': 'application/json','Content-Type': 'application/merge-patch+json', 'Authorization': 'Bearer '+ localStorage.getItem('token')},
    })
    users.value = await response.json()
  }

  const deleteUser = async () => {
    const response = await fetch(import.meta.env.VITE_API_URL +'/api/users/'+user.value.id, {
      method:'DELETE',
      headers: {'Accept': 'application/json','Authorization': 'Bearer '+ localStorage.getItem('token')},
    })
    users.value = await response.json()
  }

  const consulter = (user_selected) => {
    user.value = user_selected
    is_open_modal_consult.value = true
  }

  const editer = (user_selected) => {
    user.value = user_selected
    is_open_modal_edit.value = true
  }

  const supprimer = (user_selected) => {
    user.value = user_selected
    is_open_modal_deleted.value = true
  }

  const cancel = () => {
    user.value = {}
    is_open_modal_consult.value= false
    is_open_modal_deleted.value = false
    is_open_modal_edit.value = false
  }

  const confirm = (event) => {
    console.log("CONFIRM", event)
    updateUser()
  }

  const deleted = (event) => {
    deleteUser()
  }

  getUsers()

</script>

<style scoped>

</style>
