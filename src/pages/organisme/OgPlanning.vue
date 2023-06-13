<template>
  <div class="fa-planning">
    <ModalSeance ref="modal"/>
    <PlanningNavigation v-if="calendar_api" class="mb-6" :calendar-api="calendar_api" />
    <div
      class="space-y-3 rounded-lg border border-gray-200 bg-white p-4 shadow"
    >
      <FullCalendar ref="calendar" :options="calendar_options">
        <template #eventContent="arg">
          <Event :event="arg.event"/>
        </template>
      </FullCalendar>
    </div>
  </div>
</template>

<script setup lang="ts">
import PlanningNavigation from '@components/faPlanning/navigation.vue' // PlanningNavigation as navigation is an html reserved tag
import FullCalendar from '@fullcalendar/vue3'
import { usePlanningStore } from '@stores/planning'
import { useCreneauStore } from '@stores/creneau'
import { getZones } from '@api/zone.js'
import { planning_configuration } from '../../services/planning/planning_service'
import { onBeforeMount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getWeekNumber } from '../../services/date_service'
import type { EventSourceInput } from '@fullcalendar/core'
import Event from '@components/faPlanning/Event.vue'
import ModalSeance from '@components/faPlanning/ModalSeance.vue'
import type { EventClickArg } from '@fullcalendar/core'
import type { EventImpl } from '@fullcalendar/core/internal'

const planning_store = usePlanningStore()
const creneau_store = useCreneauStore()
const calendar_options = reactive({
  ...planning_configuration,
  editable: false,
  datesSet: refreshDates,
  eventClick: eventClick,
});

const calendar_api = ref()
const calendar = ref<InstanceType<typeof FullCalendar>>()
const modal = ref<InstanceType<typeof ModalSeance>>();
const zones = ref<Zone[]>([])
const route = useRoute()

onBeforeMount(() => {
  calendar_options.slotMinTime = planning_store.slotMinTime;
  calendar_options.slotMaxTime = planning_store.slotMaxTime;
  watch(() => planning_store.getCreneauxOrganismesEvents, (events) => {
    calendar_options.events = events as EventSourceInput;
  });
});

onMounted(async () => {
  calendar_api.value = calendar.value?.getApi()
  zones.value = await getZones(
    1,
    `&typeZone.code=zone&fitArena=${route.params.id}`
  )

  calendar_options.resources = [
    { id: zones.value[0].id.toString(), title: zones.value[0].libelle },
  ]
})

function refreshDates(dateInfo: any) {
  planning_store.currentWeek = getWeekNumber(dateInfo.start)
  planning_store.currentDateStart = dateInfo.start
  planning_store.currentDateEnd = dateInfo.end
}

function eventClick(eventClickInfo: EventClickArg) {  
  creneau_store.setCreneau(eventClickInfo.event as any) // TODO: improve typing
  if(modal.value) {
    modal.value.open_modal();
  }
}
</script>

<style scoped>
</style>
