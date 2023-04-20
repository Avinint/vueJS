<template>
  <div class="fa-planning">
    <PlanningNavigation
      :calendar-api="calendarApi"
      @filterUpdated="renderEvents"
    />
    <FullCalendar
      ref="fullCalendar"
      class="demo-app-calendar"
      :options="calendarOptions"
    >
      <template #eventContent="arg">
        <div class="flex h-full items-center">
          <div class="h-full w-2 rounded-l-xl bg-red-500"></div>
          <div class="flex grow flex-col pl-3 text-xs text-black">
            <span class="">
              {{ $dayjs(arg.event.start).format('h:mm') }} -
              {{ $dayjs(arg.event.end).format('h:mm') }}
              <br />{{ arg.event.extendedProps.activites }}
            </span>
            <span class="">{{ arg.event.title }}</span>
          </div>
        </div>
      </template>
    </FullCalendar>
  </div>
</template>

<script lang="ts">
import PlanningNavigation from '@components/faPlanning/navigation.vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import frLocale from '@fullcalendar/core/locales/fr'
import { getActivites } from '@api/activite.js'
import { usePlanningStore } from '@stores/planning.js'
import { mapStores } from 'pinia'

export default {
  components: {
    PlanningNavigation,
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
        weekends: true,
        datesSet: this.refreshDates,
        dayHeaderFormat: { weekday: 'long', day: 'numeric', month: 'long' },
        nowIndicator: true,
        eventDisplay: 'block',
        events: [],
        resources: [],
        allDaySlot: false,
        height: 'auto',
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
        // timeZone: 'UTC', // TODO dayjs UTC local: https://dayjs.gitee.io/docs/en/parse/unix-timestamp
        slotMinTime: '07:00:00',
        slotMaxTime: '22:00:00',
        slotLabelFormat: {
          hour: 'numeric',
          minute: '2-digit',
        },
      },
      calendarApi: {},
    }
  },
  computed: {
    ...mapStores(usePlanningStore),
  },
  async mounted() {
    this.calendarApi = this.$refs.fullCalendar.getApi()
    this.setRessources()
    this.planningStore.fetch()
    this.renderEvents()
  },
  methods: {
    async setRessources() {
      const activites = await getActivites(this.$route.params.id)
      // map cause error (operator 'in' problem), use forEach
      activites.forEach(function (activite) {
        activite.title = activite.libelle
      })
      this.calendarOptions.resources = activites
    },
    renderEvents() {
      this.calendarOptions.events = this.planningStore.creneaux
    },
    refreshDates(dateInfo) {
      this.planningStore.dateInfo = dateInfo
    },
  },
}
</script>

<style lang="scss">
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
