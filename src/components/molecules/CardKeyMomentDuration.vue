<template>
  <Card my2>
    <h1>Durée des temps forts</h1>
    <div class="my-2 w-1/2 rounded-lg border">
      <div class="relative my-4 overflow-x-auto text-black">
        <div class="flex px-6 py-4">

          <p class="w-7/12 font-bold">Par défaut</p>
          <Button
            v-if="!ajoutPossibleParFitArena"
            test="TeditKeyMoment"
            borderless
            icon="edit"
            couleur="secondary"
            @click="editTempsFortParFitArena(index)"
          />
        </div>
        <div v-if="props.params.duree_du_temps_fort?.id ?? false" class="mt-6 flex items-center font-light">
          <p class="ml-6 flex w-5/12 justify-start">{{ props.params.duree_du_temps_fort.libelle }}</p>
          <div class="bg-grey flex justify-end rounded-lg">
            <p class="flex p-2">{{ props.params.duree_du_temps_fort.valeur }} min</p>
          </div>
        </div>
        <div v-if="props.params.duree_soustraite_a_la_fin_du_temps_fort?.id ?? false" class="mt-6 flex items-center font-light">
          <p class="ml-6 flex w-5/12 justify-start">
            {{ props.params.duree_soustraite_a_la_fin_du_temps_fort.libelle }}
          </p>
          <div class="bg-grey flex justify-end rounded-lg">
            <p class="flex p-2">{{ props.params.duree_soustraite_a_la_fin_du_temps_fort.valeur }} sec</p>
          </div>
        </div>
      </div>
      <Button
        v-if="ajoutPossibleParFitArena"
        id="TaddKeyMomentDurationForAnActivity"
        label="Ajouter une durée de temps fort à la Fit Arena"
        class="font-bold text-black"
        icon="add"
        couleur="secondary"
        @click="addKeyMomentDurationForFitArena"
      />
    </div>
    <div class="my-2 w-1/2 rounded-lg border">
      <template v-for="(activite, index) in activites" :key="index">
        <div v-if="activite.parametreActivites.length" class="relative my-4 overflow-x-auto text-black" >
          <!-- dynamique à venir, quand le back et le front seront au même niveau -->
          <div class="flex px-6 py-4">
            <p class="w-3/12 font-bold">{{ activite.libelle }}</p>
            <p class="w-1/12 pr-16">Actif</p>
            <div>

            </div>
            <label class="relative inline-flex w-3/12 cursor-pointer">
              <input
                :checked="activite.parametres.duree_du_temps_fort?.actif"
                type="checkbox"
                :value="activite.parametres.duree_du_temps_fort?.actif"
                class="peer sr-only"
                @click="modifKeyMomentDuration(activite.parametres.duree_du_temps_fort, activite.parametres.duree_du_temps_fort.id)"
              />
              <div
                class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"
              ></div>
              <span
                class="ml-3 text-sm font-medium text-gray-900"
              ></span>
            </label>
            <Button
              test="TeditKeyMoment"
              borderless
              icon="edit"
              couleur="secondary"
              @click="editTempsFortParActivite(index)"
            />
            <Button
              test="TdeleteKeyMoment"
              borderless
              icon="delete"
              couleur="secondary"
              class="flex justify-end"
              @click="removeKeyMomentDuration(index)"
            />
          </div>
          <div class="mt-6 flex items-center font-light">
            <p class="ml-6 flex w-5/12 justify-start">{{ activite.parametres.duree_du_temps_fort?.libelle }}</p>
            <div class="bg-grey flex justify-end rounded-lg">
              <p class="flex p-2">{{ activite.parametres.duree_du_temps_fort?.valeur ?? 0 }} min</p>
            </div>
          </div>
          <div class="mt-6 flex items-center font-light">
            <p class="ml-6 flex w-5/12 justify-start">
              {{ activite.parametres.duree_soustraite_a_la_fin_du_temps_fort?.libelle }}
            </p>
            <div class="bg-grey flex justify-end rounded-lg">
              <p class="flex p-2"> {{ activite.parametres.duree_soustraite_a_la_fin_du_temps_fort?.valeur ?? 0 }} sec</p>
            </div>
          </div>
        </div>
      </template>
    </div>
    <Button
      v-if="ajoutPossibleParActivite"
      id="TaddKeyMomentDurationForAnActivity"
      label="Ajouter une durée de temps fort spécifique à une activité"
      class="font-bold text-black"
      icon="add"
      couleur="secondary"
      @click="addKeyMomentDurationForAnActivity"
    />
  </Card>

  <form @submit.prevent="saveTempsFort">
    <Modal
      v-if="modaleVisible"
      :title="modal_title"
      @cancel="closeModal"
    >
      <div>
<!--        <p class="mb-2 block text-sm font-medium text-gray-900">-->
<!--          Accès à la Fit Arena réservé uniquement pour certains profils :-->
<!--        </p>-->
<!--        <div-->
<!--          class="bg-light-blue text-light-blue mb-4 block w-2/12 rounded-lg text-center text-sm font-medium"-->
<!--        >-->
<!--          <p class="p-2">Adhérents</p>-->
<!--        </div>-->

