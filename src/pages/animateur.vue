<template>
  <Card class="space-y-3">
    <h1>Animateur</h1>

    <div class="relative overflow-x-auto">
      <table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead
          class="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
        >
        <tr>
          <th scope="col" class="px-6 py-3"></th>
          <th scope="col" class="px-6 py-3">Nom</th>
          <th scope="col" class="px-6 py-3">Prénom</th>
          <th scope="col" class="px-6 py-3">E-mail</th>
          <th scope="col" class="px-6 py-3">Téléphone</th>
          <th scope="col" class="px-6 py-3">Titulaire carte</th>
          <th scope="col" class="px-6 py-3">Organisme</th>
          <th scope="col" class="px-6 py-3"></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(animateur, i) in animateurs" :key="i" class="bg-white">
          <td class="flex items-center justify-center p-3">
            <Button
              test="TdeleteClient"
              borderless
              icon="delete"
              type="secondary"
              @click="removeAnimateur(animateur.id)"
            />
            <Button
              test="TeditClient"
              borderless
              icon="edit"
              type="secondary"
              @click="editAnimateur(i)"
            />
          </td>
          <td class="px-6 py-4">{{ animateur.nom }}</td>
          <td class="px-6 py-4">{{ animateur.prenom }}</td>
          <td class="px-6 py-4">{{ animateur.email }}</td>
          <td class="px-6 py-4">{{ animateur.telephone }}</td>
          <td class="px-6 py-4">{{ animateur.titulaireCarte ? 'oui' : 'non' }}</td>
          <td class="px-6 py-4">{{ animateur.organisme.libelle }}</td>
          <td class="px-6 py-4">
            <Button label="Détails" type="secondary" @click="showAnimateur(i)"/>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <Button
      id="TaddAnimateur"
      label="Ajouter un Animateur"
      icon="add"
      type="secondary"
      @click="createAnimateur"
    />
  </Card>
  <form @submit.prevent="hydrateAnimateur">
    <Modal
      v-if="afficherFormulaire"
      :type="readonly ? 'visualiser' : 'classic'"
      :title="modal_title"
      @cancel="cancel()"
    >
      <Card class="w-full space-y-2">
        <!--        <h3>Ajouter un animateur</h3>-->

        <div class="flex items-center">
          <Input
            id="TanimNom"
            v-model="nom"
            :readonly="readonly"
            type="text"
            label="Nom"
            :required="true"
            class="w-full"
          />
        </div>
        <div class="flex items-center">
          <Input
            id="TanimPrenom"
            v-model="prenom"
            :readonly="readonly"
            type="text"
            label="Prénom"
            :required="true"
            class="w-full"
          />
        </div>
        <div class="flex items-center">
          <Input
            id="TanimMail"
            v-model:valid="validation.email"
            v-model="email"
            :readonly="readonly"
            type="email"
            label="E-mail"
            :required="true"
            class="w-full"
          />
        </div>
        <div class="flex items-center">
          <Input
            id="TanimTel"
            v-model="telephone"
            :readonly="readonly"
            type="text"
            label="Téléphone"
            :required="true"
            class="w-full"
          />
        </div>
        <div class="flex items-center" v-if="!id_selected">
          <label class="mb-2 block w-1/2 text-sm font-medium text-gray-900"
          >Organisme</label
          >
          <div v-if="!readonly" class="flex items-center">
            <div class="mr-1.5 block"></div>
            <select
              v-if="organismes.length"
              id="TSelectOrganisme"
              v-model="organismeId"
              class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              @change="selectionOrganisme"
            >
              <option v-for="(organisme, i) in organismes" :key="i" :value="organisme.id">
                {{ organisme.label }}
              </option>
            </select>
          </div>

        </div>

        <div class="flex items-center">
        <span class="mb-2 block w-4/12 text-sm font-medium text-gray-900"
        >Titulaire carte :</span
        >
          <label class="relative inline-flex cursor-pointer items-center">
            <input
              v-model="titulaireCarte"
              :disabled="readonly"
              type="checkbox"
              :value="false"
              class="peer sr-only"
            />
            <div
              class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"
            ></div>
            <!-- <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span> -->
          </label>
        </div>
        <Button
          v-if="!readonly && carteActive.actif === false"
          id="TeditionCarteAcces"
          label="Ajouter une carte d'accès"
          icon="add"
          type="secondary"
          @click="carteActive.actif = true"
        />
      </Card>
      <Card class="w-full space-y-2" v-if="carteActive.actif === true">

        <h3>Carte d'accès</h3>
        <div class="flex items-center">

          <Input
            id="TcarteCodePin"
            v-model="carteActive.codePin"
            :readonly="readonly"
            :required="true"
            type="text"
            label="Code PIN"
            maxlength="6"
            pattern="\d{6}"
            class="w-full"
          />
          &nbsp;
          <Button @click="desactiverCarte"
                  v-if="!readonly"
                  icon="cross"
                  type="danger"
                  id="TdesactivationCarteAcces"/>

        </div>
        <div v-if="carteActive?.qrCode" class="flex items-center">


          <img alt="qr code" :src="'data:image/jpeg;base64,' + carteActive.qrCode"/>
        </div>
      </Card>
    </Modal>
  </form>

  <form @submit.prevent="removeAnimateurValidation()">
    <ValidationModal
      v-if="modaleConfirmation === 'delete'"
      type="delete"
      @cancel="modaleConfirmation = false"
    >
    </ValidationModal>
  </form>

  <form @submit.prevent="updateAnimateur()">
    <ValidationModal v-if="modaleConfirmation === 'edit'" type="edit" @cancel="modaleConfirmation = false">
    </ValidationModal>
  </form>

  <form @submit.prevent="addAnimateur()">
    <ValidationModal v-if="modaleConfirmation === 'add'" type="add" @cancel="modaleConfirmation = false">
    </ValidationModal>
  </form>
