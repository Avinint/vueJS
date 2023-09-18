<template>
  <Button icon="search" label="ouvrir la recherche" couleur="secondary" @click="afficherCalqueRecherche = true"/>
  <Modal v-if="afficherCalqueRecherche" @cancel="afficherCalqueRecherche = false" @confirm="filtrer" confirmButtonText="filtrer" icon="search">
    <template #actions>
      <Button test='TresetRechResa' @click="resetRecherche" label="reset" couleur="danger"/>
    </template>
    <Card>
      <h1 class="uppercase mb-8">Filtres de réservation</h1>
      <LabelText text="Séances"/>
      <div class="flex flex-row flex-wrap items-center w-full my-4">
        <div class="mr-3"> passées</div>
        <Switch  v-model="recherche.passe"/>
        <div class="mr-3">à venir</div>
        <Switch  v-model="recherche.futur"/>
        <div v-if="!recherche.futur && !recherche.passe" class="ml-9 mr-3">périodes</div>
        <div v-if="!recherche.futur && !recherche.passe" class="w-1/6 min-w-fit">
          <vue-tailwind-datepicker
            v-if="afficherDatePicker"
            v-model="recherche.dateSeance"
            i18n="fr"
            use-range
            separator=" au "
            :formatter="datePickerFormat"
            class="my-2"
          />
        </div>

      </div>
      <LabelText text="Réservations"/>
      <div class="flex flex-row flex-wrap items-center w-full">
        <div class="mx-3">Statut de la réservation</div>
        <select
          id="TrechResaSelectStatut"
          v-model="recherche.statut"
          class="mr-3 block w-48 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
        >
          <option :value="null">Filtrer par statut...</option>
          <option v-for="(statut, i) in selectStatuts" :key="i" :value="statut.id">
            {{ statut.libelle }}
          </option>
        </select>

        <div class="mr-3">Numéro de réservation</div>
        <Input
          id="TrechNumeroReservation"
          v-model="recherche.uuid"
          :type="'text'"
          class="w-48"
          inline
          lazy
        />
      </div>
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
      </div>

      <div class="my-2 mx-3">Type de réservation</div>
      <select
        id="TrechResaSelectType"
        v-model="recherche.type"
        class="mr-3 block w-48 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
      >
        <option :value="null">Filtrer par type...</option>
        <option v-for="(type, i) in selectTypes" :key="i" :value="type.id">
          {{ type.libelle }}
        </option>
      </select>

      <div v-if="typeSelectionne?.code === 'grand_public'">

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
      </div>
      <div v-if="typeSelectionne?.code === 'organisme'">
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
      </div>
    </Card>
  </Modal>
</template>

<script setup lang="ts">

import Switch from "@components/common/Switch.vue";
import Input from "@components/common/Input.vue";
import Button from "@components/common/Button.vue";
import Modal from "@components/common/Modal.vue";
import Card from "@components/common/Card.vue";
import LabelText from "@components/common/LabelText.vue";
import {useMenuStore} from "@stores/menu";
import {computed, nextTick, reactive, ref, watch, onMounted} from "vue";
import dayjs from "dayjs";
import {getStatuts, getTypes} from "@api/reservation";

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
  dateReservation: { startDate: null, endDate: null },
  dateSeance: { startDate: null, endDate: null},
})
const recherche = reactive({...rechercheDefauts})
const afficherCalqueRecherche = ref(false)
const typeSelectionne = computed(() => selectTypes?.value.find(({id}) => id === recherche.type) ?? null)

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
  selectTypes.value = (await getTypes()).filter(type => typesActifs.includes(type.code)).map(({id, libelle, code}) => ({id, libelle, code}))
  selectStatuts.value = (await getStatuts()).map(({id, libelle}) => ({id, libelle}))
})

const resetRecherche = async() => {
  Object.assign(recherche, rechercheDefauts)

  recherche.dateReservation = { startDate: null, endDate: null}
  recherche.dateSeance = { startDate: null, endDate: null}
  afficherDatePicker.value = false
  await nextTick()
  afficherDatePicker.value = true

  await emit('chargementListe', {})
}

watch (() => ({...recherche}) ,  (v1, v0) => {
  if ((v1.futur !== v0.futur) && v1.futur) {
    recherche.passe = false
    recherche.dateSeance = { startDate: null, endDate: null }
  }

  if((v1.passe !== v0.passe) && v1.passe) {
    recherche.futur = false
    recherche.dateSeance = { startDate: null, endDate: null }
  }

  if (recherche.dateSeance.startDate !== null) {
    recherche.futur = false
    recherche.passe = false
  }

  if (typeSelectionne.code !== 'organisme') {
    recherche.organisme = null

  } else if (typeSelectionne.code !== 'grand_public') {
    recherche.responsable = ''
  }
})

const dateToApi = (date, max = false) =>   date && dayjs(date, 'DD/MM/YYYY')
  .format('YYYY-MM-DD ' + (max ? '23:59:59' : '00:00:00')) || null

const emit = defineEmits(['chargementListe'])

</script>

<style scoped lang="scss">

</style>