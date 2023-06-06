<template>
  <div class="fa-planning">
    <PlanningNavigation
      class="mb-6"
      :calendar-api="calendarApi"
      @filter-updated="applyFilter"
    />
    <modalCreneau
      v-if="isModalCreneauOpen"
      :is-open="isModalCreneauOpen"
      :type-action="actionType"
      @close-modal-creneau="closeModal"
    />
    <div
      class="space-y-3 rounded-lg border border-gray-200 bg-white p-4 shadow"
    >
      <FullCalendar ref="fullCalendar" :options="calendarOptions">
        <template #eventContent="arg">
          <div class="flex h-full items-center">
            <div
              class="h-full w-2 rounded-l-xl"
              :class="{
                'bg-red-600': arg.event.extendedProps.type == 1,
                'bg-blue-600': arg.event.extendedProps.type == 2,
              }"
            ></div>
            <div class="flex grow justify-between px-3 pr-3 text-xs text-black">
              <div class="flex flex-col">
                <span>
                  {{ $dayjs(arg.event.start).format('H:mm') }} -
                  {{ $dayjs(arg.event.end).format('H:mm') }}
                </span>
                <span class="">{{ arg.event.title }}</span>
              </div>
              <div class="flex">
                <span
                  v-if="arg.event.extendedProps.activites"
                  class="mr-2 fill-red-600"
                ></span>
                <span
                  class="text-2xs border-3 flex h-8 w-8 items-center justify-center rounded-full border-red-600 bg-white text-center leading-none"
                >
                  Terrain<br />
                  1/3
                </span>
              </div>
            </div>
          </div>
        </template>
      </FullCalendar>
    </div>
  </div>
</template>

<script>
import PlanningNavigation from '@components/faPlanning/navigation.vue' // PlanningNavigation as navigation is an html reserved tag
import modalCreneau from '@components/faPlanning/modalCreneau.vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import frLocale from '@fullcalendar/core/locales/fr'
import { usePlanningStore } from '@stores/planning.ts'
import { useCreneauStore } from '@stores/creneau.ts'
import { mapStores } from 'pinia'
import { getZones } from '@api/zone.js'

export default {
  components: {
    PlanningNavigation,
    modalCreneau,
    FullCalendar,
  },
  data() {
    return {
      calendarOptions: {
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          resourceTimeGridPlugin,
          interactionPlugin,
        ],
        headerToolbar: false,
        initialView: 'timeGridWeek',
        locale: frLocale,
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        slotEventOverlap: true,
        weekends: true,
        datesSet: this.refreshDates,
        eventClick: this.eventClick,
        eventResize: this.eventResizeOrDrag,
        eventDrop: this.eventResizeOrDrag,
        select: this.select,
        dayHeaderFormat: { weekday: 'long', day: 'numeric', month: 'long' },
        nowIndicator: true,
        eventDisplay: 'block',
        events: [],
        resources: [],
        allDaySlot: false,
        eventOverlap: false,
        selectOverlap: false,
        height: 'auto',
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
        // timeZone: 'UTC', // TODO dayjs UTC local: https://dayjs.gitee.io/docs/en/parse/unix-timestamp
        slotLabelFormat: {
          hour: 'numeric',
          minute: '2-digit',
        },
      },
      calendarApi: {},
      isModalCreneauOpen: false,
      actionType: '',
      zones: [],
    }
  },
  computed: {
    ...mapStores(usePlanningStore),
    ...mapStores(useCreneauStore),
  },
  async created() {
    this.calendarOptions.slotMinTime = this.planningStore.slotMinTime
    this.calendarOptions.slotMaxTime = this.planningStore.slotMaxTime
    // sync events from store/api
    this.$watch(
      () => this.planningStore.getCreneauxEvents,
      (newCreneaux) => {
        this.calendarOptions.events = newCreneaux
      }
    )
  },
  async mounted() {
    this.calendarApi = this.$refs.fullCalendar.getApi()
    this.zones = await getZones(
      1,
      '&typeZone.code=zone&fitArena=' + this.$route.params.id
    )
    this.calendarOptions.resources = [
      { id: this.zones[0].id, title: this.zones[0].libelle },
    ]
  },
  methods: {
    async closeModal() {
      this.isModalCreneauOpen = false
    },
    async applyFilter() {
      const zones = []
      this.zones.forEach((zone) => {
        if (this.planningStore.isZoneActive(zone.id)) {
          zones.push({ id: zone.id, title: zone.libelle })
        }
      })
      this.calendarOptions.resources = zones
    },
    refreshDates(dateInfo) {
      this.planningStore.currentWeek = this.getWeekNumber(dateInfo.start)
      this.planningStore.currentDateStart = dateInfo.start
      this.planningStore.currentDateEnd = dateInfo.end
    },
    eventClick(eventClickInfo) {
      this.actionType = 'edit'
      this.setSelectedCreneau(eventClickInfo.event)
      this.isModalCreneauOpen = true
    },
    select(selectionInfo) {
      this.actionType = 'create'
      this.creneauStore.setDefault()
      this.setSelectedCreneau(selectionInfo)
      this.isModalCreneauOpen = true
    },
    eventResizeOrDrag(info) {
      this.creneauStore.editCreneau(info.event)
    },
    setSelectedCreneau(fullCalendarCreneau) {
      this.creneauStore.setCreneau(fullCalendarCreneau)
    },
    getWeekNumber: function (date) {
      var d = new Date(date)
      d.setHours(0, 0, 0, 0)
      d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7))
      var week1 = new Date(d.getFullYear(), 0, 4)
      return (
        1 +
        Math.round(
          ((d.getTime() - week1.getTime()) / 86400000 -
            3 +
            ((week1.getDay() + 6) % 7)) /
            7
        )
      )
    },
  },
}
</script>

<style lang="scss">
.fa-planning {
  min-width: 1380px;
}

// TODROP
.border-3 {
  border-width: 3px;
}

.text-2xs {
  font-size: 8px;
}

// END-TODROP
.fc {
  .fc-scrollgrid {
    @apply border-none;
    border: none !important;
  }

  .fc-v-event {
    @apply border-none;
    @apply bg-slate-100;
    @apply rounded-xl;
    box-shadow: 2px 2px 4px 0 rgb(209, 209, 209);
  }

  th[role='presentation'] {
    background-color: transparent !important;
  }

  .fc-col-header-cell-cushion {
    color: black !important;
    text-transform: capitalize;
  }

  .fc-scrollgrid-sync-inner {
    @apply text-sm;
  }
}

.fc-direction-ltr .fc-timegrid-col-events {
  margin: 0;
}
</style>
