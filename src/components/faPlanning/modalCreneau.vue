<template>
  <form @submit.prevent="submitCreneau()">
    <Modal
      v-if="isOpen"
      :type="readonly ? 'visualiser' : 'classic'"
      :title="modalTitle"
      size="4xl"
      :delete_button="typeAction === 'edit'"
      @cancel="$emit('closeModalCreneau')"
      @delete="delete_creneau"
    >
      <template #topButtons>
        <Button v-if="typeAction === 'edit'" test='TcloseModal' @click="delete_creneau" couleur="danger" borderless class="mr-6" label="Supprimer le créneau" />
      </template>
      <label class="mb-2 block w-1/2 text-sm font-medium text-gray-900">
        Veuillez sélectionner le type créneau.
      </label>
      <div class="py-3">
        <InputRadio
          v-model="creneauStore.creneauType"
          name="typeCreneau"
          :list="typeCreneauListe"
          required
        />
      </div>
      <div v-if="creneauType !== null" class="flex gap-3">
        <FAInput
          v-model="creneauStore.titre"
          :inline="false"
          :required="false"
          label="Ajouter un titre à votre créneau"
          class="grow"
          placeholder="Ajouter un titre à votre créneau"
          type="text"
        />
        <InputSelect
          v-if="['organisme', 'maintenance'].includes(creneauType)"
          v-model="creneauStore.organisme"
          :required="true"
          :label="creneauType === 'organisme' ? 'Organisme' : 'Prestataire'"
          class="grow"
          :options="getOrganismesOptions"
        />
      </div>
      <div v-if="creneauType !== null" class="flex w-full">
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
          <label class="required mb-2 block w-1/2 text-sm font-medium text-gray-900">
            Plage horaire du créneau
          </label>
          <div class="flex">
            <select
              v-model="creneauStore.heureDebut"
              required
              class="block h-10 w-40 rounded-lg border border-gray-300 bg-gray-50 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
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
              class="block h-10 w-40 rounded-lg border border-gray-300 bg-gray-50 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
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
      <FAButton
        v-if="creneauType === 'grand_public'"
        class="mr-4"
        :class="submenu === 'advanced' ? 'bg-advanced' : 'bg-none'"
        label="Paramètres avancés"
        @click="setSubmenu('advanced')"
      />
      <FAButton
        v-if="creneauType && creneauStore.recurrence != undefined"
        label="Récurrence"
        :class="submenu === 'recurence' ? 'bg-recurence' : 'bg-none'"
        @click="setSubmenu('recurence')"
      />
      <div v-if="submenu === 'advanced'" class="flex gap-5">
        <FAInput
          v-model="creneauStore.dureeActivite"
          :inline="false"
          :required="true"
          label="Durée d'un créneau"
          class="grow"
          placeholder="55"
          type="number"
        />
        <FAInput
          v-model="creneauStore.dureeInterCreneau"
          :inline="false"
          :required="true"
          label="Durée d'inter créneau"
          class="grow"
          placeholder="5"
          type="number"
        />
      </div>
      <MenuRecurrence v-if="submenu === 'recurence'" />
      <div
        v-if="creneauType !== null"
        class="relative rounded-lg border border-gray-300 p-4"
      >
        <label class="block text-sm font-bold text-gray-900"> Zones </label>
        <label
          v-if="creneauType !== 'organisme' && creneauStore.zones.length > 0"
          class="absolute top-32 mb-2 block text-sm font-bold text-gray-900"
        >
          Activités
        </label>
        <div class="flex overflow-x-scroll py-3">
          <template v-for="zone in zones" :key="zone">
            <!-- v-if="isZoneEditable(zone)" -->
            <div class="w-80 flex-col">
              <input
                :id="zone.code"
                v-model="creneauStore.zones"
                type="checkbox"
                :value="zone.id"
                class="hidden"
                @click="selectActivities(zone)"
              />
              <label
                class="mb-3 mr-9 inline-block w-3/4 min-w-max cursor-pointer rounded-lg border-none bg-neutral-200 px-6 py-3 text-center text-sm text-black drop-shadow-sm"
                :class="{ 'bg-sky-600 text-white': isZoneChecked(zone.id) }"
                :for="zone.code"
              >
                {{ zone.libelle }}
              </label>
              <div
                v-if="isZoneChecked(zone.id) && creneauType !== 'organisme'"
                class="flex-col pt-10"
              >
                <div
                  v-for="zoneActivite in zone.zoneActivites"
                  :key="zone.id + '-' + zoneActivite.activite.id"
                >
                  <div
                    v-if="zoneActivite.actif"
                    class="my-4 mr-10 flex justify-between"
                  >
                    <input
                      :id="zone.id + '-' + zoneActivite.activite.id"
                      v-model="zoneActivite.activite.checked"
                      type="checkbox"
                      class="hidden"
                    />
                    <label
                      class="mr-9 inline-block w-3/4 min-w-max cursor-pointer rounded-lg border-none bg-neutral-200 px-4 py-3 text-center text-sm text-black drop-shadow-sm"
                      :class="{
                        'bg-sky-600 text-white': zoneActivite.activite.checked,
                      }"
                      :for="zone.id + '-' + zoneActivite.activite.id"
                      >{{ zoneActivite.activite.libelle }}
                    </label>
                    <FAInput
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
          </template>
        </div>
        <div v-if="errorMessage">
          <p>
            Vous devez sélectionner au moins une activité pour créer le créneau.
          </p>
        </div>
      </div>
      <MentionChampsObligatoires/>
    </Modal>
  </form>
