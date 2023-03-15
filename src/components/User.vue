<template>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <Card class="space-y-3">
      <h1>Utilisateurs</h1>
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 p-4">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3"></th>
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
              Identifiant
            </th>
            <th scope="col" class="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" v-for="user in users" :key="user.id">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
            <td class="flex justify-center items-center p-3">
              <Button test="TdeleteActivities" borderless icon="delete" type="secondary" @click="supprimer(user)"/>
              <Button test="TeditActivites" borderless icon="edit" type="secondary" @click="editer(user)"/>
            </td>
          </th>
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
          <td class="px-6 py-4">
            {{ user.identifiant }}
          </td>
          <td class="px-4 py-4">
            <div class="inline-flex rounded-md shadow-sm " role="group">
              <Button label="Détails" type="secondary" @click="consulter(user)"/>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
      <div class="sm:flex">
        <div class="flex items-center space-x-2">
          <Button label="Ajouter un utilisateur" type="secondary" icon="add" @click="ajouter()"/>
          <Button label="Exporter" type="secondary" icon="export" @click="ajouter()"/>
        </div>
      </div>
    </Card>
  </div>
  <Modal :title="'Consultation de ' + user.nom + ' ' + user.prenom" @cancel="cancel" @confirm="cancel" v-if="is_open_modal.consult">
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
        <label for="identifiant-user" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Identifiant</label>
        <input readonly type="text" name="identifiant-user" v-model="user.identifiant" id="identifiant-user" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="e.g. React developer" required>
      </div>
    </div>
  </Modal>

  <Modal :title="'Edition de ' + user.nom + ' ' + user.prenom" @confirm="confirm" @cancel="cancel" v-if="is_open_modal.edit">
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
        <label for="identifiant-edit" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Identifiant</label>
        <input type="text" name="identifiant-edit" v-model="user.identifiant" id="identifiant-edit" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="e.g. React developer" required>
      </div>
    </div>
  </Modal>

  <Modal :title="'Suppression de ' + user.nom + ' ' + user.prenom" @confirm="deleted" @cancel="cancel" v-if="is_open_modal.deleted">
    <div class="grid grid-cols-1 gap-1">
      <p>
        Attention vous allez supprimer un utilisateur, êtes-vous sûr de votre choix ?
      </p>
    </div>
  </Modal>


  <Modal title="Nouvel utilisateur" @confirm="add" @cancel="cancel" v-if="is_open_modal.add">
    <div class="grid grid-cols-6 gap-6">
      <div class="col-span-6 sm:col-span-3">
        <label for="first-name-new" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Prénom</label>
        <input v-model="user.prenom" type="text" name="first-name-new" id="first-name-new" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Bonnie" required>
      </div>
      <div class="col-span-6 sm:col-span-3">
        <label for="last-name-new" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom</label>
        <input type="text" name="last-name-new" v-model="user.nom" id="last-name-new" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Green" required>
      </div>
      <div class="col-span-6 sm:col-span-3">
        <label for="email-new" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
        <input type="email" name="email-new" v-model="user.email" id="email-new" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="example@company.com" required>
      </div>
      <div class="col-span-6 sm:col-span-3">
        <label for="identifiant-new" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Identifiant</label>
        <input type="text" name="identifiant-new" v-model="user.identifiant" id="identifiant-new" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="e.g. React developer" required>
      </div>

      <div class="col-span-6 sm:col-span-3">
        <label class="relative inline-flex items-center mr-5 cursor-pointer">
          <input type="checkbox" v-model="user.actif" value="true" class="sr-only peer" checked>
          <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
          <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Actif</span>
        </label>
      </div>
      <div class="col-span-6 sm:col-span-3">
        <label class="relative inline-flex items-center mr-5 cursor-pointer">
          <input type="checkbox" v-model="user.mineur" value="false" class="sr-only peer">
          <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
          <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Mineur</span>
        </label>
      </div>
      <div class="col-span-6 sm:col-span-3">
        <label for="portable-new" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Portable</label>
        <input type="text" name="identifiant-new" v-model="user.portable" id="portable-new" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="e.g. React developer" required>
      </div>
      <div class="col-span-6 sm:col-span-3">
        <label for="password-new" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
        <input type="password" name="password-new" v-model="user.plainPassword" id="password-new" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="e.g. React developer" required>
      </div>
    </div>
  </Modal>

</template>

<script setup>

import Modal from './common/Modal.vue'
import Card from './common/Card.vue'

  import {reactive, ref} from "vue";
  import Button from './common/Button.vue'

  const users = ref([])

  const user = ref({})

  const is_open_modal = reactive({
    consult : false,
    edit : false,
    add : false,
    deleted : false
  })


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
  }

  const register = async () => {
    const response = await fetch(import.meta.env.VITE_API_URL +'/api/users', {
      method:'POST',
      body: JSON.stringify(user.value),
      headers: {'Accept': 'application/json','Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem('token')},
    })
    if (response.status !== 201) {
      alert('ERREUR DE CONNEXION')
    } else {
      is_open_modal.add = false
    }
  }

  const deleteUser = async () => {
    const response = await fetch(import.meta.env.VITE_API_URL +'/api/users/'+user.value.id, {
      method:'DELETE',
      headers: {'Accept': 'application/json','Authorization': 'Bearer '+ localStorage.getItem('token')},
    })
  }

  const consulter = (user_selected) => {
    user.value = user_selected
    is_open_modal.consult = true
  }

  const editer = (user_selected) => {
    user.value = user_selected
    is_open_modal.edit = true
  }

  const ajouter = () => {
    user.value.actif = true
    user.value.mineur = false
    user.value.idParent = 0
    is_open_modal.add = true
  }

  const supprimer = (user_selected) => {
    user.value = user_selected
    is_open_modal.deleted = true
  }

  const cancel = () => {
    user.value = {}
    Object.keys(is_open_modal).forEach(el=>is_open_modal[el]=false)
  }

  const confirm = (event) => {
    updateUser()
    cancel()
  }

  const deleted = (event) => {
    deleteUser()
    cancel()
  }

  const add = (event) => {
    register()
    cancel()
  }

  getUsers()

</script>

<style scoped>

</style>
