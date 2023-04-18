<template>
  <nav class="flex">
    <section class="flex w-full justify-between pb-9">
      <NavigationSection class="grow">
        <template #title>
          Zone active {{ planningStore.getNumberActiveZone }}
        </template>
        <template #content>
          <Button
            v-for="zone in zones"
            :key="zone.id"
            :label="zone.libelle"
            type="checkbox"
            :submit="false"
            :class="{ active: planningStore.isZoneActive(zone.id) }"
            @click="clickFilter(zone.id)"
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
            :label="currentViewName"
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
          <div class="cursor-default px-4">
            {{ currentRangeDate }}
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
            :label="'S' + currentWeek"
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
  props: ['calendarApi', 'currentRangeDate', 'currentWeek'],
  data() {
    return {
      currentViewName: 'Journée',
      zones: [],
    }
  },
  computed: {
    ...mapStores(usePlanningStore),
  },
  async mounted() {
    this.zones = await getZones(
      1,
      '&typeZone.code=zone&fitArena=' + this.$route.params.id
    )
    this.selectFirstZone()
  },
  methods: {
    today() {
      this.calendarApi.today()
    },
    prev() {
      this.calendarApi.prev()
    },
    next() {
      this.calendarApi.next()
    },
    selectFirstZone() {
      this.clickFilter(this.zones[0].id)
    },
    clickFilter(zoneId) {
      switch (this.calendarApi.currentData.currentViewType) {
        case 'timeGridWeek':
          this.planningStore.selectZone(zoneId)
          break
        case 'timeGridDay':
          this.planningStore.toggleZone(zoneId)
          break
      }
      this.$emit('filterUpdated')
    },
    toggleView() {
      switch (this.calendarApi.currentData.currentViewType) {
        case 'timeGridWeek':
          this.calendarApi.changeView('timeGridDay')
          this.currentViewName = 'Semaine'
          break
        case 'timeGridDay':
          this.calendarApi.changeView('timeGridWeek')
          this.selectFirstZone()
          this.currentViewName = 'Journée'
          break
      }
    },
  },
}
</script>
<style>
.active {
  background-color: #0b83d9;
  color: white;
}
</style>
