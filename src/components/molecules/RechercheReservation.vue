<template>
  <ButtonRight icon="filter" label="Filtrer" couleur="secondary" @click="afficherCalqueRecherche = true" />
  <Modal v-if="afficherCalqueRecherche" title="FILTRE RÉSERVATION" @cancel="afficherCalqueRecherche = false" @confirm="filtrer" confirmButtonText="Filtrer">
    <template #actions>
      <Button test='TresetRechResa' @click="resetRecherche" label="reset" couleur="danger"/>
    </template>
    <div class="pl-4">
      <div class="flex items-center mb-10">
        <p class="label-text w-1/2">Afficher les réservations</p>
        <div class="flex items-center w-full">
          <div class="flex w-1/2 items-center">
            <label class="relative inline-flex cursor-pointer items-center">
              <input
                v-model="recherche.futur"
                type="checkbox"
                value="true"
                class="peer sr-only"
              />
              <div
                class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"
              ></div>
            </label>
            <span class="text-sm pl-4 font-medium text-gray-900"
              >Futures
            </span>
          </div>
          <div class="flex w-1/2 items-center">
            <label class="relative inline-flex cursor-pointer items-center">
              <input
                v-model="recherche.passe"
                type="checkbox"
                value="true"
                class="peer sr-only"
              />
              <div
                class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"
              ></div>
            </label>
            <span class="text-sm pl-4 font-medium text-gray-900"
              >Passées
            </span>
          </div>
        </div>
      </div>
      <CardModalSection title="CRITÈRES DU FILTRE">
        <template #content>
          <div class="flex items-center mb-4">
            <p class="label-text w-1/2">Type de créneau</p>
            <select
              id="TrechResaSelectType"
              v-model="recherche.type"
              class="block w-48 w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            >
              <option v-for="(type, i) in selectTypes" :key="i" :value="type.id">
                {{ type.libelle }}
              </option>
            </select>
          </div>
          <div class="flex items-center mb-4">
            <p class="label-text w-1/2">Organisme</p>
            <select
              id="TrechResaSelectOrganisme"
              v-model="recherche.organisme"
              class="block w-48 rounded-lg w-full border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"

            >
              <option v-for="(organisme, i) in selectOrganismes" :key="i" :value="organisme.id">
                {{ organisme.libelle }}
              </option>
            </select>
          </div>
          <div class="flex items-center mb-4">
            <p class="label-text w-1/2">Statut de la réservation</p>
            <select
              id="TrechResaSelectStatut"
              v-model="recherche.statut"
              class="block w-48 w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            >
              <option v-for="(statut, i) in selectStatuts" :key="i" :value="statut.id">
                {{ statut.libelle }}
              </option>
            </select>
          </div>
          <div class="flex items-center mb-4">
            <p class="label-text w-1/2">Date de réservation</p>
            <div class="flex items-center justify-between w-full">
              <vue-tailwind-datepicker
                v-model="recherche.dateReservation.startDate"
                i18n="fr"
                as-single
                :formatter="datePickerFormat"
              />
              <p class="label-text">au</p>
              <vue-tailwind-datepicker
                v-model="recherche.dateReservation.endDate"
                i18n="fr"
                as-single
                :formatter="datePickerFormat"
              />
            </div>
          </div>
          <div class="flex items-center mb-4">
            <p class="label-text w-1/2">Date séance</p>
            <div class="flex items-center justify-between w-full">
              <vue-tailwind-datepicker
                v-model="recherche.dateSeance.startDate"
                i18n="fr"
                as-single
                :formatter="datePickerFormat"
              />
              <p class="label-text">au</p>
              <vue-tailwind-datepicker
                v-model="recherche.dateSeance.endDate"
                i18n="fr"
                as-single
                :formatter="datePickerFormat"
              />
            </div>
          </div>
        </template>
      </CardModalSection>
    </div>




     
      <!-- <LabelText text="Réservations"/>
      <div class="flex flex-row flex-wrap items-center w-full"> -->

        <!-- <div class="mr-3">Numéro de réservation</div>
        <Input
          id="TrechNumeroReservation"
          v-model="recherche.uuid"
          :type="'text'"
          class="w-48"
          inline
          lazy
        /> -->
      <!-- </div>
      <div class="mx-3">Réservations</div>
      <div class="w-1/6 min-w-fit">
        <vue-tailwind-datepicker
          v-if="afficherDatePicker"
          v-model="recherche.dateReservation"
          i18n="fr"
          use-range
          separator=" au "
          :formatter="datePickerFormat"
          class="my-2"
        />
      </div> -->

      <!-- <div v-if="typeSelectionne?.code === 'grand_public'">

        <div class="my-2 mx-3">Organisateur</div>
        <Input
          id="TrechResponsableReservation"
          :model-value="recherche.responsable"
          @change="e => recherche.responsable = e.target.value"
          :type="'text'"
          class="w-40 mr-3"
          inline
          lazy
        />
      </div> -->
      <!-- <div v-if="typeSelectionne?.code === 'organisme'">
        <div class="my-2 mx-3">Organismes</div>
        <select
          id="TrechResaSelectOrganisme"
          v-model="recherche.organisme"
          class="mr-3 block w-48 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"

        >
          <option :value="null">Filtrer par organisme...</option>
          <option v-for="(organisme, i) in selectOrganismes" :key="i" :value="organisme.id">
            {{ organisme.libelle }}
          </option>
        </select>
      </div> -->
  </Modal>
