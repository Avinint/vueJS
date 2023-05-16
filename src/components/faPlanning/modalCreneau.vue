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
      <div class="w-96">
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
            class="bg-gray-50 text-center"
          />
        </div>
        <div class="ml-20 grow">
          <label class="mb-2 block w-1/2 text-sm font-medium text-gray-900">
            Plage horaire du créneau
          </label>
          <div class="flex">
            <select
              v-model="creneauStore.heureDebut"
              required
              class="block h-10 w-40 rounded-lg border border-gray-300 bg-gray-50 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
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
              required
              class="block h-10 w-40 rounded-lg border border-gray-300 bg-gray-50 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
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
      <div class="relative rounded-lg border border-gray-300 p-4">
        <label class="block text-sm font-bold text-gray-900"> Zones </label>
        <label
          class="absolute top-32 mb-2 block text-sm font-bold text-gray-900"
        >
          Activités
        </label>
        <div class="flex overflow-x-scroll py-3">
          <div v-for="zone in zones" :key="zone.id" class="w-80 flex-col">
            <input
              :id="zone.id"
              v-model="creneauStore.zoneId"
              type="checkbox"
              :value="zone.id"
              class="hidden"
            />
            <label
              class="mb-3 mr-9 inline-block w-3/4 min-w-max cursor-pointer rounded-lg border-none bg-neutral-200 px-6 py-3 text-center text-sm text-black drop-shadow-sm"
              :class="{ 'bg-sky-600 text-white': isZoneChecked(zone.id) }"
              :for="zone.id"
            >
              {{ zone.libelle }}
            </label>
            <div class="flex-col pt-10">
              <div
                v-for="zoneActivite in zone.zoneActivites"
                v-if="isZoneChecked(zone.id)"
                :key="zone.id + '-' + zoneActivite.activite.id"
              >
                <div class="my-4 mr-10 flex justify-between">
                  <input
                    :id="zone.id + '-' + zoneActivite.activite.id"
                    v-model="zoneActivite.activite.checked"
                    type="checkbox"
                    class="hidden"
                  />
                  <label
                    class="mb-3 mr-9 inline-block w-3/4 min-w-max cursor-pointer rounded-lg border-none bg-neutral-200 px-4 py-2 text-center text-sm text-black drop-shadow-sm"
                    :class="{
                      'bg-sky-600 text-white': zoneActivite.activite.checked,
                    }"
                    :for="zone.id + '-' + zoneActivite.activite.id"
                    >{{ zoneActivite.activite.libelle }}
                  </label>
                  <Input
                    v-model="zoneActivite.activite.tarif"
                    :default-value="defaultTarif"
                    class="w-28 text-center after:ml-1 after:content-[attr(suffix)]"
                    :inline="true"
                    suffix="€"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
    readonly: Boolean
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
      defaultTarif: "0",
    }
  },
  computed: {
    ...mapStores(usePlanningStore),
    ...mapStores(useCreneauStore),
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
    await this.fetchZones()
    this.typeCreneauList = await getTypeCreneau()
    this.parametres = await getParametres()
    if (this.typeAction === 'create') {
        this.creneauStore.activites = [];
    }
  },
  methods: {
    async fetchZones() {
      this.zones = await getZones(
        1,
        '&typeZone.code=zone&fitArena=' + this.$route.params.id
      )
      this.checkActivites()
    },
    updateActivites() {
      this.creneauStore.activites = [];
      this.zones.forEach(zone => {
        zone.zoneActivites.forEach(zone_activite => {
          if(zone_activite.activite.checked == true) {
            this.creneauStore.addActivite({
              activiteId: zone_activite.activite.id,
              tarif: parseInt(zone_activite.activite.tarif)
            });
          }
        });
      });
    },
    checkActivites() {
      if (this.typeAction === 'edit') {
        this.zones.forEach((zone) => {
            zone.zoneActivites.forEach((zoneActivite) => {
              this.creneauStore.activites.forEach((activite) => {
                if (activite.activiteId === zoneActivite.activite.id) {
                  zoneActivite.activite.checked = true;
                  zoneActivite.activite.tarif = activite.tarif;
                }
              })
            })
        })
      }
    },
    submitCreneau() {
      // Retreive activity data from the local references
      // Before sending it to the API. This has to be done 
      // This way because of the unsynchronized data.
      this.updateActivites();

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
  },
}
</script>
<style scoped>
option {
  text-align: center;
}
.max-w-4xl {
  max-width: 56rem;
}
</style>
