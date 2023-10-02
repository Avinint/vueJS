<template>
  <CardModalSection title="Annulation d'une réservation" class="border border-gray-200 py-4 pr-4 rounded-lg">
    <div class="pl-8">
      <table id="cancel" class="w-full text-left text-sm mb-4 text-gray-500 border border-gray-200 table-fixed">
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
          <tr>
            <td>Délai d'annulation d'une réservation</td>
            <td>
              <input
                v-if="editCancelBooking"
                v-model="cancelSessionTime"
                type="number"
                min="0"
                class="block rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              />
              <div v-if="!editCancelBooking">{{ cancelSessionTime }} h</div>
            </td>
            <td>
              <Button
                v-if="!editCancelBooking"
                test="TeditSlot"
                borderless
                icon="edit"
                couleur="secondary"
                @click="setCancelBooking"
              />
              <Button
                v-if="editCancelBooking"
                test="TeditSlot"
                borderless
                icon="cross"
                couleur="secondary"
                @click="setCancelBooking"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </CardModalSection>
</template>

<script setup>
import Button from '../common/Button.vue'
import Input from "../common/Input.vue"
import CardModalSection from "@components/common/CardModalSection.vue"

import { ref, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import 'vue3-toastify/dist/index.css'

import { patchParametreFitArena } from '@api/parametreFitArena.js'
import { useParamStore } from "@stores/parametre.js"

const props = defineProps(['id'])
const route = useRoute()
const params = useParamStore()

const editCancelBooking = ref(false)
const cancelSessionTime = ref(1)

onBeforeMount(async () => {
  cancelSessionTime.value = params.parametreFitArenas?.['condition-annulation-des-creneaux'].valeur ?? 1
})

const setCancelBooking = async () => {
  editCancelBooking.value = !editCancelBooking.value
  if (!editCancelBooking.value) {
    // RETURN TO READONLY MODE -> SAVE INPUT VIA API
    const id = params.parametreFitArenas['condition-annulation-des-creneaux'].id
    await patchParametreFitArena(id, {
      fitArena: 'api/fit_arenas/' + route.params.id,
      parametre: 'api/parametres/' + id,
      valeur: '' + cancelSessionTime.value,
    })
  }
}
</script>

<style scoped>
table#cancel tr {
  font-weight: 700;
  border: 1px solid lightgray;
}
table#cancel tr > td:first-of-type {
  background-color: rgb(229 231 235 / var(--tw-bg-opacity));
  border-right: 1px solid lightgray;
  color: #000;
}

table#cancel tr > td {
  padding: 0.5rem 1rem;
}

table#cancel tr > td:nth-child(3) {
  text-align: center;
}

table#cancel {
  border-radius: 30px;
}
</style>