</template>

<script setup lang="ts">
import Switch from "@components/common/Switch.vue";
import Input from "@components/common/Input.vue";
import ButtonRight from "@components/common/ButtonRight.vue";
import Modal from "@components/common/Modal.vue";
import CardModalSection from '@components/common/CardModalSection.vue'
import Card from "@components/common/Card.vue";
import LabelText from "@components/common/LabelText.vue";

import { useMenuStore } from "@stores/menu";
import { getStatuts, getTypes } from "@api/reservation";

import { computed, nextTick, reactive, ref, watch, onMounted } from "vue";
import dayjs from "dayjs";

const { getOrganismes } = useMenuStore()
const selectOrganismes = computed(() => getOrganismes().map(({id, libelle}) => ({id, libelle})))
const datePickerFormat = {date: 'DD/MM/YYYY', month: 'MMM'}
const selectStatuts = ref([])
const datepickerSeance = ref()
const datepickerReservation = ref()
const typesActifs = ['grand_public', 'organisme']
const selectTypes = ref([])
const afficherDatePicker = ref(true)

const rechercheDefauts = reactive({
  passe: false,
  futur: false,
  organisme: null,
  responsable: '',
  uuid: null,
  statut: null,
  type: null,
  dateReservation: { startDate: '', endDate: '' },
  dateSeance: { startDate: '', endDate: ''},
})
const recherche = reactive({...rechercheDefauts})
const afficherCalqueRecherche = ref(false)
const typeSelectionne = computed(() => selectTypes?.value.find(({ id }) => id === recherche.type) ?? null)

const rechercheQuery = computed(() => ({
  passees: Number(recherche.passe),
  futures: Number(recherche.futur),
  idOrganisme: recherche.organisme ?? null,
  statutResa: recherche.statut ?? null,
  typeResa: recherche.type ?? null,
  uuidResa: recherche.uuid ??  null,
  dateCreationMin: dateToApi(recherche.dateReservation.startDate),
  dateCreationMax: dateToApi(recherche.dateReservation.endDate, true),
  dateSeanceMin: dateToApi(recherche.dateSeance.startDate),
  dateSeanceMax: dateToApi(recherche.dateSeance.endDate, true),
  resp: recherche.responsable ? '1' : null,
  participant: recherche.responsable || null
}))

const filtrer =  async() => {
  await emit('chargementListe', rechercheQuery.value)
  afficherCalqueRecherche.value = false
}

onMounted(async () => {
  // recherche
  selectTypes.value = (await getTypes()).filter(type => typesActifs.includes(type.code)).map(({ id, libelle, code }) => ({ id, libelle, code }))
  selectStatuts.value = (await getStatuts()).map(({ id, libelle }) => ({ id, libelle }))
})

const resetRecherche = async() => {
  Object.assign(recherche, rechercheDefauts)

  recherche.dateReservation = { startDate: '', endDate: ''}
  recherche.dateSeance = { startDate: '', endDate: ''}
  afficherDatePicker.value = false
  await nextTick()
  afficherDatePicker.value = true

  await emit('chargementListe', {})
}

watch (() => ({...recherche}) , (v1, v0) => {
  if ((v1.futur !== v0.futur) && v1.futur) {
    recherche.passe = false
    recherche.dateSeance = { startDate: '', endDate: '' }
  }

  if ((v1.passe !== v0.passe) && v1.passe) {
    recherche.futur = false
    recherche.dateSeance = { startDate: '', endDate: '' }
  }

  if (recherche.dateSeance.startDate !== '') {
    recherche.futur = false
    recherche.passe = false
  }

  // if (typeSelectionne.code !== 'organisme') {
  //   recherche.organisme = null

  // } else if (typeSelectionne.code !== 'grand_public') {
  //   recherche.responsable = ''
  // }
})

const dateToApi = (date, max = false) => date && dayjs(date, 'DD/MM/YYYY')
  .format('YYYY-MM-DD ' + (max ? '23:59:59' : '00:00:00')) || ''

const emit = defineEmits(['chargementListe'])

</script>

<style scoped>
.label-text {
  --tw-text-opacity: 1;
  color: rgb(17 24 39 / var(--tw-text-opacity));
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

#vtd {
  max-width: 170px; 
}
</style>