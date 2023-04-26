<template>
  <form @submit.prevent="submitCreneau()">
    <Modal
      v-if="isOpen"
      :type="readonly ? 'visualiser' : 'classic'"
      :title="modalTitle"
      @cancel="$emit('closeModalCreneau')"
    >
      <label class="mb-2 block w-1/2 text-sm font-medium text-gray-900">
        Veuillez sélectionner le type créneau.
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
          v-model="planningStore.selectedCreneau.title"
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
            v-model="planningStore.selectedCreneau.day"
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
      typeCreneau: '',
      selectedZone: '',
      title: '',
      startHourMinute: '',
      endHourMinute: '',
      activites: [],
    }
  },
  computed: {
    ...mapStores(usePlanningStore),
    dayCreneau() {
      return this.$dayjs(this.planningStore.dateInfo.startStr).format(
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
        for (let y = 0; y < 55; y += 5) {
          const minutes = y.toString().length === 1 ? '0' + y : y
          list.push(i + this.planningStore.timeSeparator + minutes)
        }
      }
      return list
    },
    listEnd() {
      let list = []
      for (
        let i = this.planningStore.selectedCreneau.start.hour;
        i < this.slotMaxTimeNumber;
        i++
      ) {
        for (let y = 5; y < 55; y += 5) {
          const minutes = y.toString().length === 1 ? '0' + y : y
          list.push(i + this.planningStore.timeSeparator + minutes)
        }
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
          selected: false,
        },
        {
          id: 4,
          title: 'Basket',
          price: 80,
          selected: false,
        },
        {
          id: 5,
          title: 'Tennis',
          price: 80,
          selected: false,
        },
        {
          id: 6,
          title: 'Handball',
          price: 80,
          selected: false,
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
      this.planningStore.selectedCreneau.start.hour =
        this.startHourMinute.split(this.planningStore.timeSeparator)[0]
      this.planningStore.selectedCreneau.start.minute =
        this.startHourMinute.split(this.planningStore.timeSeparator)[1]
    },
    storeDateEnd() {
      this.planningStore.selectedCreneau.end.hour = this.endHourMinute.split(
        this.planningStore.timeSeparator
      )[0]
      this.planningStore.selectedCreneau.end.minute = this.endHourMinute.split(
        this.planningStore.timeSeparator
      )[1]
    },
    submitCreneau() {
      if (this.typeAction === 'create') {
        this.planningStore.addCreneau(
          this.typeCreneau,
          this.title,
          this.selectedZone,
          this.planningStore.selectedCreneau,
          this.activites
        )
      }
      if (this.typeAction === 'edit') {
        this.planningStore.editCreneau(
          this.typeCreneau,
          this.title,
          this.selectedZone,
          this.planningStore.selectedCreneau,
          this.activites
        )
      }
      this.$emit('closeModalCreneau')
    },
  },
}
</script>
<style scoped>
option {
  text-align: center;
}
</style>
