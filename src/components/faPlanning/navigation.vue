<template>
  <nav class="flex rounded-lg border border-gray-200 bg-white p-4 shadow space-y-3">
    <section class="flex flex-wrap w-full gap-5">
      <NavigationSection>
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
  },
  methods: {
    today() {
      this.calendarApi.today()
    },
    prev() {
      this.calendarApi.prev()
      this.planningStore.fetch();
    },
    next() {
      this.calendarApi.next()
      this.planningStore.fetch();
    },
    updateActivities() {
      this.planningStore.updateActivities();
    },
    async setZones() {
      this.zones = await getZones(
        1,
        '&typeZone.code=zone&fitArena=' + this.$route.params.id
      )
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
      await this.planningStore.fetch();
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
      this.planningStore.fetch();
      this.$emit('view-changed')
    },
    viewWeek() {
      this.planningStore.filters.fit_arena = this.$route.params.id
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
