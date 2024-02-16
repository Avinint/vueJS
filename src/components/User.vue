<template>
  <Card class="space-y-3 mb-10">
    <!-- <div class="flex gap-40 items-center"> -->
      <h1>Utilisateurs</h1>
      <!-- <div class="flex gap-4">
        <Input
          placeholder="..."
          v-model="userSearch"
          :required="false"
        />
        <Button
          test="TSearchUser"
          borderless
          couleur="danger"
          @click="searchUser(userSearch)"
          label="Rechercher"
        />
      </div>
    </div> -->

    <div class="relative overflow-x-auto">
      <table class="w-full text-left text-sm text-gray-500">
        <thead
          class="text-xs text-gray-700 bg-gray-200"
        >
          <tr>
            <th scope="col" class="w-1/12 px-6 py-3">Nom</th>
            <th scope="col" class="w-1/12 px-6 py-3">Prénom</th>
            <th scope="col" class="w-1/12 px-6 py-3">Email</th>
            <th scope="col" class="w-1/12 px-6 py-3">Identifiant</th>
            <th scope="col" class="w-1/12 px-6 py-3">PMR</th>
            <th scope="col" class="w-1/12 px-6 py-3">Mineur</th>
            <th scope="col" class="w-1/12 px-6 py-3">Actif</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="bg-white">
            <td class="px-6 py-4">{{ user.nom }}</td>
            <td class="px-6 py-4">{{ user.prenom }}</td>
            <td class="px-6 py-4">{{ user.email }}</td>
            <td class="px-6 py-4">{{ user.identifiant }}</td>

            <td class="px-6 py-4">
              <label class="relative inline-flex cursor-pointer items-center">
                <input
                  v-model="user.equipementAdapte"
                  type="checkbox"
                  value="true"
                  class="peer sr-only"
                  @change="modifiePMRUser(user)"
                />
                <div
                  class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"
                ></div>
                <span
                  class="ml-3 text-sm font-medium text-gray-900"
                ></span>
              </label>
            </td>
            <td class="px-6 py-4">
              <label class="relative inline-flex cursor-pointer items-center">
                <input
                  v-model="user.mineur"
                  type="checkbox"
                  value="true"
                  class="peer sr-only"
                  @change="modifieMineurUser(user)"
                />
                <div
                  class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"
                ></div>
                <span
                  class="ml-3 text-sm font-medium text-gray-900"
                ></span>
              </label>
            </td>
            <td class="px-6 py-4">
              <label class="relative inline-flex cursor-pointer items-center">
                <input
                  v-model="user.actif"
                  type="checkbox"
                  value="true"
                  class="peer sr-only"
                  @change="modifieActifUser(user)"
                />
                <div
                  class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"
                ></div>
                <span
                  class="ml-3 text-sm font-medium text-gray-900"
                ></span>
              </label>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </Card>
  <div class="flex justify-center items-center mb-10">
    <p v-if="page !== 1"><span @click="previousPage()" class="chevron left cursor-pointer"></span></p>
    <p class="mx-10 text-gray-500">{{ page }}</p>
    <p :class="users.length >= 30 ? '' : 'hidden'"><span @click="nextPage()" class="chevron right cursor-pointer"></span></p>
  </div>
</template>

<script setup>
import Button from '../components/common/Button.vue'
import Card from '../components/common/Card.vue'
import Input from '../components/common/Input.vue'

import { getUsers, patchUser } from '../api/user.js'
import { onMounted, ref } from "vue"
import { toast } from "vue3-toastify"

const users = ref([])
const page = ref(1)
const userSearch = ref('')

onMounted(async () => {
  await fetchDonnees()
})

const fetchDonnees = async () => {
  users.value = await getUsers(1)
  sortDonnees()
}

const sortDonnees = () => {
  users.value.sort(function compare(a, b) {
    if (a.nom.toLowerCase() < b.nom.toLowerCase()) {
      return -1
    }
    if (a.nom.toLowerCase() > b.nom.toLowerCase()) {
      return 1
    }
    return 0
  })
}

const modifieActifUser = async ({ actif, id }) => {
  try {
    await patchUser({ actif }, id)
    toast.success('Modification effectuée avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }
}

const modifieMineurUser = async ({ mineur, id }) => {
  try {
    await patchUser({ mineur }, id)
    toast.success('Modification effectuée avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }
}

const modifiePMRUser = async ({ equipementAdapte, id }) => {
  try {
    await patchUser({ equipementAdapte }, id)
    toast.success('Modification effectuée avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }
}

const previousPage = async () => {
  page.value = page.value - 1
  users.value = await getUsers(page.value)
  sortDonnees()
  window.scroll(0, 0)
}

const nextPage = async () => {
  page.value = page.value + 1
  users.value = await getUsers(page.value)
  sortDonnees()
  window.scroll(0, 0)
}

const searchUser = async () => {
  users.value = await getUsers(1, '&search=' + userSearch.value)
}
</script>

<style scoped>
.chevron::before {
	border-style: solid;
	border-width: 0.25em 0.25em 0 0;
	content: '';
	display: inline-block;
	height: 1em;
	left: 0.15em;
	position: relative;
	top: 0.15em;
	transform: rotate(-45deg);
	vertical-align: top;
	width: 1em;
  border-color: rgb(107 114 128 / var(--tw-text-opacity));;
}

.chevron.right:before {
	left: 0;
	transform: rotate(45deg);
}

.chevron.left:before {
	left: 0.25em;
	transform: rotate(-135deg);
}
</style>
