<template>
  <form @submit.prevent="submitCreneau()">
    <Modal
      v-if="isOpen"
      :type="readonly ? 'visualiser' : 'classic'"
      :title="modalTitle"
      size="4xl"
      @cancel="$emit('closeModalCreneau')"
    >
      <label class="mb-2 block w-1/2 text-sm font-medium text-gray-900">
        Veuillez sélectionner le type créneau.
      </label>
      <div class="py-3">
        <InputRadio
          v-model="creneauStore.creneauType"
          name="typeCreneau"
          :list="typeCreneauList"
          required
        />
      </div>
      <div>
        <Input
          v-model="creneauStore.titre"
          :inline="false"
          :required="true"
          label="Ajouter un titre à votre créneau"
          placeholder="Ajouter un titre à votre créneau"
          type="text"
        />
      </div>
      <div class="flex w-full">
        <!-- TODO: update to https://www.vue-tailwind.com/docs/datepicker -->
        <div>
          <label class="mb-2 block w-1/2 text-sm font-medium text-gray-900">
            Date du créneau
          </label>
          <vue-tailwind-datepicker
            v-model="datepicked"
            i18n="fr"
            as-single
            :formatter="{ date: datepickerFormat }"
            class="text-center"
          />
        </div>
        <div class="ml-6 grow">
          <label class="mb-2 block w-1/2 text-sm font-medium text-gray-900">
            plage horaire du créneau
          </label>
          <div class="flex">
            <select
              v-model="creneauStore.heureDebut"
              class="block h-10 w-full rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            >
              <option
                v-for="(creneauHoraire, i) in listStart"
                :key="i"
                :value="creneauHoraire"
              >
                {{ creneauHoraire }}
              </option>
            </select>
            <div class="px-4 py-2">à</div>
            <select
              v-model="creneauStore.heureFin"
              class="block h-10 w-full rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            >
              <option
                v-for="(creneauHoraire, i) in listEnd"
                :key="i"
                :value="creneauHoraire"
              >
                {{ creneauHoraire }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <label class="mb-2 block text-sm font-medium text-gray-900">
        Zones
      </label>
      <div class="flex overflow-x-scroll py-3">
        <div v-for="zone in zones" :key="zone.id" class="w-80 flex-col">
          <input
            :id="zone.id"
            v-model="creneauStore.zoneId"
            type="checkbox"
            :value="zone.id"
            class="hidden"
            @change="toggleZone(zone)"
          />
          <label
            class="mb-3 mr-9 inline-block cursor-pointer rounded-lg border-none bg-neutral-200 px-6 py-3 text-sm text-black drop-shadow-sm"
            :class="{ 'bg-sky-600 text-white': isZoneChecked(zone.id) }"
            :for="zone.id"
          >
            {{ zone.libelle }}
          </label>
          <div class="flex-col">
            <div
              v-for="activite in zone.zoneActivites"
              v-if="isZoneChecked(zone.id)"
              :key="activite.activeId"
            >
              <div class="my-4 mr-10 flex justify-between">
                <input
                  :id="activite.activeLibelle.replace(' ', '')"
                  v-model="activite.checked"
                  type="checkbox"
                  class="hidden"
                />
                <label
                  class="mb-3 mr-9 inline-block cursor-pointer rounded-lg border-none bg-neutral-200 px-4 py-2 text-sm text-black drop-shadow-sm"
                  :class="{
                    'bg-sky-600 text-white': activite.checked,
                  }"
                  :for="activite.activeLibelle.replace(' ', '')"
                  >{{ activite.activeLibelle }}
                </label>
                <Input
                  v-model.number="activite.tarif"
                  class="w-28 text-center after:ml-1 after:content-[attr(suffix)]"
                  suffix="€"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div v-if="creneauStore.zoneId">
        <label class="mb-2 block text-sm font-medium text-gray-900">
          Activités
        </label>
        <div class="grid grid-cols-2">
          <template v-for="activite in activites" :key="activite.id">
            <div class="my-4 mr-10 flex justify-between">
              <Button
                type="secondary"
                :label="activite.title"
                class="w-52 hover:bg-sky-600 hover:text-white"
                :submit="false"
                @click=""
              />
              <Input
                v-model="activite.price"
                type="text"
                class="w-28 text-center after:ml-1 after:content-[attr(suffix)]"
                suffix="€"
              />
            </div>
          </template>
        </div>
      </div> -->
    </Modal>
  </form>
