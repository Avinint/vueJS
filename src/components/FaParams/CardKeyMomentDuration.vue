<template>
  <CardModalSection title="Durée des temps forts" class="border border-gray-200 py-4 pr-4 rounded-lg">

    <div class="pl-8">
      <table class="param-fa key-moment-duration w-full text-left text-sm mb-4 text-gray-500">
        <thead class="text-black">
          <tr>
            <th scope="col" class="flex justify-between items-center">
              Par défaut
              <Button
                test="TeditKeyMoment"
                borderless
                icon="edit"
                couleur="secondary"
                @click="editTempsFortParFitArena()"
              />
            </th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ parametreFitArenas[PARAM_TEMPS_FORT]?.libelle }}</td>
            <td>
              <p class="bg-grey mx-1 px-4 py-2 rounded-lg w-2/12 text-center">{{ parametreFitArenas[PARAM_TEMPS_FORT]?.valeur }} min</p>
            </td>
          </tr>
          <tr>
            <td>{{ parametreFitArenas[PARAM_FIN]?.libelle }}</td>
            <td>
              <p class="bg-grey mx-1 px-4 py-2 rounded-lg w-2/12 text-center">{{ parametreFitArenas[PARAM_FIN]?.valeur }} sec</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!aucunParametre" class="pl-8 mt-12">
      <table v-for="(parametreActivite, index) of parametreActivites" :key="index" class="param-fa key-moment-duration w-full text-left text-sm mb-4 text-gray-500">
        <thead class="text-black">
          <tr>
            <th scope="col" class="flex justify-between items-center">
              {{ parametreActivite.activite.libelle }}
              <div class="flex gap-4">
                <p class="w-10">{{ parametreActivite[PARAM_TEMPS_FORT]?.actif ? 'Actif' : 'Inactif' }}</p>
                <label class="relative inline-flex cursor-pointer">
                  <input
                    :checked="parametreActivite[PARAM_TEMPS_FORT]?.actif"
                    type="checkbox"
                    :value="parametreActivite.duree_du_temps_fort?.actif"
                    class="peer sr-only"
                    @click="modifKeyMomentDuration(parametreActivite?.[PARAM_TEMPS_FORT], parametreActivite?.[PARAM_TEMPS_FORT].id)"
                  />
                  <div
                    class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"
                  ></div>
                  <span
                    class="ml-3 text-sm font-medium text-gray-900"
                  ></span>
                </label>
              </div>
              <div>
                <Button
                  test="TeditKeyMoment"
                  borderless
                  icon="edit"
                  couleur="secondary"
                  @click="editTempsFortParActivite(parametreActivite)"
                />
                <Button
                  test="TdeleteKeyMoment"
                  borderless
                  icon="delete"
                  couleur="secondary"
                  class="flex justify-end"
                  @click="removeKeyMomentDuration(parametreActivite)"
                />
              </div>
            </th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ parametreActivite[PARAM_TEMPS_FORT]?.libelle }}</td>
            <td>
              <p class="bg-grey mx-1 px-4 py-2 rounded-lg w-2/12 text-center">{{ parametreActivite[PARAM_TEMPS_FORT]?.valeur ?? 0 }} min</p>
            </td>
          </tr>
          <tr>
            <td>{{ parametreActivite[PARAM_FIN]?.libelle }}</td>
            <td>
              <p class="bg-grey mx-1 px-4 py-2 rounded-lg w-2/12 text-center">{{ parametreActivite[PARAM_FIN]?.valeur ?? 0 }} sec</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

      <!-- <Button
        v-if="ajoutPossibleParFitArena"
        id="TaddKeyMomentDurationForAnActivity"
        label="Ajouter une durée de temps fort à la Fit Arena"
        class="font-bold text-black"
        icon="add"
        couleur="secondary"
        @click="addKeyMomentDurationForFitArena"
      /> -->
    <ButtonRight
      v-if="ajoutPossibleParActivite"
      id="TaddKeyMomentDurationForAnActivity"
      label="Ajouter une durée de temps fort spécifique à une activité"
      class="ml-8"
      icon="add"
      couleur="danger"
      @click="addKeyMomentDurationForAnActivity"
    />
  </CardModalSection>

  <form @submit.prevent="saveTempsFort">
    <Modal
      v-if="modaleVisible"
      :title="modal_title"
      @cancel="closeModal"
    >
      <div>
        <div class="mb-6 flex items-center" v-if="modeFormulaire === 'ParActivite'">
          <label class="mb-2 block w-1/2 text-sm font-medium text-gray-900"
            >Activité</label
          >
          <select
            id="TfaSelectActivite"
            v-model="formulaire.activite"
            class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          >
            <template v-for="(activite, i) in activites" :key="i">
              <option v-if="activiteDisponible(activite)"
                :value="activite.id"
              >
                {{ activite.libelle }}
              </option>
            </template>
          </select>
        </div>
        <div class="mb-6 flex items-center">
          <label class="mb-2 block w-1/2 text-sm font-medium text-gray-900"
            >Durée d'un temps fort</label
          >
          <select
            v-if="durationsKeyMoment.length"
            v-model="formulaire.durationKeyMoment"
            class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          >
            <option
              v-for="(duration, i) in durationsKeyMoment"
              :key="i"
              :value="duration"
            >
              {{ duration }} min
            </option>
          </select>
        </div>
        <div class="mb-6 flex items-center">
          <label class="mb-2 block w-1/2 text-sm font-medium text-gray-900"
            >Durée soustraite à la fin du temps fort</label
          >
          <select
            v-if="durationsEnd.length"
            v-model="formulaire.durationEnd"
            class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          >
            <option
              v-for="(duration, i) in durationsEnd"
              :key="i"
              :value="duration"
            >
              {{ duration }} s
            </option>
          </select>
        </div>
      </div>
    </Modal>
  </form>