</template>

<script setup>
import Card from '../components/common/Card.vue'
import Modal from '../components/common/Modal.vue'
import ValidationModal from '../components/common/ValidationModal.vue'
import Button from '../components/common/Button.vue'
import Input from '../components/common/Input.vue'
import { getAdresses } from '../api/address.js'
import {
  deleteAnimateur,
  getAnimateurs,
  postAnimateur,
  putAnimateur,
} from '../api/animateur.js'
import {
  selectOrganismes
} from '../api/organisme.js'
import { onMounted, reactive, ref, watch, } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { isValid, emailValidation } from "@/validation.js";

const modaleConfirmation = ref(false);
const afficherFormulaire = ref(false)
const readonly = ref(false)

const animateurs = ref([])

const delete_modal = ref(false)
const deleteAnimateurId = ref(0)
const animateur = ref({})
const edit_modal = ref(false)
const add_modal = ref(false)

const id_selected = ref(0)
const nom = ref('')
const prenom = ref('')
const email = ref('')
const telephone = ref('')
const titulaireCarte = ref(false)
const organismeId = ref(0)
const organismeValue = ref([])
const carteActive = ref({ codePin: null, actif: false })
const modal_title = ref('')
let client = ref({})
const validation = ref({})
const organismes = ref([])

onMounted(async () => {
  organismes.value = await selectOrganismes()
  animateurs.value = await getAnimateurs()
})

const createAnimateur = () => {
  reset()
  afficherFormulaire.value = true
  readonly.value = false
  modal_title.value = 'Ajouter un Animateur'
}

const reset = async () => {
  nom.value = ''
  prenom.value = ''
  email.value = ''
  titulaireCarte.value = false
  telephone.value = ''
  id_selected.value = 0
  organismeId.value = 0
  carteActive.value.codePin = null
  carteActive.value.qrCode = null
  carteActive.value.actif = false
  carteActive.value.carteId = null
}

const desactiverCarte = () => {
  carteActive.value.actif = false
}

const cancel = () => {
  reset();
  afficherFormulaire.value = false;
}

const removeAnimateur = (id) => {
  deleteAnimateurId.value = id
  modaleConfirmation.value = 'delete'
  // delete_modal.value = true
}

const removeAnimateurValidation = async (id) => {
  try {
    await deleteAnimateur(deleteAnimateurId.value)
    toast.success("Suppression effectuée avec succès")
  } catch (e) {
    toast.error("Une erreur est survenue")
  }
  modaleConfirmation.value = false
  deleteAnimateurId.value = 0
  animateurs.value = await getAnimateurs()
}

const editAnimateur = (i) => {
  const animateur = animateurs.value[i]
  mapApiToData(animateur)
  afficherFormulaire.value = true
  readonly.value = false
  modal_title.value = "Modifier un animateur"
}

const showAnimateur = async (i) => {
  const animateur = animateurs.value[i]
  mapApiToData(animateur)
  afficherFormulaire.value = true
  readonly.value = true
  modal_title.value = "Informations de l'animateur"
}

const mapApiToData = (animateur) => {
  nom.value = animateur.nom
  prenom.value = animateur.prenom
  email.value = animateur.email
  telephone.value = animateur.telephone
  titulaireCarte.value = animateur.titulaireCarte
  id_selected.value = animateur.id
  for (const prop in animateur.carteActive) {
    carteActive.value[prop] = animateur.carteActive[prop]
  }

}

const hydrateAnimateur = () => {

  if (!isValid(validation)) return

  animateur.value = {
    nom: nom.value,
    prenom: prenom.value,
    email: email.value,
    telephone: telephone.value,
    titulaireCarte: titulaireCarte.value,
    carteActive: ref(carteActive)
  }

  if (animateur.value.carteActive.active) {
    animateur.value.titulaireCarte = true;
  }

  if (id_selected.value) {
    modaleConfirmation.value = 'edit'
  } else {
    modaleConfirmation.value = 'add'
    animateur.value.organismeId = organismeId.value
  }
}

const updateAnimateur = async () => {
  try {
    await putAnimateur(animateur, id_selected.value)
    toast.success('Modification effectuée avec succès')

  } catch (e) {
    toast.error('Une erreur est survenue')

  }

  modaleConfirmation.value = false
  afficherFormulaire.value = false

  animateurs.value = await getAnimateurs()
}

const addAnimateur = async () => {
  try {
    await postAnimateur(animateur)
    toast.success('Ajout effectué avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }

  modaleConfirmation.value = false
  afficherFormulaire.value = false

  animateurs.value = await getAnimateurs()
}
//
// watch(organismeValue,  (newVal, oldVal) =>
// {
//     organismeId.value = newVal.id;
// })


const removeFrom = (refArray, i) => {
  refArray.value = refArray.value.slice(0, i).concat(refArray.value.slice(i + 1));
}
</script>