</template>

<script>
import Modal from '@components/common/Modal.vue'
import Button from '@components/common/Button.vue'
import { mapStores } from 'pinia'
import { usePlanningStore } from '@stores/planning.js'
import { useCreneauStore } from '@stores/creneau.js'
import { getTypeCreneau } from '@api/typeCreneau.js'
import { getParametres } from '@api/parametre'
import { getZones } from '@api/zone'
import Input from '@components/common/Input.vue'
import InputRadio from '@components/common/InputRadio.vue'
import InputCheckbox from '@components/common/InputCheckbox.vue'
import { getActiviteByZone } from '@api/activiteByZone'
import { getActivites } from '../../api/activite.js'

export default {
  components: {
    Button,
    Modal,
    Input,
    InputRadio,
    InputCheckbox,
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    typeAction: {
      type: String,
      default: 'create',
    },
  },
  emits: ['closeModalCreneau'],
  data() {
    return {
      typeCreneauList: [],
      parametres: [],
      zones: [],
      // activites: [],
      datepicked: '',
      datepickerFormat: 'DD / MM / YYYY',
      timeSeparator: ':',
    }
  },
  computed: {
    ...mapStores(usePlanningStore),
    ...mapStores(useCreneauStore),
    dayCreneau() {
      return this.$dayjs(this.creneauStore.dateInfo.startStr).format(
        'DD/MM/YYYY'
      )
    },
    modalTitle() {
      switch (this.typeAction) {
        case 'create':
          return 'Création de creneau'
        case 'edit':
          return 'Modifier un creneau'
        default:
          return 'Modifier un creneau'
      }
    },
    slotMinTimeNumber() {
      return Number(
        this.planningStore.slotMinTime
          .split(this.timeSeparator)[0]
          .replace('0', '')
      )
    },
    slotMaxTimeNumber() {
      return Number(
        this.planningStore.slotMaxTime
          .split(this.timeSeparator)[0]
          .replace('0', '')
      )
    },
    listStart() {
      let list = []
      for (let i = this.slotMinTimeNumber; i < this.slotMaxTimeNumber; i++) {
        for (let y = 0; y < 59; y += 5) {
          const hours = i.toString().length === 1 ? '0' + i : i
          const minutes = y.toString().length === 1 ? '0' + y : y
          list.push(hours + this.timeSeparator + minutes)
        }
      }
      return list
    },
    listEnd() {
      let list = []
      for (
        let i = this.creneauStore.heureDebut.split(this.timeSeparator)[0];
        i < this.slotMaxTimeNumber;
        i++
      ) {
        for (let y = 0; y < 59; y += 5) {
          const hours = i.toString().length === 1 ? '0' + i : i
          const minutes = y.toString().length === 1 ? '0' + y : y
          list.push(hours + this.timeSeparator + minutes)
        }
      }
      return list
    },
  },
  watch: {
    datepicked(newDatepicked) {
      this.creneauStore.date = this.$dayjs(
        newDatepicked,
        this.datepickerFormat
      ).format('YYYY-MM-DD')
    },
  },
  async mounted() {
    this.datepicked = this.$dayjs(this.creneauStore.date).format(
      this.datepickerFormat
    )
    this.zones = await getZones(
      1,
      '&typeZone.code=zone&fitArena=' + this.$route.params.id
    )
    this.typeCreneauList = await getTypeCreneau()
    this.parametres = await getParametres()
  },
  methods: {
    submitCreneau() {
      if (this.typeAction === 'create') {
        this.creneauStore.addCreneau()
      }
      if (this.typeAction === 'edit') {
        this.creneauStore.editCreneau()
      }
      this.$emit('closeModalCreneau')
    },
    isZoneChecked(zoneId) {
      return this.creneauStore.zoneId.includes(zoneId)
    },
    isActiviteChecked(activiteId) {
      this.creneauStore.activites.some(
        (activite) => activite.activiteId === activiteId
      )
    },
    async toggleZone(zone) {
      if (!zone.zoneActivites.length) {
        const activites = await getActiviteByZone(zone.id)
        zone.zoneActivites.push({
          activiteId: activites.activite.id,
          activeLibelle: activites.activite.libelle,
          tarif: 0,
          checked: false,
        })
      }
    },
  },
}
</script>
<style scoped>
option {
  text-align: center;
}
</style>
