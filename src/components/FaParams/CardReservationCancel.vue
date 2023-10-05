<template>
  <CardModalSection title="Annulation d'une réservation" class="border border-gray-200 py-4 pr-4 rounded-lg">
    <div class="pl-8">
      <table class="param-fa w-full text-left text-sm mb-4 text-gray-500 border border-gray-200">
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
          <tr>
            <td>Délai d'annulation d'une réservation</td>
            <td>{{ parametres?.condition_annulation_des_creneaux?.valeur }} h</td>
            <td>
              <Button
                test="TeditSlotCancel"
                borderless
                icon="edit"
                couleur="secondary"
                class="pl-0"
                @click="modale = true"
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
      title="Modifier le délai d'annulation d'une réservation"
      @cancel="modale = false"
    >
      <div>
        <div class="mb-6 ">
          <Input
            id="TeditSlotModalCancel"
            type="number"
            label="Délai d'annulation d'une réservation"
            v-model="parametres.condition_annulation_des_creneaux.valeur"
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
import Button from '../common/Button.vue'
import Input from '../common/Input.vue'
import Modal from '../common/Modal.vue'
import CardModalSection from "@components/common/CardModalSection.vue"

import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

import { updateParametreFitArena } from '@api/parametreFitArena.js'
import { useParamStore } from "@stores/parametre.js"

const props = defineProps(['id'])
const route = useRoute()
const params = useParamStore()

const modale = ref(false)

const parametres = computed(() => {
  const {
    condition_annulation_des_creneaux: condition_annulation_des_creneaux
  } = params.parametreFitArenas ?? {}

  return { condition_annulation_des_creneaux }
})

const rafraichir = async () => {
  await params.fetchParametres(route.params.id)
}

const saveParametre = async () => {
  const paramTemp = {
    fitArena: '/api/fit_arenas/' + route.params.id,
    parametre: params.parametreFitArenas.condition_annulation_des_creneaux.parametre.toString(),
    valeur: parametres.value.condition_annulation_des_creneaux.valeur.toString(),
  }

  try {
    await updateParametreFitArena(paramTemp, params.parametreFitArenas.condition_annulation_des_creneaux.id)
    rafraichir()
    toast.success('Enregistrement du paramètre avec succès')
  } catch (e) {
    toast.error('Erreur, Veuillez contacter votre administrateur')
  }

  modale.value = false
}
</script>