</template>

<script setup>
import Modal from '../common/Modal.vue'
import Input from "../common/Input.vue"
import Button from '../common/Button.vue'
import ButtonRight from '../common/ButtonRight.vue'
import CardModalSection from "@components/common/CardModalSection.vue"

import {
  postParametreActivite,
  updateParametreActivite,
  deleteParametreActivite,
  patchParametreActivite,
} from '@api/parametreActivite.js'
import { useParamStore } from '@stores/parametre.js'
import {
  deleteParametreFitArenaProfil,
  getParametreFitArena,
  postParametreFitArena,
  updateParametreFitArena
} from "@api/parametreFitArena.js";

import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { refThrottled } from "@vueuse/core";

const PARAM_TEMPS_FORT = 'duree_du_temps_fort'
const PARAM_FIN = 'duree_soustraite_a_la_fin_du_temps_fort'

const props = defineProps({params: Object, parametreActivites: Object})
const emits = defineEmits(["suppression"]) /** @deprecated  TODO remove */
const route = useRoute()
const params = useParamStore()

const parametreFitArenas = computed(() => params.parametres?.parametreFitArenas ?? {})
const parametreActivites = computed(() => params.parametres?.parametreActivites ?? {})
const activites = computed(() => params.activites ?? [])

const idFitArena = computed(() => route.params.id)
const profils = ref(null)

const formulaire = reactive({
  activite: null,
  durationKeyMoment: null,
  durationEnd: null,
  durationKeyMomentId: null,
  durationEndId: null
})

const modaleVisible = ref(false)
const modal_title = ref('')
const modeFormulaire = ref(["ParActivite"])
const durationsEnd = ['1', '2', '3', '4', '5']
const durationsKeyMoment = ['5', '10', '15', '20' , '25']

const aucunParametre = computed(() => !Object.keys(parametreActivites.value).length)

const ajoutPossibleParActivite = computed(() =>
  aucunParametre.value || activites.value.some(activite => activiteNonRenseignee(activite)))

const ajoutPossibleParFitArena = computed(() => Object.keys(parametreFitArenas?.value ?? {}).length === 0)

const activiteNonRenseignee = ({ code }) => !(code in parametreActivites.value)

const activiteDisponible = (activite) =>
  activiteNonRenseignee(activite) || parseInt(activite.id) === formulaire.activite

const rafraichir = async() => {
  await params.fetchParametres(idFitArena.value)
}

const reset = () => {
  formulaire.activite = null
  formulaire.durationKeyMoment = null
  formulaire.durationEnd = null
  formulaire.durationKeyMomentId = null
  formulaire.durationEndId = null
  formulaire.actif = true
}

const closeModal = () => {
  reset()
  modaleVisible.value = false
}

const addKeyMomentDurationForAnActivity = async () => {
  modal_title.value = 'Ajouter la durée de temps fort pour une activité'
  modaleVisible.value = true
  modeFormulaire.value = "ParActivite"
}

const addKeyMomentDurationForFitArena = async () => {
  modal_title.value = 'Ajouter la durée de temps fort pour la Fit Arena'
  modaleVisible.value = true
  modeFormulaire.value = "ParFitArena"
}

