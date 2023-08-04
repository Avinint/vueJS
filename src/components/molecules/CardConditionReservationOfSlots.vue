<template>
  <Card>
    <h1>Condition de réservation des créneaux</h1>
    <div class="relative my-4 overflow-x-auto">
      <div class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <div
          v-for="(param, i) in parametres.parametresZone"
          :key="i"
          class="flex bg-white"
        >
          <div class="flex w-1/12 items-center justify-start">
            <Button
              test="TdeleteConditionReservation"
              borderless
              icon="delete"
              couleur="secondary"
              class="pl-0 pr-2"
              @click="removeConditionReservation(i)"
            />
            <Button
              test="TeditConditionReservation"
              borderless
              icon="edit"
              couleur="secondary"
              @click="editConditionReservation(i)"
            />
          </div>
          <div class="flex w-2/12 px-6 py-4">
            <p v-if="param.actif == true" class="w-2/12 pr-16">Actif</p>
            <p v-else class="w-2/12 pr-16">Inactif</p>
            <label class="relative inline-flex cursor-pointer items-center">
              <input
                v-model="param.actif"
                type="checkbox"
                value="true"
                class="peer sr-only"
                @change="modifConditionReservation(param)"
              />
              <div
                class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"
              ></div>
              <span
                class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
              ></span>
            </label>
          </div>
          <div class="flex w-8/12">
            <p class="w-8/12 px-6 py-4">
              Nombre de créneaux réservables par semaine (du lundi au vendredi)
              et par zone
            </p>
            <p class="px-6 py-4 text-black">{{ param.zone }}</p>
            <p class="px-6 py-4 text-black">{{ param.valeur }} créneau(x)</p>
          </div>
        </div>
      </div>
    </div>
    <Button
      id="TaddConditionReservation"
      label="Ajouter une condition de réservation des créneaux"
      class="font-bold text-black"
      icon="add"
      couleur="secondary"
      @click="addConditionReservation"
    />
  </Card>

  <form @submit.prevent="saveConditionReservation()">
    <Modal
      v-if="conditionReservation_modal"
      :title="modal_title"
      @cancel="conditionReservation_modal = false"
    >
      <div>
        <p class="mb-2 block text-sm font-medium text-gray-900">
          Accès à la Fit Arena réservé uniquement pour certains profils :
        </p>
        <!-- ajouter les profils en dynamique quand le back aura rajouté cette propriété dans le WS -->

        <!-- <div class="w-2/12 bg-light-blue text-center block mb-4 text-sm font-medium text-light-blue rounded-lg">
                    <p class="p-2">Adhérents</p>
                </div> -->

        <div class="mb-6 flex w-4/12 items-center">
          <select
            class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          >
            <option value="" disabled selected>Ajouter un profil</option>
            <option v-for="(profil, i) in profils" :key="i" :value="profil.id">
              {{ profil.libelle }}
            </option>
          </select>
        </div>
        <div class="mb-6 flex items-center">
          <label class="mb-2 block w-4/12 text-sm font-medium text-gray-900"
            >Zone</label
          >
          <select
            v-if="zoneParents.length"
            id="TfaSelectZone"
            v-model="zone_selected"
            class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          >
            <option
              v-for="(zoneParent, i) in zoneParents"
              :key="i"
              :value="zoneParent.id"
            >
              {{ zoneParent.libelle }}
            </option>
          </select>
        </div>
        <div class="mb-6 flex items-center">
          <label class="mb-2 block w-4/12 text-sm font-medium text-gray-900"
            >Nombre de créneaux</label
          >
          <select
            v-if="nbCreneaux.length"
            v-model="valeur_selected"
            class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          >
            <option
              v-for="(creneau, i) in nbCreneaux"
              :key="i"
              :value="creneau"
            >
              {{ creneau }} créneau(x)
            </option>
          </select>
        </div>
      </div>
    </Modal>
  </form>
</template>

