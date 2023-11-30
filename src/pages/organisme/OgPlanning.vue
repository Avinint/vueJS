<template>
  <div class="fa-planning">
    <ModalSeance ref="modal" />
    <ModalDemande ref="modal_demande" :zones="zones" />
    <PlanningNavigation
      v-if="calendar_api"
      class="mb-6"
      :calendar-api="calendar_api"
      @filter-updated="applyFilter"
    />
    <div
      class="space-y-3 p-4"
    >
      <FullCalendar ref="calendar" :options="calendar_options">
        <template #eventContent="arg">
          <EventOrga :event="arg.event" />
        </template>
      </FullCalendar>
    </div>
  </div>
</template>

<script setup lang="ts">
import PlanningNavigation from '@components/faPlanning/navigation.vue' // PlanningNavigation as navigation is an html reserved tag
import EventOrga from '@components/faPlanning/EventOrga.vue'
import ModalSeance from '@components/faPlanning/ModalSeance.vue'
import ModalDemande from '@components/faPlanning/ModalDemande.vue'

import FullCalendar from '@fullcalendar/vue3'
import type { EventSourceInput } from '@fullcalendar/core'
import type { EventClickArg } from '@fullcalendar/core'
import { type CalendarOptions } from '@fullcalendar/core'
import type { DateSelectArg } from '@fullcalendar/core'

import { usePlanningStore } from '@stores/planning'
import { useCreneauStore } from '@stores/creneau'
import { getZones } from '@api/zone.js'
import { planning_configuration } from '../../services/planning/planning_service'
import { getWeekNumber } from '../../services/date_service'

import { onBeforeMount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const planning_store = usePlanningStore()
const creneau_store = useCreneauStore()
const calendar_options = reactive<CalendarOptions>({
  ...planning_configuration,
  editable: false,
  select: select,
  datesSet: refreshDates,
  eventClick: eventClick,
})

const calendar_api = ref()
const calendar = ref<InstanceType<typeof FullCalendar>>()
const modal = ref<InstanceType<typeof ModalSeance>>()
const modal_demande = ref<InstanceType<typeof ModalDemande>>()
const zones = ref<Zone[]>([])
const route = useRoute()

onBeforeMount(() => {
  calendar_options.slotMinTime = planning_store.slotMinTime
  calendar_options.slotMaxTime = planning_store.slotMaxTime
  watch(
    () => planning_store.getCreneauxOrganismesEvents,
    (events: any) => {
      calendar_options.events = events as EventSourceInput
    }
  )
})

onMounted(async () => {
  calendar_api.value = calendar.value?.getApi()
  zones.value = await getZones({ page: 1, 'typeZone.code': 'zone', fitArena: route.params.id })

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
  if (eventClickInfo.event._def.extendedProps.statut == 'demande' && modal_demande.value) {
    modal_demande.value.edit(eventClickInfo)
  } else if (modal.value) {
    modal.value.open_modal()
  }
}

async function applyFilter () {
  let zonesTemp = []
  zones.value.forEach((zone) => {
    if (planning_store.isZoneActive(zone.id)) {
      zonesTemp.push({ id: zone.id, title: zone.libelle })
    }
  })
  calendar_options.resources = zonesTemp
}

function select(event: DateSelectArg) {
  if (modal_demande.value) {
    modal_demande.value.create(event)
  }
}
</script>

<style>
.fc .fc-event-anonyme {
  background-color: #DCDCF0;
  border-radius: 0px;
}

.fc .fc-event-demande {
  background-color: #3586E2;
}
</style>