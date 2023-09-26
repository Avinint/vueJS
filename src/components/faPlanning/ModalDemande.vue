<template>
  <Modal
    @cancel="state = 'closed'"
    v-if="state != 'closed'"
    size="4xl"
    type="none"
    title="Demande de création de créneaux"
  >
    <div class="pl-4">
      <Input class="max-w-lg" label="Titre du créneau" v-model="form.title" />
      <div class="flex gap-16 mt-8">
        <vue-tailwind-datepicker
          v-model="date"
          i18n="fr"
          as-single
          :formatter="{ date: 'DD-MM-YYYY' }"
        />
        <TimeRange label="Plage horaire du créneau" v-model:start_time="form.start_time" v-model:end_time="form.end_time" />
      </div>
      <div class="flex items-center gap-4 mt-8">
        <p class="label-text">Nombre de persones attendues</p>
        <Input class="input-count" v-model="form.people_count" />
      </div>
      <HeaderModal text="ZONES" class="my-8" />
      <InputOptions :options="props.zones" v-model="form.zones" :value="props.libelle" />
      <CardModalSection title="COMMENTAIRE" class="my-8">
        <template #content>
          <textarea v-model="form.commentaire" class="rounded-lg w-full text-black border border-gray-300 bg-gray-50" />
        </template>
      </CardModalSection>
      <div class="flex justify-end">
        <Button
          @click="submitDemande"
          label="Demander une validation"
          couleur="danger"
        />
      </div>
    </div>
  </Modal>
  <Modal
    v-if="verifModal"
    @cancel="verifModal = false"
    size="4xl"
    title="CONFIRMATION DE CRÉATION"
    type="none"
  >
    <CardModalSection
      v-if="verifCreneaux.creneauxValide.length > 0"
      title="CRÉNEAUX SOUMIS POUR VALIDATION PAR LA COLLECTIVITÉ"
      class="pl-4"
    >
      <table
        v-if="verifCreneaux.creneauxValide"
        class="w-full text-left text-sm text-gray-500 bg-gray-200 border border-gray-200"
      >
        <thead>
          <tr>
            <th scope="col" class="px-6 py-3">Date du créneau</th>
            <th scope="col" class="px-6 py-3">Horaire</th>
            <th scope="col" class="px-6 py-3">Statut demande</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(
              creneau, i
            ) in verifCreneaux.creneauxValide"
            :key="`creneauxValide-`+ i"
            class="bg-white border border-gray-200"
          >
            <td class="px-6 py-4 flex">
              {{ dayjs(creneau.dateDebut).format('DD/MM/YYYY') }}
            </td>
            <td class="px-6 py-4 border border-gray-200">
              {{ dayjs(creneau.dateDebut).format('HH:mm') }} - {{ dayjs(creneau.dateSortie).format('HH:mm') }}
            </td>
            <td class="px-6 py-4 flex items-center" id="statut">
              Soumis à validation
              <div class="w-3 h-3 bg-green-600 rounded-xl ml-10" />
            </td>
          </tr>
        </tbody>
      </table>
    </CardModalSection>

    <CardModalSection
      v-if="verifCreneaux.creneauxConflit.length > 0"
      title="CRÉNEAUX NON CRÉÉS, CAR ILS ENTRENT EN CONFLIT AVEC DES RÉSERVATIONS DÉJÀ VALIDÉES"
      class="pl-4"
    >
      <table
        class="w-full text-left text-sm text-gray-500 bg-gray-200 border border-gray-200"
      >
        <thead>
          <tr>
            <th scope="col" class="px-6 py-3">Date du créneau</th>
            <th scope="col" class="px-6 py-3">Horaire</th>
            <th scope="col" class="px-6 py-3">Statut demande</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(
              creneau, i
            ) in verifCreneaux.creneauxConflit"
            :key="`creneauxConflit-`+ i"
            class="bg-white border border-gray-200"
          >
            <td class="px-6 py-4 flex">
              {{ dayjs(creneau.dateDebut).format('DD/MM/YYYY') }}
            </td>
            <td class="px-6 py-4 border border-gray-200">
              {{ dayjs(creneau.dateDebut).format('HH:mm') }} - {{ dayjs(creneau.dateSortie).format('HH:mm') }}
            </td>
            <td class="px-6 py-4 flex items-center" id="statut">
              Soumis à validation
              <div class="w-3 h-3 bg-green-600 rounded-xl ml-10" />
            </td>
          </tr>
        </tbody>
      </table>
    </CardModalSection>
    <div class="flex justify-end gap-4">
      <Button
        @click="modifierDemande"
        label="Modifier ma demande"
        couleur="secondary"
        class="border border-red-600 text-red-600"
      />
      <Button
        @click="submitDemandeValidation"
        label="Valider ma demande"
        couleur="danger"
      />
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Button from '@components/common/Button.vue'
import Input from '@components/common/Input.vue'
import InputOptions from '@components/common/InputOptions.vue'
import Modal from '@components/common/Modal.vue'
import CardModalSection from '@components/common/CardModalSection.vue'
import HeaderModal from '@components/common/HeaderModal.vue'
import TimeRange from '@components/molecules/TimeRange.vue'

import type { DateSelectArg } from '@fullcalendar/core'

import { extractHour, parseDateToInput } from '../../services/date_service'
import { makeDemandeEditContract } from '../../services/planning/creneau_service'
import { postCreneauVerifDemande, postCreneauDemande } from '@api/creneau'
import { usePlanningStore } from '@stores/planning.ts'

import { reactive, ref, defineProps } from 'vue'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'

const route = useRoute();
const verifModal = ref(false)
const verifCreneaux = ref({})
const contract = ref({})
const date = ref('')

const props = defineProps({
  zones: Object
})

const default_form_values = {
  title: '',
  date: '',
  start_time: '',
  end_time: '',
  people_count: 0,
  zones: [],
  commentaire: ''
}

const form = reactive<{
  title: string,
  date: string,
  start_time: string,
  end_time: string,
  people_count: number,
  zones: number[],
  commentaire: string,
}>({ ...default_form_values })

defineExpose({ create })
const state = ref<'create' | 'edit' | 'closed'>('closed')

function create(event: DateSelectArg) {
  state.value = 'create'
  form.title = default_form_values.title;
  form.people_count = default_form_values.people_count;
  form.zones = default_form_values.zones;
  form.commentaire = default_form_values.commentaire;
  date.value = parseDateToInput(event.start);
  form.start_time = extractHour(event.start)
  form.end_time = extractHour(event.end)
}

const submitDemande = async() => {
  state.value = 'closed';
  let organisme_id = route.params.org_id as string;
  let fitarena_id = route.params.id as string;
  const day = date.value.split('-')[0]
  const month = date.value.split('-')[1]
  const year = date.value.split('-')[2]
  form.date = `${year}-${month}-${day}`
  contract.value = makeDemandeEditContract(parseInt(fitarena_id), parseInt(organisme_id), form);
  verifCreneaux.value = await postCreneauVerifDemande(contract.value);
  verifModal.value = true
}

const submitDemandeValidation = async() => {
  await postCreneauDemande(contract.value)
  verifModal.value = false
  state.value = 'closed'
  await refreshPlanning()
}

const modifierDemande = () => {
  verifModal.value = false
  state.value = 'edit'
}

const refreshPlanning = async() => {
  await usePlanningStore().fetch()
}
</script>

<style scoped>
.input-count {
  max-width: 47px;
}

.label-text {
  --tw-text-opacity: 1;
  color: rgb(17 24 39 / var(--tw-text-opacity));
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
}
</style>