</template>

<script>
import { usePlanningStore } from '@stores/planning.ts'
import { useCreneauStore } from '@stores/creneau.ts'
import { useTypeCreneauStore } from '@stores/typeCreneau.js'
import { useOrganismeStore } from '@stores/organisme.ts'
import { getParametres } from '@api/parametre'
import { getZones } from '@api/zone'

import Modal from '@components/common/Modal.vue'
import InputRadio from '@components/common/InputRadio.vue'
import InputSelect from '@components/common/Select.vue'
import FAInput from '@components/common/Input.vue'
import FAButton from '@components/common/Button.vue'
import MenuRecurrence from '@components/faPlanning/MenuRecurrence.vue'
import MentionChampsObligatoires from "@components/common/MentionChampsObligatoires.vue";
import Button from "@components/common/Button.vue";

import { mapStores } from 'pinia'

export default {
  components: {
    Button,
    MentionChampsObligatoires,
    Modal,
    InputRadio,
    InputSelect,
    FAInput,
    FAButton,
    MenuRecurrence,
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    typeAction: {
      type: String,
      default: '',
    },
    readonly: Boolean,
  },
  emits: ['closeModalCreneau'],
  data() {
    return {
      parametres: [],
      zones: [],
      // activites: [],
      datepicked: '',
      datepickerFormat: 'DD / MM / YYYY',
      timeSeparator: ':',
      defaultTarif: '20',
      submenu: 'none',
      errorMessage: false
    }
  },
  computed: {
    ...mapStores(usePlanningStore),
    ...mapStores(useCreneauStore),
    ...mapStores(useTypeCreneauStore),
    ...mapStores(useOrganismeStore),
    modalTitle() {
      switch (this.typeAction) {
        case 'create':
          return 'Création de créneau'
        case 'edit':
          return 'Modifier un créneau'
        default:
          return 'Modifier un créneau'
      }
    },
    typeCreneauListe() {
      return this.typeCreneauStore.typeCreneauListe
    },
    creneauType() {
      return this.typeCreneauListe.find(type => type.id === this.creneauStore.creneauType)?.code ?? null
    },
    getOrganismesOptions() {
      return this.organismeStore.organismes.map((organisme) => {
        return {
          id: organisme.id,
          label: organisme.libelle,
        }
      })
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
    isOneZoneChecked() {
      return this.creneauStore.zones.length > 0
    },
    isOneActivityChecked() {
      return this.creneauStore.activites.length > 0
    },
    isNotOrganismeOrMaintenance() {
      return (
        this.creneauType !== 'organisme' &&
        this.creneauType !== 'maintenance'
      )
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
    await this.organismeStore.fetchOrganismes({'fit_arena.id': this.$route.params.id})

    this.parametres = await getParametres()
    if (this.typeAction === 'create') {
      this.creneauStore.activites = []
    }
  },
  methods: {
    /**
     * Open the submenu that contains additional inputs 
     * @param {'advanced' | 'recurence' | 'none'} menu 
     */
    setSubmenu(type) {
      if(this.submenu == type) {
        this.submenu = 'none';
        return;
      }

      this.submenu = type;
    },
    selectActivities(zone) {
      const isChecked = this.isZoneChecked(zone.id)
      if (!isChecked) {
        for (const activity of zone.zoneActivites) {
          activity.activite.checked = true;
        }
      } else {
        for (const activity of zone.zoneActivites) {
          activity.activite.checked = false;
        }
      }
    },
    delete_creneau() {
      if (confirm('Souhaitez-vous vraiment supprimer le créneau ?')) {
        this.creneauStore.delete();
        this.$emit('closeModalCreneau')
      }
    },
    // isZoneEditable(zone) {
    //   if (this.typeAction == 'create' || this.typeAction === 'edit') return true
      
    //   return this.creneauStore.zones.includes(zone.id)
    // },
    async fetchZones() {
      this.zones = (await getZones({ page: 1, 'typeZone.code': 'zone', fitArena: this.$route.params.id })).filter(zone => zone.actif && zone.zoneActivites.length > 0)
      this.zones.forEach((zone, i) => {
        zone.zoneActivites.forEach(za => {
          if (!za.actif) {
            this.zones.splice(i, 1);
          }
        })
      });
      this.checkActivites()
    },
    updateActivites() {
      this.creneauStore.activites = []
      this.zones.forEach((zone) => {
        zone.zoneActivites.forEach((zone_activite) => {
          if (zone_activite.activite.checked == true) {
            this.creneauStore.addActivite({
              activiteId: zone_activite.activite.id,
              tarif: parseInt(zone_activite.activite.tarif),
              zoneId: zone.id,
            })
          }
        })
      })
    },
    checkActivites() {
      if (this.typeAction === 'edit') {
        this.zones.forEach((zone) => {
          zone.zoneActivites.forEach((zoneActivite) => {
            this.creneauStore.activites.forEach((activite) => {
              if (activite.activiteId === zoneActivite.activite.id) {
                zoneActivite.activite.checked = true
                zoneActivite.activite.tarif = activite.tarif
              }
            })
          })
        })
      }
    },
    submitCreneau() {
      const type_creneau = this.creneauStore.creneauType

      if (this.creneauStore.recurrence) {
        if (this.creneauStore.recurrence.maxOccurrences == 0 && this.creneauStore.recurrence.dateFin == "") {
          this.creneauStore.recurrence = undefined;
        } else {
          this.creneauStore.recurrence.separation -= 1
        }
      }
      const fitarena_id = parseInt(this.$route.params.id);

      if (this.isOneZoneChecked) {
        switch (type_creneau) {
          case 1:
            // Retrieve activity data from the local references
            // Before sending it to the API. This has to be done
            // This way because of the unsynchronized data.
            this.updateActivites()

            if (!this.isOneActivityChecked) {
              this.errorMessage = true
              break
            } else {
              this.typeAction === 'create' ?
                this.creneauStore.addCreneau(fitarena_id) :
                this.creneauStore.editCreneau(fitarena_id)
              this.$emit('closeModalCreneau')
            }
            break
  
          case 2:
          case 3:
            this.typeAction === 'create' ?
              this.creneauStore.addCreneauOrganisme(fitarena_id) :
              this.creneauStore.editCreneauOrganisme(fitarena_id)
            this.$emit('closeModalCreneau')
            break
        }
      } else {
        this.errorMessage = true
      }
    },
    isZoneChecked(zoneId) {
      return this.creneauStore.zones.includes(zoneId)
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

.bg-advanced, .bg-recurence {
  background-color: rgb(2 132 199 / var(--tw-bg-opacity));
}

.bg-none {
  background-color: #fff;
  color: #000;
}
</style>
