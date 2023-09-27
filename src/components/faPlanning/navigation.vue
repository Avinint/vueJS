<template>
  <nav
    class="flex space-y-3 p-4"
  >
    <section class="flex w-full justify-between gap-2">
      <NavigationSection>
        <template #title> Zones actives </template>
        <template #content>
          <div class="flex flex-wrap gap-1">
            <template v-for="zone in zones" :key="zone.id">
              <Button
                v-if="zone.actif && zone.zoneActivites.length > 0"
                :label="zone.libelle"
                couleur="secondary"
                :submit="false"
                class="mr-2"
                :class="{ active: planningStore.isZoneActive(zone.id) }"
                @click="filterByZone(zone.id)"
              />
            </template>
          </div>
        </template>
      </NavigationSection>
      <div class="flex">
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
                planningStore.currentViewName === 'day'
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
                v-model="startDate"
                i18n="fr"
                as-single
                :placeholder="`${startDate} - ${endDate}`"
                :formatter="formatDate"
              />
              <Button
                label=">"
                couleur="info"
                icon="next"
                :submit="false"
                @click="next()"
              />
              <Button
                class="cursor-default"
                :label="'S' + planningStore.currentWeek"
                couleur="info"
                icon="next"
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
import { getZones } from '@api/zone.js'
import NavigationSection from '@components/faPlanning/navigationSection.vue'
import { usePlanningStore } from '@stores/planning.ts'
import { mapStores } from 'pinia'
import dayjs from "dayjs";

export default {
  components: {
    Button,
    NavigationSection,
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
      endDate: '',
    }
  },
  computed: {
    ...mapStores(usePlanningStore),
    idFitArena() {
      return this.$route.params.id
    },
    idOrganisme() {
      return this.$route.params.id
    },
    formatDate() {
      return { startDate: 'YYYY-MM-DD', month: 'MMMM' }
    }
  },
  watch: {
    startDate (value) {
      value = dayjs(value).format('YYYY-MM-DD')
      this.changeData(value)
    },
    async idFitArena() {
      this.fetchDonnees()
    },
    async idOrganisme() {
      this.fetchDonnees()
    }
  },
  async mounted() {
    await this.fetchDonnees()
    await this.setZones()
    this.viewWeek()
    await this.planningStore.fetch()
    this.$emit('afterFetch');
    this.setDate()
  },
  methods: {
    setDate() {
      this.startDate = this.planningStore.getCurrentDateStart
      this.endDate = this.planningStore.getCurrentDateEnd
      this.startDate = dayjs(this.startDate).format('YYYY-MM-DD')
      this.endDate = dayjs(this.endDate).format('YYYY-MM-DD')
    },
    changeData(date) {
      this.calendarApi.gotoDate(date)
      this.setDate()
      this.planningStore.fetch().then(() => {
        this.$emit('afterFetch')
      })
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
      this.zones = await getZones({ page: 1, 'typeZone.code': 'zone', fitArena: this.$route.params.id })
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
      this.planningStore.filters.zone = [this.zones[0].id] // select first zone
      this.calendarApi.changeView('timeGridWeek')
      this.planningStore.currentViewName = 'day'
    },
    viewDay() {
      this.planningStore.filters.duree = 1
      this.calendarApi.changeView('resourceTimeGridDay')
      this.planningStore.currentViewName = 'week'
    },
    async fetchDonnees() {
      await this.setZones()
      this.viewWeek()
      await this.planningStore.fetch()
      this.$emit('afterFetch');
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
</style>