<!--        <div class="mb-6 flex items-center">-->
<!--          <select-->
<!--            multiple-->
<!--            v-model="formulaire.profils"-->
<!--            class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"-->
<!--          >-->
<!--            <option value="" disabled>Ajouter un profil</option>-->
<!--            <option v-for="(profil, i) in profils" :key="i" :value="'/api/profils/' + profil.id">-->
<!--              {{ profil.libelle }}-->
<!--            </option>-->
<!--          </select>-->
<!--        </div>-->
        <div class="mb-6 flex items-center" v-if="modeFormulaire  === 'ParActivite'">
          <label class="mb-2 block w-1/2 text-sm font-medium text-gray-900"
            >Activité</label
          >
          <select
            id="TfaSelectActivite"
            v-model="formulaire.activite"
            class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          >
            <template v-for="(activite, i) in activites"
                       :key="i">
              <option v-if="!Object.keys(activite.parametres).length || activite.id === formulaire.activite"
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
import Card from '../common/Card.vue'
import Modal from '../common/Modal.vue'
import Button from '../common/Button.vue'
import ButtonRight from '../common/Button.vue'

import { getParametresById } from '@api/parametres.js'
import {
  postParametreActivite,
  updateParametreActivite,
  deleteParametreActivite,
  patchParametreActivite,
} from '@api/parametreActivite.js'
import { getProfils } from '@api/profil.js'
import { getActivites } from '@api/activite.ts'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { getParametreFitArena, postParametreFitArena, updateParametreFitArena } from "@api/parametreFitArena.js";

const props = defineProps({params: Object})
const emit = defineEmits(["refresh"])
const route = useRoute()
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

const activites = ref([])
const durationsEnd = ['1', '2', '3', '4', '5']
const durationsKeyMoment = ['5', '10', '15', '20', '25']

const ajoutPossibleParActivite = computed(() => {
  return activites.value.some((activite => !activite.parametreActivites.length))
})

const ajoutPossibleParFitArena = computed(() => Object.keys(props.params).length  === 0)

const parametres = computed(() => props.params)

onMounted(async () => {
  await dynamiseParametresParActivites()
})

const dynamiseParametresParActivites = async () => {
  activites.value = await getActivites(idFitArena.value)
  for (const activite of activites.value) {
    activite.parametres = {}
    for (const paramActivite of activite.parametreActivites) {
      activite.parametres[paramActivite.parametre.code] = {
        libelle: paramActivite.parametre.libelle,
        valeur: paramActivite.valeur,
        actif: paramActivite.actif,
        id: paramActivite.id,
      }
    }

  }

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

const removeKeyMomentDuration = async (i) => {
  try {
    for (const prop in activites.value[i].parametres) {
     const paramActiviteId = activites.value[i].parametres[prop].id
      await deleteParametreActivite(paramActiviteId)
    }
    // activites.value[i].parametres = {}
    await dynamiseParametresParActivites()
    toast.success('Succès de la suppression')
  } catch (e) {
    toast.error('Erreur, Veuillez contacter votre administrateur')
  }
}

const editTempsFortParActivite = async (i, ) => {

  const params = activites.value[i].parametres
  formulaire.durationKeyMoment   = params.duree_du_temps_fort.valeur
  formulaire.durationKeyMomentId = params.duree_du_temps_fort.id
  formulaire.durationEnd         = params.duree_soustraite_a_la_fin_du_temps_fort.valeur
  formulaire.durationEndId       = params.duree_soustraite_a_la_fin_du_temps_fort.id
  formulaire.profils             = params.duree_du_temps_fort.profils
  formulaire.activite            = activites.value[i].id
  formulaire.actif               = params.duree_du_temps_fort.actif
  modaleVisible.value  = true
  modeFormulaire.value = "ParActivite"
  modal_title.value = 'Modifier une durée de temps fort spécifique à une activité'
}

const editTempsFortParFitArena = async (i,) => {
  formulaire.durationKeyMoment   = parametres.value.duree_du_temps_fort.valeur
  formulaire.durationKeyMomentId = parametres.value.duree_du_temps_fort.id
  formulaire.durationEnd         = parametres.value.duree_soustraite_a_la_fin_du_temps_fort.valeur
  formulaire.durationEndId       = parametres.value.duree_soustraite_a_la_fin_du_temps_fort.id
  formulaire.profils             = parametres.value.duree_du_temps_fort.profils

  modaleVisible.value  = true
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
    await emit('refresh')

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
      await updateParametreActivite({ ...paramTemp, ...params2 },   formulaire.durationEndId);
    } else {
      await postParametreActivite({ ...paramTemp, ...params1 })
      await postParametreActivite({ ...paramTemp, ...params2 })
    }

    closeModal()
    toast.success('Temps fort sauvegardé avec succès')
    await dynamiseParametresParActivites()

  } catch (e) {
    toast.error('Erreur, Veuillez contacter votre administrateur')
  }
}
</script>
