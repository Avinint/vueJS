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
          <div class="cursor-default px-4">
            {{ currentDateStart }}
            <template v-if="planningStore.currentViewName === 'day'">
              - {{ currentDateEnd }}
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
  props: {
    calendarApi: {
      type: Object || null,
      required: true,
    },
    currentDateStart: {
      type: String,
      required: true,
    },
    currentDateEnd: {
      type: String,
      required: true,
    },
    currentWeek: {
      type: String,
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
    this.zones = await getZones(
      1,
      '&typeZone.code=zone&fitArena=' + this.$route.params.id
    )
    this.viewWeek()
  },
  methods: {
    today() {
      // WS query api Today
      this.calendarApi.today()
    },
    prev() {
      // WS query api WEEK 4-5
      this.calendarApi.prev()
    },
    next() {
      // WS query api Next
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
      this.calendarApi.changeView('timeGridWeek')
      this.clickFilter(this.zones[0].id) // select first zone
      this.planningStore.currentViewName = 'day'
    },
    viewDay() {
      this.calendarApi.changeView('resourceTimeGridDay')
      this.planningStore.currentViewName = 'week'
    },
  },
}
</script>
<style scopped>
.active {
  background-color: #0b83d9;
  color: white;
}
</style>
