<template>
  <CardModalSection title="Durée Réservation">
    <div class="relative ml-9 my-4 overflow-x-auto text-black">
      <div class="flex bg-white" v-for="parametre in ['duree_creneau', 'duree_inter_creneau']">

        <div class="flex w-full items-center">
          <p class="p-2 bg-grey flex items-center w-5/12 justify-start">{{ PARAM_TEXTES[parametre].label }}</p>
          <p class="py-4 px-6">{{ formatMinutes(parametres?.[parametre]?.valeur ?? 0) }}</p>
        </div>
        <div class="grow flex justify-end">
          <Button
            test="TeditSlot"
            borderless
            icon="edit"
            couleur="secondary"
            class="pl-0"
            @click="editParametre(parametre)"
          />
        </div>
        <div class=" flex-none w-9"></div>
      </div>
    </div>
  </CardModalSection>
  <CardModalSection title="Accès à la fit arena">
    <div class="relative ml-9 my-4 overflow-x-auto text-black">
      <div class="flex bg-white" v-for="parametre in ['acces_avant_reservation', 'acces_apres_reservation']">

        <div class="flex w-full items-center">
          <p class="p-2 bg-grey flex items-center w-5/12 justify-start">{{ PARAM_TEXTES[parametre].label }}</p>
          <p class="py-4 px-6">{{ formatMinutes(parametres?.[parametre]?.valeur ?? 0) }}</p>
        </div>
        <div class="grow flex justify-end">
          <Button
            test="TeditSlot"
            borderless
            icon="edit"
            couleur="secondary"
            class="pl-0"
            @click="editParametre(parametre)"
          />
        </div>
        <div class=" flex-none w-9"></div>
      </div>
    </div>
  </CardModalSection>

  <form @submit.prevent="saveParametre">
    <Modal
      v-if="modale"
      :title="PARAM_TEXTES[modale].title"
      @cancel="modale = false"
    >
      <div>
        <div class="mb-6 ">
          <Input
            :id="'T' + modale"
            type="number"
            :label="PARAM_TEXTES[modale].label"
            v-model="formulaire[modale]"
            required
          />
        </div>
        <p class="text-light-blue">
          Cette modification ne sera pas appliquée sur les créneaux créés
          précédemment.
        </p>
      </div>
    </Modal>
  </form>
</template>

<script setup>
import Modal from '../common/Modal.vue'
import Button from '../common/Button.vue'
import Input from "../common/Input.vue";

import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { updateParametreFitArena } from '@api/parametreFitArena.js'

import CardModalSection from "@components/common/CardModalSection.vue";
import { useParamStore } from "@stores/parametre.js";

const MODES = ['duree_creneau', 'duree_inter_creneau', 'acces_avant_reservation', 'acces_apres_reservation']
const PARAM_TEXTES = {
  duree_creneau: {
    title: "Modifier la durée d'un créneau par défaut",
    label: "Durée d'un créneau par défaut",
  },
  duree_inter_creneau: {
    title: "Modifier la durée d'inter-créneau par défaut",
    label: "Durée d'inter-créneau par défaut",
  },
  acces_avant_reservation: {
    title: "Modifier le temps d'accès avant la réservation",
    label: "Temps d'accès avant la réservation",
  },
  acces_apres_reservation: {
    title: "Modifier le temps d'accès après la réservation",
    label: "Temps d'accès après la réservation",
  }
}

const props = defineProps(['id'])
const route = useRoute()
const params = useParamStore()

const parametres = computed(() => {
  const {
    duree_du_creneau: duree_creneau,
    duree_inter_creneau,
    temps_d_acces_avant_la_reservation: acces_avant_reservation,
    temps_d_acces_apres_la_reservation: acces_apres_reservation
  } = params.parametreFitArenas ?? {}

  return { duree_creneau, duree_inter_creneau, acces_avant_reservation, acces_apres_reservation }
})

const modale = ref(false)

const formulaire = reactive({
  duree_creneau:  null,
  duree_inter_creneau: null,
  temps_acces_avant_resa: null,
  temps_acces_apres_resa: null,
})

const rafraichir = async () => {
  await params.fetchParametres(route.params.id)
}

const editParametre = async (mode) => {
  modale.value = mode
  formulaire[mode] = parametres.value[mode].valeur
}

const saveParametre = async () => {
  const params = {
    fitArena: '/api/fit_arenas/' + route.params.id,
    parametre: parametres.value[modale.value].parametre,
    valeur: formulaire[modale.value],
  }

  try {
     await updateParametreFitArena(params, parametres.value[modale.value].id)
    rafraichir()
    toast.success('Enregistrement du paramètre avec succès')
  } catch (e) {
    toast.error('Erreur, Veuillez contacter votre administrateur')
  }

  modale.value = false
}

const formatMinutes = (dureeMinutes) => {
  if (dureeMinutes < 60) {
    return dureeMinutes + 'm'
  } else {
    const minutes = dureeMinutes % 60
    return ~~(dureeMinutes / 60) + 'h ' + (minutes > 0 ? minutes.toString().padStart(2, '0') : '')
  }
}
</script>
