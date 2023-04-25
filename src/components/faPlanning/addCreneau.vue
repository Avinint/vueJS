<template>
  <form @submit.prevent="sendCreneau()">
    <Modal
      v-if="isOpen"
      :type="readonly ? 'visualiser' : 'classic'"
      :title="modal_title"
      @cancel="$emit('closeAddCreneau')"
    >
      <label class="mb-2 block w-1/2 text-sm font-medium text-gray-900">
        Veuillez sélectionner le type créneau à créer.
      </label>
      <div class="py-3">
        <InputRadio
          v-model="typeCreneau"
          name="typeCreneau"
          :list="typeCreneauList"
        />
      </div>
      <div>
        <Input
          v-model="title"
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
            v-model="planningStore.selectedDate.day"
            i18n="fr"
            as-single
            :formatter="{ date: 'DD / MM / YYYY' }"
            class="text-center"
          />
        </div>
        <div class="ml-6 grow">
          <label class="mb-2 block w-1/2 text-sm font-medium text-gray-900">
            plage horaire du créneau
          </label>
          <div class="flex">
            <select
              v-model="startHourMinute"
              class="block h-10 w-full rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              @change="storeDateStart()"
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
              v-model="endHourMinute"
              class="block h-10 w-full rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              @change="storeDateEnd()"
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
      <label class="mb-2 block w-1/2 text-sm font-medium text-gray-900">
        Zones
      </label>
      <div class="py-3">
        <InputRadio
          v-model="selectedZone"
          name="selectedZone"
          :list="zones"
          @click="showActivites()"
        />
      </div>
      <div v-if="selectedZone">
        <label class="mb-2 block text-sm font-medium text-gray-900">
          Activités
        </label>
        <div class="grid grid-cols-2">
          <template v-for="activite in activites" :key="activite.id">
            <div class="m-4 flex">
              <Button
                test="Tlogout"
                type="secondary"
                :label="activite.title"
                class="w-60 hover:bg-blue-500 hover:text-white"
                :submit="false"
              />
              <Input
                v-model="activite.price"
                type="text"
                class="w-24 text-center after:ml-1 after:content-[attr(suffix)]"
                suffix="€"
              />
            </div>
          </template>
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
import { getTypeCreneau } from '@api/typeCreneau.js'
import { getParametres } from '@api/parametre'
import { getZones } from '@api/zone'
import InputRadio from '@components/common/InputRadio.vue'
import Input from '@components/common/Input.vue'
import { getActiviteByZone } from '@api/activiteByZone'

export default {
  components: {
    Button,
    Modal,
    InputRadio,
    Input,
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['closeAddCreneau'],
  data() {
    return {
      typeCreneauList: [],
      modal_title: 'Création de creneau',
      parametres: [],
      typeCreneau: '',
      selectedZone: '',
      title: '',
      startHourMinute: '',
      endHourMinute: '',
      activites: '',
    }
  },
  computed: {
    ...mapStores(usePlanningStore),
    dayCreneau() {
      return this.$dayjs(this.planningStore.dateInfo.startStr).format(
        'DD/MM/YYYY'
      )
    },
    slotMinTimeNumber() {
      return Number(
        this.planningStore.slotMinTime
          .split(this.planningStore.timeSeparator)[0]
          .replace('0', '')
      )
    },
    slotMaxTimeNumber() {
      return Number(
        this.planningStore.slotMaxTime
          .split(this.planningStore.timeSeparator)[0]
          .replace('0', '')
      )
    },
    listStart() {
      let list = []
      for (let i = this.slotMinTimeNumber; i < this.slotMaxTimeNumber; i++) {
        list.push(i + this.planningStore.timeSeparator + '00')
        list.push(i + this.planningStore.timeSeparator + '30')
      }
      return list
    },
    listEnd() {
      let list = []
      for (
        let i = this.planningStore.selectedDate.start.hour;
        i < this.slotMaxTimeNumber;
        i++
      ) {
        list.push(i + this.planningStore.timeSeparator + '00')
        list.push(i + this.planningStore.timeSeparator + '30')
      }
      return list
    },
  },
  watch: {
    async selectedZone() {
      this.activites = [
        {
          id: 3,
          title: 'Futsal',
          price: 80,
        },
        {
          id: 4,
          title: 'Basket',
          price: 80,
        },
        {
          id: 5,
          title: 'Tennis',
          price: 80,
        },
        {
          id: 6,
          title: 'Handball',
          price: 80,
        },
      ]
    },
  },
  async mounted() {
    this.startHourMinute = this.planningStore.getSelectedFormatedStart
    this.endHourMinute = this.planningStore.getSelectedFormatedEnd
    this.zones = await getZones(
      1,
      '&typeZone.code=zone&fitArena=' + this.$route.params.id
    )
    this.typeCreneauList = await getTypeCreneau()
    this.parametres = await getParametres()
  },
  methods: {
    storeDateStart() {
      this.planningStore.selectedDate.start.hour = this.startHourMinute.split(
        this.planningStore.timeSeparator
      )[0]
      this.planningStore.selectedDate.start.minute = this.startHourMinute.split(
        this.planningStore.timeSeparator
      )[1]
    },
    storeDateEnd() {
      this.planningStore.selectedDate.end.hour = this.endHourMinute.split(
        this.planningStore.timeSeparator
      )[0]
      this.planningStore.selectedDate.end.minute = this.endHourMinute.split(
        this.planningStore.timeSeparator
      )[1]
    },
    sendCreneau() {
      console.log(
        this.typeCreneau,
        this.title,
        this.selectedZone,
        this.planningStore.selectedDate,
        this.activites
      )
      this.$emit('closeAddCreneau')
    },
  },
}
</script>
<style scoped>
option {
  text-align: center;
}
</style>