<script setup>
import Card from '../../components/common/Card.vue'
import Modal from '../../components/common/Modal.vue'
import Button from '../../components/common/Button.vue'
import ButtonRight from '../../components/common/Button.vue'

import { getParametres, getParametresById } from '../../api/parametres.js'
import { getProfils } from '../../api/profil.js'
import { getZones } from '../../api/zone.js'
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import {
  deleteParametreFitArena,
  getParametreFitArena,
  updateParametreFitArena,
  postParametreFitArena,
  patchParametreFitArena,
} from '../../api/parametreFitArena.js'
import { getEquipements } from '../../api/equipement'
import { getTypeEquipements } from '../../api/typeEquipement'
const props = defineProps(['id'])
const route = useRoute()
const idFitArena = ref(route.params.id)
const parametres = ref({})
const parametre = ref({})
const profils = ref([])
const conditionReservation_modal = ref(false)
const modal_title = ref('')
const zoneParents = ref([])
const nbCreneaux = ['1', '5', '10', '15', '20']
const zone_selected = ref({})
const valeur_selected = ref({})
const equipements = ref([])
const typeEquipements = ref([])

const formulaireParZone = reactive({
  zone: null,
  valeur: null,

})

onMounted(async () => {
  parametres.value = await getParametresById(13)
  profils.value = await getProfils()
  zoneParents.value = await getZones(
    1,
    '&typeZone.code=espace&fitArena=' + idFitArena.value
  )
})


const addConditionReservation = () => {
  parametre.value = {}
  zone_selected.value = {}
  modal_title.value = 'Ajouter une condition de réservation des créneaux'
  conditionReservation_modal.value = true
  modeFormulaire.value = 'reservation'
}

const addConditionVisualisation = () => {
  parametre.value = {}
  zone_selected.value = {}
  modal_title.value = 'Ajouter une condition de réservation des créneaux'
  conditionReservation_modal.value = true
  modeFormulaire.value = 'visualisation'
}

const modifConditionReservation = async ({ actif, id }) => {
  try {
    await patchParametreZone({ actif }, id)
    toast.success('Modification du paramètre effectuée avec succès')
  } catch (e) {
    toast.error('Erreur, Veuillez contacter votre administrateur')
  }
}

const modifVisualisationReservation = async ({ actif, id }) => {
  try {
    await patchParametreZone({ actif }, id)
    toast.success('Modification du paramètre effectuée avec succès')
  } catch (e) {
    toast.error('Erreur, Veuillez contacter votre administrateur')
  }
}

const removeConditionReservation = async (i) => {
  try {
    await deleteParametreZone(i)
    toast.success('Succès de la suppression')
  } catch (e) {
    toast.error('Erreur, Veuillez contacter votre administrateur')
  }
  parametres.value = await getParametresById(13)
}

const editConditionReservation = (i) => {
  parametre.value = parametres.value[i]
  conditionReservation_modal.value = true
  modal_title.value = 'Modifier une condition de réservation des créneaux'
}

const saveConditionReservation = async (i) => {
  const paramTemp = {
    zone: '/api/zones/' + zone_selected.value,
    parametre: '/api/parametres/13',
    valeur: valeur_selected.value,
    actif: true,
  }

  if (modal_title.value.includes('modifier')) {
    try {
      const { data } = await updateParametreZone(paramTemp, parametre.value.id)
    } catch (e) {
      toast.error('Erreur, Veuillez contacter votre administrateur')
    }
  } else {
    try {
      const { data } = await postParametreZone(paramTemp)
    } catch (e) {
      toast.error('Erreur, Veuillez contacter votre administrateur')
    }
  }
  conditionReservation_modal.value = false
}

onMounted(async () => {
  equipements.value = await getEquipements(
    props.id,
    1,
    '&typeEquipement.categoryTypeEquipement.code=motorise'
  )
  typeEquipements.value = await getTypeEquipements(
    1,
    '&categoryTypeEquipement.code=motorise'
  )
})
</script>