const modifKeyMomentDuration = async (parametre, id) => {
  parametre.actif = !parametre.actif
  try {
    await patchParametreActivite({ actif: parametre.actif }, id)

    toast.success('Modification du paramètre avec succès')
  } catch (e) {
    toast.error('Erreur, Veuillez contacter votre administrateur')
  }
}

const removeKeyMomentDuration = (parametreActivite) => {
  const ids = [parametreActivite[PARAM_TEMPS_FORT].id, parametreActivite[PARAM_FIN].id]
  emits('suppression', ids, deleteParametreActivite)
}

const editTempsFortParActivite = async (parametreActivite) => {
  formulaire.durationKeyMoment   = parametreActivite[PARAM_TEMPS_FORT]?.valeur
  formulaire.durationKeyMomentId = parametreActivite[PARAM_TEMPS_FORT]?.id
  formulaire.durationEnd         = parametreActivite[PARAM_FIN]?.valeur
  formulaire.durationEndId       = parametreActivite[PARAM_FIN]?.id
  formulaire.profils             = parametreActivite[PARAM_TEMPS_FORT]?.profils
  formulaire.activite            = parametreActivite.activite?.id
  formulaire.actif               = parametreActivite[PARAM_TEMPS_FORT]?.actif
  modaleVisible.value = true
  modeFormulaire.value = "ParActivite"
  modal_title.value = 'Modifier une durée de temps fort spécifique à une activité'
}

const editTempsFortParFitArena = async () => {
  formulaire.durationKeyMoment   = parametreFitArenas.value[PARAM_TEMPS_FORT].valeur
  formulaire.durationKeyMomentId = parametreFitArenas.value[PARAM_TEMPS_FORT].id
  formulaire.durationEnd         = parametreFitArenas.value[PARAM_FIN].valeur
  formulaire.durationEndId       = parametreFitArenas.value[PARAM_FIN].id
  formulaire.profils             = parametreFitArenas.value[PARAM_TEMPS_FORT].profils
  modaleVisible.value = true
  modeFormulaire.value = "ParFitArena"
  modal_title.value = 'Modifier une durée de temps fort global à la Fit Arena'
}

const saveTempsFort = async () => {
  if (modeFormulaire.value === "ParActivite") {
    saveTempsFortParActivite()
  } else if (modeFormulaire.value ==="ParFitArena") {
    saveTempsFortParFitArena()
  }
}

const saveTempsFortParFitArena = async () => {
  const paramTemp = {
    // profil:
    fitArena: '/api/fit_arenas/' + idFitArena.value,
    profils: formulaire.profils,
  }

  const params1 = {valeur: formulaire.durationKeyMoment, parametre: '/api/parametres/14'}
  const params2 = {valeur: formulaire.durationEnd, parametre: '/api/parametres/15'}

  try {
    if (formulaire.durationKeyMomentId !== null) {
      await updateParametreFitArena({ ...paramTemp, ...params1 }, formulaire.durationKeyMomentId);
      await updateParametreFitArena({ ...paramTemp, ...params2 }, formulaire.durationEndId);
    } else {
      await postParametreFitArena({ ...paramTemp, ...params1 })
      await postParametreFitArena({ ...paramTemp, ...params2 })
    }
    closeModal()
    toast.success('Temps fort sauvegardé avec succès')

    await rafraichir()
  } catch (e) {
    toast.error('Erreur, Veuillez contacter votre administrateur')
  }
}

const saveTempsFortParActivite = async () => {
  const paramTemp = {
    activite: '/api/activites/' + formulaire.activite,
    profils: formulaire.profils,
    actif: formulaire.actif,
  }

  const params1 = {valeur: formulaire.durationKeyMoment, parametre: '/api/parametres/14'}
  const params2 = {valeur: formulaire.durationEnd, parametre: '/api/parametres/15'}

  try {
    if (formulaire.durationKeyMomentId !== null) {
      await updateParametreActivite({ ...paramTemp, ...params1 }, formulaire.durationKeyMomentId);
      await updateParametreActivite({ ...paramTemp, ...params2 }, formulaire.durationEndId);
    } else {
      await postParametreActivite({ ...paramTemp, ...params1 })
      await postParametreActivite({ ...paramTemp, ...params2 })
    }
    closeModal()
    toast.success('Temps fort sauvegardé avec succès')
    emits('refresh')
    await rafraichir()

  } catch (e) {
    toast.error('Erreur, Veuillez contacter votre administrateur')
  }
}
</script>
