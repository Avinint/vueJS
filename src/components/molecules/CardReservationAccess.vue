<template>
  <CardModalSection title="Accès à la fit arena" class="border border-gray-200 py-4 pr-4 rounded-lg">
    <div class="pl-8">
      <table id="duration" class="w-full text-left text-sm mb-4 text-gray-500 border border-gray-200 table-fixed">
        <thead
          class="hidden"
        >
          <tr>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="parametre, i in ['acces_avant_reservation', 'acces_apres_reservation']" :key="`access-`+ i">
            <td>{{ PARAM_TEXTES[parametre].label }}</td>
            <td>{{ formatMinutes(parametres?.[parametre]?.valeur ?? 0) }}</td>
            <td>
              <Button
                test="TeditSlotAcess"
                borderless
                icon="edit"
                couleur="secondary"
                class="pl-0"
                @click="editParametre(parametre)"
              />
            </td>
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
import CardModalSection from "@components/common/CardModalSection.vue";

import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

import { updateParametreFitArena } from '@api/parametreFitArena.js'
import { useParamStore } from "@stores/parametre.js";


const PARAM_TEXTES = {
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
    temps_d_acces_avant_la_reservation: acces_avant_reservation,
    temps_d_acces_apres_la_reservation: acces_apres_reservation
  } = params.parametreFitArenas ?? {}

  return { acces_avant_reservation, acces_apres_reservation }
})

const modale = ref(false)

const formulaire = reactive({
  temps_acces_avant_resa: null,
  temps_acces_apres_resa: null
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

<style scoped>
table#duration tr {
  font-weight: 700;
  border: 1px solid lightgray;
}
table#duration tr > td:first-of-type {
  background-color: rgb(229 231 235 / var(--tw-bg-opacity));
  border-right: 1px solid lightgray;
  color: #000;
}

table#duration tr > td {
  padding: 0.5rem 1rem;
}

table#duration tr > td:nth-child(3) {
  text-align: center;
}

table#duration {
  border-radius: 30px;
}
</style>