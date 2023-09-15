<template>
  <Card class="space-y-3 mb-10">
    <h1>Utilisateurs</h1>

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
            <!-- <th scope="col" class="w-5/12 px-6 py-3"></th> -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="bg-white">
            <td class="px-6 py-4">{{ user.nom }}</td>
            <td class="px-6 py-4">{{ user.nom }}</td>
            <td class="px-6 py-4">{{ user.email }}</td>
            <td class="px-6 py-4">{{ user.identifiant }}</td>

            <td class="px-6 py-4">
              <label class="relative inline-flex cursor-pointer items-center">
                <!-- <input
                  v-model="user.pmr"
                  type="checkbox"
                  value="true"
                  class="peer sr-only"
                  @change="modifiePMRUser(user)"
                /> -->
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
            <!-- <td class="px-6 py-4 flex">
              <Button
                test="TdeleteUser"
                borderless
                icon="delete"
                couleur="secondary"
                @click="removeUser(user.id)"
              />
              <Button
                test="TeditUser"
                borderless
                icon="edit"
                couleur="secondary"
                @click="editUser(user.id)"
              />
            </td> -->
          </tr>
        </tbody>
      </table>
    </div>
  </Card>
  <div class="flex justify-center items-center mb-10">
    <p v-if="page !== 1"><span @click="previousPage()" class="chevron left cursor-pointer"></span></p>
    <p class="pagination mx-10">{{ page }}</p>
    <p v-if="users.length > 0"><span @click="nextPage()" class="chevron right cursor-pointer"></span></p>
  </div>
</template>

<script setup>
// import Modal from '../components/common/Modal.vue'
// import ValidationModal from '../components/common/ValidationModal.vue'
// import Button from '../components/common/Button.vue'
// import ButtonRight from '../components/common/ButtonRight.vue'
import Card from '../components/common/Card.vue'
import Input from '../components/common/Input.vue'
// import MentionChampsObligatoires from "@components/common/MentionChampsObligatoires.vue";

import { getUsers, getUser, patchUser } from '../api/user.js'
import { onMounted, ref } from "vue"

const users = ref([])
const user = ref({})
const page = ref(1)

onMounted(async () => {
  users.value = await getUsers(1)
  users.value.sort(function compare(a, b) {
    if (a.nom.toLowerCase() < b.nom.toLowerCase()) {
      return -1
    }
    if (a.nom.toLowerCase() > b.nom.toLowerCase()) {
      return 1
    }
    return 0
  })
})

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

const modifiePMRUser = async ({ pmr, id }) => {
  try {
    await patchUser({ pmr }, id)
    toast.success('Modification effectuée avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }
}

const previousPage = async () => {
  page.value = page.value - 1
  users.value = await getUsers(page.value)
  window.scroll(0, 0)
}

const nextPage = async () => {
  page.value = page.value + 1
  users.value = await getUsers(page.value)
  window.scroll(0, 0)
}
</script>

<style scoped>
.chevron::before {
	border-style: solid;
	border-width: 0.25em 0.25em 0 0;
	content: '';
	display: inline-block;
	height: 1.45em;
	left: 0.15em;
	position: relative;
	top: 0.15em;
	transform: rotate(-45deg);
	vertical-align: top;
	width: 1.45em;
  border-color: #000;
}

.chevron.right:before {
	left: 0;
	transform: rotate(45deg);
}

.chevron.left:before {
	left: 0.25em;
	transform: rotate(-135deg);
}

.pagination {
  font-size: 1.45rem;
  color: #000;
}
</style>
