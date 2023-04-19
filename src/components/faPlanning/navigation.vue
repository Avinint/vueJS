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
            :label="currentViewName === 'day' ? 'Journée >' : 'Semaine >'"
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
            {{ planningStore.getStartDate }}
            <template v-if="currentViewName === 'day'">
              - {{ planningStore.getEndDate }}
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
            :label="'S' + planningStore.getCurrentWeek"
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
      currentViewName: 'week',
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
    this.viewWeek()
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
    clickFilter(zoneId) {
      switch (this.calendarApi.currentData.currentViewType) {
        case 'timeGridWeek':
          this.planningStore.selectZone(zoneId)
          break
        case 'resourceTimeGridDay':
          this.planningStore.toggleZone(zoneId)
          break
      }
      this.$emit('filterUpdated')
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
      this.calendarApi.changeView('timeGridWeek')
      this.clickFilter(this.zones[0].id) // select first zone
      this.currentViewName = 'day'
    },
    viewDay() {
      this.calendarApi.changeView('resourceTimeGridDay')
      this.currentViewName = 'week'
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
