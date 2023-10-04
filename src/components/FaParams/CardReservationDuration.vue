<template>
  <CardModalSection title="Durée Réservation" class="border border-gray-200 py-4 pr-4 rounded-lg">
    <div class="pl-8">
      <table class="param-fa w-full text-left text-sm mb-4 text-gray-500 border border-gray-200 table-fixed">
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
          <tr v-for="parametre, i in ['duree_creneau', 'duree_inter_creneau']" :key="`duration-`+ i">
            <td>{{ PARAM_TEXTES[parametre].label }}</td>
            <td>{{ formatMinutes(parametres?.[parametre]?.valeur ?? 0) }}</td>
            <td>
              <Button
                test="TeditSlotDuration"
                borderless
                icon="edit"
                couleur="secondary"
                class="pl-0"
                @click="editParametre(parametre)"
              />
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  </CardModalSection>

  <form @submit.prevent="saveParametre">
    <Modal
      v-if="modale"
      :title="PARAM_TEXTES[modale].title"
      @cancel="modale = false"
    >
      <div>
        <div class="mb-6">
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
import Input from "../common/Input.vue"
import CardModalSection from "@components/common/CardModalSection.vue"

import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

import { updateParametreFitArena } from '@api/parametreFitArena.js'
import { useParamStore } from "@stores/parametre.js"

const PARAM_TEXTES = {
  duree_creneau: {
    title: "Modifier la durée d'un créneau par défaut",
    label: "Durée d'un créneau par défaut",
  },
  duree_inter_creneau: {
    title: "Modifier la durée d'inter-créneau par défaut",
    label: "Durée d'inter-créneau par défaut",
  }
}

const props = defineProps(['id'])
const route = useRoute()
const params = useParamStore()

const parametres = computed(() => {
  const {
    duree_du_creneau: duree_creneau,
    duree_inter_creneau
  } = params.parametreFitArenas ?? {}

  return { duree_creneau, duree_inter_creneau }
})

const modale = ref(false)

const formulaire = reactive({
  duree_creneau:  null,
  duree_inter_creneau: null
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
    valeur: formulaire[modale.value]
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