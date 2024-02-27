<template>
  <Spinner v-if="spinner" />

  <nav
    v-if="!spinner"
    class="flex space-y-3 p-4"
  >
    <section class="flex w-full justify-between gap-2">
      <NavigationSection>
        <template #title> Zones actives </template>
        <template #content>
          <div v-if="zones.length" class="flex flex-wrap gap-1">
            <template v-for="zone in zones" :key="zone.id">
              <Button
                :label="zone.libelle"
                couleur="secondary"
                :submit="false"
                class="mr-2"
                :class="{ active: planningStore.isZoneActive(zone.id) }"
                @click="filterByZone(zone.id)"
              />
            </template>
          </div>
          <div v-else>Aucune zone ou activité par zone active</div>
        </template>
      </NavigationSection>
      <div class="flex navigation">
        <NavigationSection class="justify-center px-4">
          <template #title> Affichage du planning </template>
          <template #content>
            <Button
              label="Aujourd'hui"
              couleur="secondary"
              icon=""
              :submit="false"
              class="mr-2 text-black"
              @click="today()"
            />
            <Button
              :label="
                planningStore.currentViewName === 'week'
                  ? 'Journée >'
                  : 'Semaine >'
              "
              couleur="info"
              class="w-24"
              :submit="false"
              @click="toggleView()"
            />
          </template>
        </NavigationSection>
        <NavigationSection class="justify-center">
          <template #title>Période en cours</template>
          <template #content>
              <Button
                label="<"
                couleur="info"
                icon="prev"
                :submit="false"
                class="m-0"
                @click="prev()"
              />
              <vue-tailwind-datepicker
                input-classes="bg-gray-300 border border-gray-300 rounded-lg py-1.5 text-black w-56"
                ref="datepicker"
                v-model="startDate"
                i18n="fr"
                as-single
                :placeholder="dateAffichee"
                :formatter="formatDatepicker"
              />
              <Button
                label=">"
                couleur="info"
                :submit="false"
                @click="next()"
              />
              <Button
                class="cursor-default"
                :label="'S' + planningStore.currentWeek"
                couleur="info"
                :submit="false"
              />
          </template>
        </NavigationSection>
      </div>
    </section>
  </nav>
</template>

<script>
import Button from '@components/common/Button.vue'
import NavigationSection from '@components/faPlanning/navigationSection.vue'
import Spinner from '@components/common/Spinner.vue'

import { getZones } from '@api/zone.js'
import { usePlanningStore } from '@stores/planning.ts'
import { mapStores } from 'pinia'
import dayjs from "dayjs";

