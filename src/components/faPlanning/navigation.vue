<template>
  <nav class="flex">
    <section class="flex w-full justify-between pb-9">
      <NavigationSection class="grow">
        <template #title> Zone active </template>
        <template #content>
          <Button
            v-for="zone in zones"
            :key="zone.id"
            :label="zone.libelle"
            type="secondary"
            :submit="false"
            :class="{ active: planningStore.isZoneActive(zone.id) }"
            @click="filterByZone(zone.id)"
          />
        </template>
      </NavigationSection>
      {{ planningStore.filters.debut }}
      <NavigationSection>
        <template #title> Affichage du planning </template>
        <template #content>
          <Button
            label="Aujourd'hui"
            type="secondary"
            icon=""
            :submit="false"
            @click="today()"
          />
          <Button
            :label="
              planningStore.currentViewName === 'day'
                ? 'Journée >'
                : 'Semaine >'
            "
            type="secondary"
            icon=""
            :submit="false"
            @click="toggleView()"
          />
        </template>
      </NavigationSection>
      <NavigationSection>
        <template #title>Période en cours</template>
        <template #content>
          <Button
            label="<"
            type="secondary"
            icon="prev"
            :submit="false"
            class="m-0"
            @click="prev()"
          />
          <div class="min-w-max cursor-default px-4">
            {{ planningStore.getCurrentDateStart }}
            <template v-if="planningStore.currentViewName === 'day'">
              - {{ planningStore.getCurrentDateEnd }}
            </template>
          </div>
          <Button
            label=">"
            type="secondary"
            icon="next"
            :submit="false"
            @click="next()"
          />
          <Button
            class="cursor-default"
            :label="'S' + planningStore.currentWeek"
            type="secondary"
            icon="next"
            :submit="false"
          />
        </template>
      </NavigationSection>
    </section>
  </nav>
</template>

<script>
import Button from '@components/common/Button.vue'
import { getZones } from '@api/zone.js'
import NavigationSection from '@components/faPlanning/navigationSection.vue'
import { usePlanningStore } from '@stores/planning.js'
import { mapStores } from 'pinia'

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
    }
  },
  computed: {
    ...mapStores(usePlanningStore),
  },
  async mounted() {
    await this.setZones()
    this.viewWeek()
    await this.planningStore.fetch()
    this.planningStore.$subscribe(async (mutation) => {
      if (mutation.events.key !== 'creneaux') await this.planningStore.fetch()
    })
  },
  methods: {
    today() {
      this.calendarApi.today()
      this.updateDebut()
    },
    prev() {
      this.calendarApi.prev()
      this.updateDebut()
    },
    next() {
      this.calendarApi.next()
      this.updateDebut()
    },
    async setZones() {
      this.zones = await getZones(
        1,
        '&typeZone.code=zone&fitArena=' + this.$route.params.id
      )
    },
    filterByZone(zoneId) {
      switch (this.calendarApi.currentData.currentViewType) {
        case 'timeGridWeek':
          this.planningStore.selectZone(zoneId)
          break
        case 'resourceTimeGridDay':
          this.planningStore.toggleZone(zoneId)
          break
      }
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
    },
    viewWeek() {
      this.planningStore.filters.debut = this.getDebutOfWeek()
      this.planningStore.filters.fit_arena = this.$route.params.id
      this.planningStore.filters.duree = 7
      this.planningStore.filters.zone = [this.zones[0].id] // select first zone
      this.calendarApi.changeView('timeGridWeek')
      this.planningStore.currentViewName = 'day'
    },
    viewDay() {
      this.planningStore.filters.debut = this.getDebutOfDay()
      this.planningStore.filters.duree = 1
      this.calendarApi.changeView('resourceTimeGridDay')
      this.planningStore.currentViewName = 'week'
    },
    updateDebut() {
      this.planningStore.filters.debut =
        this.planningStore.currentViewName === 'week'
          ? this.getDebutOfWeek()
          : this.getDebutOfDay()
    },
    getDebutOfWeek() {
      const firstDayOfWeek = new Date(
        this.planningStore.currentDateStart.setDate(
          this.planningStore.currentDateStart.getDate() -
            ((this.planningStore.currentDateStart.getDay() + 6) % 7)
        )
      )
      firstDayOfWeek.setHours(0, 0, 0, 0)
      return Math.floor(firstDayOfWeek.getTime() / 1000)
    },
    getDebutOfDay() {
      const date = this.planningStore.currentDateStart
      date.setHours(0, 0, 0, 0)
      return Math.floor(date.getTime() / 1000)
    },
  },
}
</script>
<style scopped lang="scss">
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
