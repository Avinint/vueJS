<template>
  <CrudList
    entity="animateur"
    plural="animateurs"
    :columns="crud_columns"
    :data="getTableData()"
    :can-all="isAdmin || isGestCo || isGestOrg"
    @entity:new="createAnimateur"
    @entity:edit="editAnimateur"
    @entity:remove="removeAnimateur"
  />
  <form @submit.prevent="hydrateAnimateur">
    <Modal
      v-if="afficherFormulaire"
      :type="readonly ? 'visualiser' : 'classic'"
      :title="modal_title"
      @cancel="cancel()"
    >
      <CardModalSection title="ÉTAT CIVIL">
        <template #content>
          <Input
            id="TanimNom"
            v-model="nom"
            :readonly="readonly"
            type="text"
            label="Nom"
            :inline="true"
            placeholder="Nom"
            class="mb-4"
            required
          />
          <Input
            id="TanimPrenom"
            v-model="prenom"
            :readonly="readonly"
            type="text"
            label="Prénom"
            :inline="true"
            placeholder="Prénom"
            class="mb-4"
            required
          />
          <Input
            id="TanimTel"
            v-model="telephone"
            :readonly="readonly"
            type="text"
            label="Numéro de téléphone"
            :inline="true"
            placeholder="0601010101"
            :validation="[phoneValidation]"
            class="mb-4"
          />
          <Input
            id="TanimMail"
            v-model="email"
            :readonly="readonly"
            :type="'email'"
            label="Adresse email"
            :inline="true"
            :validation="[emailValidation]"
            required
          />
          <div class="flex items-center">
            <div class="w-1/2"></div>
            <div class="w-full">
              <p class="text-info">L'animateur recevra un email à cette adresse afin d’activer ses accès animateurs</p>
            </div>
          </div>
        </template>
      </CardModalSection>
      <CardModalSection title="CARTE D'ACCÈS">
        <template #content>
          <div class="my-6 flex items-center">
            <p class="w-4/12 label-text"
              >Titulaire d'une carte d'accès :</p
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
            </label>
          </div>
          <Input
            v-if="titulaireCarte"
            id="TcarteCodePin"
            v-model="carteActive.codePin"
            :inline="true"
            :readonly="readonly"
            type="text"
            label="Code PIN"
            :validation="[codePinValidation]"
            required
          />
        </template>
      </CardModalSection>
      <CardModalSection v-if="carteActive.actif === true" title="QR CODE">
        <template #content>
          <div>
            <p class="text-info">L’animateur peut retrouver son QR code sur son profil Fit Arena en se connectant à fit-arena.fr via l’adresse mail renseignée ci-dessus.</p>
            <div class="flex items-center justify-between mt-10">
              <div class="w-3/12 p-4 ml-2 ring-2 ring-offset-4 rounded-lg ring-gray-200">
                <img
                  alt="QR CODE Fit Arena"
                  :src="carteActive.qrCode"
                />
              </div>
              <div class="w-8/12">
                <ButtonRight
                  id="TAnimQRCodeImprimer"
                  icon="print"
                  couleur="danger"
                  class="w-full"
                  label="Imprimer le QR Code"
                />
              </div>
            </div>
          </div>
        </template>
      </CardModalSection>
      <MentionChampsObligatoires class="ml-4" />
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
    <ValidationModal
      v-if="modaleConfirmation === 'edit'"
      type="edit"
      @cancel="modaleConfirmation = false"
    >
    </ValidationModal>
  </form>

  <form @submit.prevent="addAnimateur()">
    <ValidationModal
      v-if="modaleConfirmation === 'add'"
      type="add"
      @cancel="modaleConfirmation = false"
    >
    </ValidationModal>
  </form>
</template>

<script setup>
import Card from '../components/common/Card.vue'
import Modal from '../components/common/Modal.vue'
import ValidationModal from '../components/common/ValidationModal.vue'
import ButtonRight from '../components/common/ButtonRight.vue'
import HeaderModal from '@components/common/HeaderModal.vue'
import CardModalSection from '@components/common/CardModalSection.vue'
import Input from '../components/common/Input.vue'
import { getAdresses } from '../api/address.js'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import { useUserStore } from '@/stores/user.js'

