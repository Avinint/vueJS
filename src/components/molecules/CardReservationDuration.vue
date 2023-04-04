<template>
    <Card>
        <h1>Durée Réservation</h1>
        <div class="relative overflow-x-auto my-4 text-black">
            <div class="bg-white flex">
                <div class="flex justify-start items-center w-1/12">
                    <Button test="TeditSlot" borderless icon="edit" type="secondary" class="pl-0" @click="editDurationSlot()" />
                </div>
                <div class="flex items-center w-full">
                    <p class="py-4 w-4/12">Durée d'un créneau par défaut</p>
                    <p class="py-4">1 h</p>
                </div>
            </div>
            <div class="bg-white flex">
                <div class="flex justify-start items-center w-1/12">
                    <Button test="TeditInterslot" borderless icon="edit" type="secondary" class="pl-0" @click="editDurationInterslot(i)" />
                </div>
                <div class="flex items-center w-full">
                    <p class="py-4 w-4/12">Durée d'inter-créneau par défaut</p>
                    <p class="py-4">1 min</p>
                </div>
            </div>
        </div>
    </Card>

    <form @submit.prevent="saveDurationSlot">
        <Modal v-if="durationSlot_modal" title="Modifier la durée d'un créneau par défaut" @cancel="durationSlot_modal = false">
            <div>
                <div class="flex items-center mb-6">
                    <label class="block mb-2 text-sm font-medium text-gray-900 pr-4">Durée d'un créneau par défaut</label>
                    <select v-model="durationSlot_selected" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-2/12 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option v-for="(duration, i) in durationSlot" :key="i" :value="duration">{{duration}}</option>
                    </select>
                </div>
                <p class="text-light-blue">Cette modification ne sera pas appliquée sur les créneaux créés précédemment.</p>
            </div>
        </Modal>
    </form>

    <form @submit.prevent="saveDurationInterslot">
        <Modal v-if="durationInterslot_modal" title="Modifier la durée d'inter-créneau par défaut" @cancel="durationInterslot_modal = false">
            <div>
                <div class="flex items-center mb-6">
                    <label class="block mb-2 text-sm font-medium text-gray-900 pr-4">Durée d'inter-créneau par défaut</label>
                    <select v-model="durationInterslot_selected" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-2/12 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option v-for="(duration, i) in durationInterslot" :key="i" :value="duration">{{duration}}</option>
                    </select>
                </div>
                <p class="text-light-blue">Cette modification ne sera pas appliquée sur les créneaux créés précédemment.</p>
            </div>
        </Modal>
    </form>
</template>

<script setup>
import Card from "../common/Card.vue"
import Modal from "../common/Modal.vue"
import Button from "../common/Button.vue"

import { getParametres, getParametresById } from "../../api/parametres.js"
import {onMounted, ref} from "vue"
import {useRoute} from "vue-router"
import {toast} from 'vue3-toastify'
import "vue3-toastify/dist/index.css"

const route = useRoute()
const idFitArena = ref(route.params.id)
const parametresSlot = ref({})
const parametresInterslot = ref({})
const durationSlot_modal = ref(false)
const durationInterslot_modal = ref(false)
const durationSlot = ['30 min', '1h', '1h30', '2h']
const durationInterslot = ['1 min', '1min30', '2 min', '2min30']
const durationSlot_selected = ref({})
const durationInterslot_selected = ref({})

onMounted(async () => {
    parametresSlot.value = await getParametresById(6)
    parametresInterslot.value = await getParametresById(7)
})

const editDurationSlot = () => {
    durationSlot_modal.value = true
}

const editDurationInterslot = () => {
    durationInterslot_modal.value = true
}

const saveDurationSlot = async (i) => {
    const paramTemp = {
        fitArena: '/api/fit_arenas/' + idFitArena.value,
        valeur: durationSlot_selected.value,
    }
    // à voir pour les fonctions à utiliser, j'ai l'impression qu'elles ne sont pas encore configurées (ParametreFitArena sur le swagger)

    //    try {
    //     const {data} = await post(paramTemp)
    //   } catch (e) {
    //     toast.error('Erreur, Veuillez contacter votre administrateur')
    //   }

    durationSlot_modal.value = false
    toast.success('Enregistrement du paramètre avec succès')
}
const saveDurationInterslot = async (i) => {
    const paramTemp = {
        fitArena: '/api/fit_arenas/' + idFitArena.value,
        valeur: durationInterslot_selected.value,
    }

    // à voir pour les fonctions à utiliser, j'ai l'impression qu'elles ne sont pas encore configurées (ParametreFitArena sur le swagger)

    //    try {
    //     const {data} = await post(paramTemp)
    //   } catch (e) {
    //     toast.error('Erreur, Veuillez contacter votre administrateur')
    //   }
    durationInterslot_modal.value = false
    toast.success('Enregistrement du paramètre avec succès')
}
</script>