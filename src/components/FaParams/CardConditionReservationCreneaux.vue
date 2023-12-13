<template>
  <CardModalSection title="Condition de réservation des créneaux" class="border border-gray-200 py-4 pr-4 rounded-lg">
    <div v-if="parametreZones" class="pl-8">
      <table class="param-fa w-full text-left text-sm mb-4 text-gray-500">
        <thead
          class="hidden"
        >
          <tr>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(param, i) in parametreZones[CODE_PARAMETRE]" :key="`paramzone-`+ i">
            <td>Nombre de créneaux réservables par semaine (du lundi au vendredi) et par zone</td>
            <td class="flex items-center gap-4">
              <p class="px-6 w-16">{{ param.actif ? 'Actif' : 'Inactif' }}</p>
              <label class="relative inline-flex cursor-pointer">
                <input
                  :checked="param.actif"
                  type="checkbox"
                  :value="param.actif"
                  class="peer sr-only"
                  @click="modifConditionReservation(param)"
                />
                <div
                  class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"
                ></div>
                <span
                  class="ml-3 text-sm font-medium text-gray-900"
                ></span>
              </label>
              <p class="bg-grey mx-1 px-4 py-2 flex justify-end rounded-lg">{{ param.zone.libelle }}</p>
              <p class="bg-grey mx-1 px-4 py-2 flex justify-end rounded-lg">{{ param.valeur }} créneau{{ param.valeur > 1 ? 'x' : '' }}</p>
            </td>
            <td>
              <Button
                test="TeditConditionReservation"
                borderless
                icon="edit"
                couleur="secondary"
                @click="editConditionReservation(param)"
              />
            </td>
            <td>
              <Button
                test="TdeleteConditionReservation"
                borderless
                icon="delete"
                couleur="secondary"
                @click="removeConditionReservation(param)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <ButtonRight
      v-if="zonesDisponibles?.length"
      id="TaddConditionReservation"
      label="Ajouter une condition de réservation des créneaux"
      icon="add"
      couleur="danger"
      class="ml-8"
      @click="addConditionReservation"
    />
  </CardModalSection>

  <form @submit.prevent="saveConditionReservation()">
    <Modal
      v-if="formulaireVisible"
      :title="modal_title"
      @cancel="fermerModale"
    >
      <div>
        <div class="mb-6 flex items-center">
          <label class="mb-2 block w-4/12 text-sm font-medium text-gray-900"
            >Zone</label
          >
          <select
            id="TfaSelectZone"
            v-model="formulaire.zone"
            class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          >
            <option
              v-for="(zoneParent, i) in zonesDisponibles"
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
            v-model="formulaire.valeur"
            class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
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
import Input from "../common/Input.vue"
import Modal from '../../components/common/Modal.vue'
import Button from '../../components/common/Button.vue'
import ButtonRight from '../../components/common/ButtonRight.vue'
import CardModalSection from "@components/common/CardModalSection.vue"

import { useParamStore } from "@stores/parametre.js"
import { getZones } from '../../api/zone.js'
import {
  deleteParametreFitArena,
  getParametreFitArena,
  updateParametreFitArena,
  postParametreFitArena,
  patchParametreFitArena,
} from '../../api/parametreFitArena.js'
import { deleteParametreZone, patchParametreZone, postParametreZone, updateParametreZone } from "@api/parametreZone.js";

import { computed, onMounted, reactive, ref, toRaw } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const CODE_PARAMETRE = 'nombre_de_creneaux_reservables_par_semaine_et_par_zone'
const props = defineProps(['id'])
const route = useRoute()
const params = useParamStore()
const formulaireVisible = ref(false)
const modal_title = ref('')
const zoneParents = ref([])
const nbCreneaux = ['1', '5', '10', '15', '20']

const formulaire = reactive({
  zone: null,
  valeur: null,
  id: null
})

const emits = defineEmits(['suppression'])

const reset = () => {
  for (const champ in formulaire) {
    formulaire[champ] = null
  }
}

const fermerModale = () => {
  formulaireVisible.value = false
  reset()
}

const idFitArena = computed(() => route.params.id)
const parametreZones = computed(() => params.parametreZones)

onMounted(async () => {
  zoneParents.value = await getZones({ 'order[ordre]': 'asc', "typeZone.code": "espace", fitArena: idFitArena.value })
})

const addConditionReservation = () => {
  modal_title.value = 'Ajouter une condition de réservation des créneaux'
  formulaireVisible.value = true
}

const modifConditionReservation = async ({ actif, id}) => {
  try {
    await patchParametreZone({ actif }, id)
    toast.success('Modification du paramètre effectuée avec succès')
  } catch (e) {
    toast.error('Erreur, Veuillez contacter votre administrateur')
  }
}

const removeConditionReservation = ({id}) => {
  emits('suppression', id, deleteParametreZone)
}

const zonesDisponibles = computed(() => {
  const zonesUtilisees = parametreZones.value?.[CODE_PARAMETRE]?.map(param => param.zone.id) ?? []
  return toRaw(zoneParents.value).filter((zone) => !zonesUtilisees.includes(zone.id) || zone.id === formulaire.zone)
})

const editConditionReservation = async({id, valeur, zone: {id: zoneId}}) => {
  formulaire.id = id
  formulaire.valeur = valeur
  formulaire.zone = zoneId
  formulaireVisible.value = true
  modal_title.value = 'Modifier une condition de réservation des créneaux'
}

const saveConditionReservation = async () => {
  const paramTemp = {
    zone: '/api/zones/' + formulaire.zone,
    parametre: '/api/parametres/13',
    valeur: formulaire.valeur,
    actif: true,
  }

  if (modal_title.value.includes('Modifier')) {
    try {
      await updateParametreZone(paramTemp, formulaire.id)
      toast.success('Modification du paramètre effectuée avec succès')
      await rafraichir()
    } catch (e) {
      toast.error('Erreur, Veuillez contacter votre administrateur')
    }
  } else {
    try {
      await postParametreZone(paramTemp)
      toast.success('Modification du paramètre effectuée avec succès')
      await rafraichir()
    } catch (e) {
      toast.error('Erreur, Veuillez contacter votre administrateur')
    }
  }
  fermerModale()
}

const rafraichir = async () => {
  await params.fetchParametres(idFitArena.value)
}
</script>