import {
  deleteAnimateur,
  getAnimateurs, getAnimateursParOrganisme,
  postAnimateur,
  putAnimateur,
} from '../api/animateur.ts'
import { selectOrganismes } from '../api/organisme.ts'
import CrudList from '@components/molecules/CrudList.vue'

import { computed, onMounted, reactive, ref, watch } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { isValid, emailValidation, codePinValidation, phoneValidation } from '@/validation.js'
import MentionChampsObligatoires from "@components/common/MentionChampsObligatoires.vue";

const { isAdmin, isGestCo, isGestOrg } = useUserStore()
const modaleConfirmation = ref(false)
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
const organismeId = ref(null)
const organismeValue = ref([])
const carteActive = ref({ codePin: null, actif: false })
const modal_title = ref('')
let client = ref({})
const validation = ref({})
const organismes = ref([])

const crud_columns = [
  { data: (e) => e.nom, label: 'Nom' },
  { data: (e) => e.prenom, label: 'Prénom' },
  { data: (e) => e.email, label: 'E-mail' },
  { data: (e) => e.telephone, label: 'Téléphone' },
  { data: (e) => e.titulaireCarte, label: 'Titulaire carte' },
  { data: (e) => e.organisme.libelle, label: 'Organisme' },
]
function getTableData() {
  return animateurs.value.map((animateur) => {
    return {
      data: animateur,
      editable: true,
      removable: true,
    }
  })
}

const route = useRoute()
onMounted(async () => {
  organismes.value = await selectOrganismes()
  organismeId.value = route.params?.id ? parseInt(route.params?.id) : null
  animateurs.value = organismeId.value ? await getAnimateursParOrganisme(organismeId.value) : await getAnimateurs()
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
  carteActive.value.codePin = null
  carteActive.value.qrCode = null
  carteActive.value.actif = false
  carteActive.value.carteId = null
}

const desactiverCarte = () => {
  carteActive.value.actif = false
}

const cancel = () => {
  reset()
  afficherFormulaire.value = false
}

const removeAnimateur = (animateur) => {
  deleteAnimateurId.value = animateur.id
  modaleConfirmation.value = 'delete'
}

const removeAnimateurValidation = async () => {
  try {
    await deleteAnimateur(deleteAnimateurId.value)
    toast.success('Suppression effectuée avec succès')
  } catch (e) {
    toast.error('Une erreur est survenue')
  }
  modaleConfirmation.value = false
  deleteAnimateurId.value = 0
  animateurs.value = await getAnimateursParOrganisme(organismeId.value)
}

const editAnimateur = (animateur) => {
  // const animateur = animateurs.value[i]
  mapApiToData(animateur)
  afficherFormulaire.value = true
  readonly.value = false
  modal_title.value = 'Modifier un animateur'
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
    carteActive: ref(carteActive),
  }
  animateur.value.carteActive.actif = animateur.value.titulaireCarte

  if (id_selected.value) {
    modaleConfirmation.value = 'edit'
  } else {
    modaleConfirmation.value = 'add'
  }

  animateur.value.organismeId = organismeId.value
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

  animateurs.value = await getAnimateursParOrganisme(organismeId.value)
}

const addAnimateur = async () => {
  try {
    await postAnimateur(animateur)
    toast.success('Ajout effectué avec succès')
  } catch (e)   {
    toast.error('Une erreur est survenue')
  }

  modaleConfirmation.value = false
  afficherFormulaire.value = false

  animateurs.value = await getAnimateursParOrganisme(organismeId.value)
}
//
// watch(organismeValue,  (newVal, oldVal) =>
// {
//     organismeId.value = newVal.id;
// })

const removeFrom = (refArray, i) => {
  refArray.value = refArray.value
  .slice(0, i)
  .concat(refArray.value.slice(i + 1))
}
</script>

<style scoped>
.divider {
  width: 20px;
  height: 1px;
  border: 1px solid #DE001A;
}

.text-info {
  font-size: 1rem;
  color: black;
  margin-top: 1rem;
}

.label-text {
  --tw-text-opacity: 1;
  color: rgb(17 24 39 / var(--tw-text-opacity));
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
}
</style>