<template>
    <Card>
        <h1>Condition de réservation des créneaux</h1>
        <div class="relative overflow-x-auto my-4">
            <div class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <div class="bg-white flex" v-for="(param, i) in parametres.parametresZone" :key="i">
                    <div class="flex justify-start items-center w-1/12">
                        <Button test="TdeleteConditionReservation" borderless icon="delete" type="secondary" class="pl-0 pr-2" @click="removeConditionReservation(i)" />
                        <Button test="TeditConditionReservation" borderless icon="edit" type="secondary" @click="editConditionReservation(i)" />
                    </div>
                    <div class="px-6 py-4 flex w-2/12">
                        <p v-if="param.actif == true" class="w-2/12 pr-16">Actif</p>
                        <p v-else class="w-2/12 pr-16">Inactif</p>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" value="true" v-model="param.actif" class="sr-only peer" @change="modifConditionReservation(param)">
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-400"></div>
                            <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
                        </label>
                    </div>
                    <div class="w-8/12 flex">
                        <p class="px-6 py-4 w-8/12">Nombre de créneaux réservables par semaine (du lundi au vendredi) et par zone</p>
                        <p class="px-6 py-4 text-black">{{ param.zone }}</p>
                        <p class="px-6 py-4 text-black">{{ param.valeur }} créneau(x)</p>
                    </div>
                </div>
            </div>
        </div>
        <Button label="Ajouter une condition de réservation des créneaux" class="font-bold text-black" icon="add" type="secondary" @click="addConditionReservation" id="TaddConditionReservation" />
    </Card>

    <form @submit.prevent="saveConditionReservation()">
        <Modal v-if="conditionReservation_modal" :title="modal_title" @cancel="conditionReservation_modal = false">
            <div>
                <p class="block mb-2 text-sm font-medium text-gray-900">Accès à la Fit Arena réservé uniquement pour certains profils :</p>
                <!-- ajouter les profils en dynamique quand le back aura rajouté cette propriété dans le WS -->

                <!-- <div class="w-2/12 bg-light-blue text-center block mb-4 text-sm font-medium text-light-blue rounded-lg">
                    <p class="p-2">Adhérents</p>
                </div> -->

                <div class="flex items-center w-4/12 mb-6">
                    <select class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option value="" disabled selected>Ajouter un profil</option>
                        <option v-for="(profil, i) in profils" :key="i" :value="profil.id">{{profil.libelle}}</option>
                    </select>
                </div>
                <div class="flex items-center mb-6">
                    <label class="block mb-2 text-sm font-medium text-gray-900 w-4/12">Zone</label>
                    <select v-if="zoneParents.length" v-model="zone_selected" id="TfaSelectZone" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option v-for="(zoneParent, i) in zoneParents" :key="i" :value="zoneParent.id">{{zoneParent.libelle}}</option>
                    </select>
                </div>
                <div class="flex items-center mb-6">
                    <label class="block mb-2 text-sm font-medium text-gray-900 w-4/12">Nombre de créneaux</label>
                    <select v-if="nbCreneaux.length" v-model="valeur_selected" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option v-for="(creneau, i) in nbCreneaux" :key="i" :value="creneau">{{ creneau }} créneau(x)</option>
                    </select>
                </div>
            </div>
        </Modal>
    </form>
</template>

<script setup>
import Card from "../../components/common/Card.vue"
import Modal from "../../components/common/Modal.vue"
import Button from "../../components/common/Button.vue"
import ButtonRight from "../../components/common/Button.vue"

import {
  getParametres,
  getParametresById,
} from "../../api/parametres.js"
import {getProfils} from "../../api/profil.js"
import {getZones} from "../../api/zone.js"
import {onMounted, ref} from "vue"
import {useRoute} from "vue-router"
import {toast} from 'vue3-toastify'
import "vue3-toastify/dist/index.css"
import {
  deleteParametreFitArena,
  getParametreFitArena,
  updateParametreFitArena,
  postParametreFitArena,
  patchParametreFitArena
} from "../../api/parametreFitArena.js";
import {getEquipements} from "../../api/equipement";
import {getTypeEquipements} from "../../api/typeEquipement";
const props = defineProps(['id'])
const route = useRoute()
const idFitArena = ref(route.params.id)
const parametres = ref({})
const parametre = ref({})
const profils = ref({})
const conditionReservation_modal = ref(false)
const modal_title = ref('')
const zoneParents = ref([])
const nbCreneaux = ['1', '5', '10', '15', '20']
const zone_selected = ref({})
const valeur_selected = ref({})

onMounted(async () => {
    parametres.value = await getParametresById(13)
    profils.value = await getProfils()
    zoneParents.value = await getZones(1, '&typeZone.code=espace&fitArena=' + idFitArena.value)
})

const addConditionReservation = () => {
    parametre.value = {}
    zone_selected.value = {}
    modal_title.value = "Ajouter une condition de réservation des créneaux"
    conditionReservation_modal.value = true
}

const modifConditionReservation = async({actif,id}) => {
    try {
      await patchParametreZone({actif}, id)
      toast.success('Modification du paramètre avec succès')
    } catch (e) {
      toast.error('Erreur, Veuillez contacter votre administrateur')
    }
}

const removeConditionReservation = async (i) => {
    try {
        await deleteParametreZone(i)
        toast.success('Succès de la suppression')
    } catch(e) {
        toast.error('Erreur, Veuillez contacter votre administrateur')
    }
    parametres.value = await getParametresById(13)
}

const editConditionReservation = (i) => {
    parametre.value = parametres.value[i]
    conditionReservation_modal.value = true
    modal_title.value = "Modifier une condition de réservation des créneaux"
}

const saveConditionReservation = async (i) => {
    const paramTemp = {
        zone: '/api/zones/' + zone_selected.value,
        parametre: '/api/parametres/13',
        valeur: valeur_selected.value,
        actif: true
    }

    if (modal_title.value.includes('modifier')) {
      try {
        const {data} = await updateParametreZone(paramTemp, parametre.value.id)
      } catch (e) {
        toast.error('Erreur, Veuillez contacter votre administrateur')
      }
    } else {
       try {
        const {data} = await postParametreZone(paramTemp)
      } catch (e) {
        toast.error('Erreur, Veuillez contacter votre administrateur')
      }
    }
    conditionReservation_modal.value = false
}

onMounted(async () => {
  equipements.value = await getEquipements(props.id, 1, '&typeEquipement.categoryTypeEquipement.code=motorise')
  typeEquipements.value = await getTypeEquipements(1, '&categoryTypeEquipement.code=motorise')

})
</script>