export default {
  components: {
    Button,
    NavigationSection,
    Spinner
  },
  props: {
    calendarApi: {
      type: Object || null,
      required: true,
    },
  },
  data() {
    return {
      zones: [],
      startDate: '',
      startMonth: '',
      dateAffichee: ' ', // une chaine vide affiche true dans le placeholder du datepicker
      endDate: '',
      formatDateFr: 'DD-MM-YYYY',
      formatMoisFr: 'MMM YYYY',
      formatDatepicker: { date: 'DD-MM-YYYY', month: 'MMMM' },
      spinner: false,
      filtersZonesForDayView: []
    }
  },
  computed: {
    ...mapStores(usePlanningStore),
    id() {
      return this.$route.params.id
    },
    currentView() {
      return this.planningStore.currentViewName
    }
  },
  watch: {
    startDate (value) {
      if (value !== '') {
        value = dayjs(value, this.formatDateFr).format('YYYY-MM-DD')
        this.changeDate(value)
      }
    },
    async id() {
      this.fetchDonnees()
    },
    currentView() { this.setDateAffichee() }
  },
  async mounted() {
    this.spinner = true
    this.planningStore.currentViewName = 'week'
    this.$nextTick(() => this.setDate())
    await this.fetchDonnees()
    this.startDate = ''
    this.spinner = false
  },
  methods: {
    setDateAffichee() {
      if (this.startDate === '') {
        this.setDate()
      }

      this.dateAffichee = this.planningStore.currentViewName === 'day' ? this.startDate : this.startMonth
    },
    setDate() {
      this.startDate = dayjs(this.planningStore.getCurrentDateStart).format(this.formatDateFr)
      this.startMonth = dayjs(this.planningStore.getCurrentDateStart).format(this.formatMoisFr).toUpperCase()
      const end = this.planningStore.getCurrentDateEnd ??
        dayjs(this.planningStore.getCurrentDateStart)
        .add(this.planningStore.filters.duree, 'day')
        .format('YYYY-MM-DD')
      this.endDate = dayjs(end).format(this.formatDateFr)

      this.setDateAffichee()
    },
    changeDate(date) {
      this.calendarApi.gotoDate(date)
      this.setDate()
      if (this.planningStore.filters.duree !== 0) {
        this.planningStore.fetch().then(() => {
          this.$emit('afterFetch')
        })
        if (this.$refs.datepicker !== null)
          this.$refs.datepicker.clearPicker()
      }
    },
    today() {
      this.calendarApi.today()
      this.planningStore.fetch().then(() => {
        this.$emit('afterFetch')
      })
      this.setDate()
    },
    prev() {
      this.calendarApi.prev()
      this.planningStore.fetch().then(() => {
        this.$emit('afterFetch')
      })
      this.setDate()
    },
    next() {
      this.calendarApi.next()
      this.planningStore.fetch().then(() => {
        this.$emit('afterFetch')
      })
      this.setDate()
    },
    updateActivities() {
      this.planningStore.updateActivities()
    },
    async setZones() {
      this.zones = (await getZones({ page: 1, 'order[ordre]': 'asc', 'typeZone.code': 'zone', fitArena: this.$route.params.id })).filter(zone => zone.actif && zone.zoneActivites.length > 0)
      this.zones.forEach((zone, i) => {
        zone.zoneActivites.forEach(za => {
          if (!za.actif) {
            this.zones.splice(i, 1);
          }
        })
      })
    },
    async filterByZone(zoneId) {
      switch (this.calendarApi.currentData.currentViewType) {
        case 'timeGridWeek':
          this.planningStore.selectZone(zoneId)
          break
        case 'resourceTimeGridDay':
          this.planningStore.toggleZone(zoneId)
          break
      }
      await this.planningStore.fetch()
      this.$emit('filter-updated')
    },
    toggleView() {
      switch (this.calendarApi.currentData.currentViewType) {
        case 'timeGridWeek':
          this.viewDay()
          break
        case 'resourceTimeGridDay':
          this.viewWeek()
          break
      }
      this.planningStore.fetch()
      this.$emit('view-changed')
    },
    viewWeek() {
      this.planningStore.filters.fit_arena = this.$route.params.id
      this.planningStore.filters.organisme = (this.$route.params.org_id) ? this.$route.params.org_id : null
      this.planningStore.filters.duree = 7
      if (this.zones.length > 0 && this.planningStore.filters.zone.length > 1) {
        this.filtersZonesForDayView = this.planningStore.filters.zone
      }
      this.planningStore.filters.zone = this.zones.length !== 0 ? [this.zones[0].id] : [] // select first zone if zone
      this.calendarApi.changeView('timeGridWeek')
      this.planningStore.currentViewName = 'week'
    },
    viewDay() {
      if (this.filtersZonesForDayView.length > 1) {
        this.planningStore.filters.zone = this.filtersZonesForDayView
      }
      this.$emit('filter-updated')
      this.planningStore.filters.duree = 1
      this.calendarApi.changeView('resourceTimeGridDay')
      this.planningStore.currentViewName = 'day'
    },
    async fetchDonnees() {
      await this.setZones()
      this.viewWeek()
      await this.planningStore.fetch()
      this.$emit('afterFetch')
    },
  },
}
</script>

<style scoped lang="scss">
.active {
  background-color: #0b83d9;
  color: white;
}
button {
  @apply min-w-max;
  &:hover {
    @apply bg-sky-600 text-white;
  }
  &:active {
    @apply relative;
    top: 1px;
  }
}

.navigation {
  min-width: 583px;
}
</style>
