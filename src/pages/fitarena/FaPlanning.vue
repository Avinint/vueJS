<template>
  <div class="fa-planning">
    <PlanningNavigation
      :calendar-api="calendarApi"
      @filterUpdated="renderEvents"
      :current-date-start="currentDateStart"
      :current-date-end="currentDateEnd"
      :current-week="currentWeek"
    />
    <addCreneau
      v-if="isModalAddCreneauOpen"
      :is-open="isModalAddCreneauOpen"
      @closeAddCreneau="isModalAddCreneauOpen = false"
    />
    <FullCalendar ref="fullCalendar" :options="calendarOptions">
      <template #eventContent="arg">
        <div class="flex h-full items-center">
          <div class="h-full w-2 rounded-l-xl bg-red-500"></div>
          <div class="flex grow flex-col pl-3 text-xs text-black">
            <span class="">
              {{ $dayjs(arg.event.start).format('H:mm') }} -
              {{ $dayjs(arg.event.end).format('H:mm') }}
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
import PlanningNavigation from '@components/faPlanning/navigation.vue' // PlanningNavigation as navigation is an html reserved tag
import addCreneau from '@components/faPlanning/addCreneau.vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import frLocale from '@fullcalendar/core/locales/fr'
import { getActivites } from '@api/activite.js'
import { usePlanningStore } from '@stores/planning.js'
import { mapStores } from 'pinia'
import Modal from '@components/common/Modal.vue'

export default {
  components: {
    PlanningNavigation,
    addCreneau,
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
        select: this.select,
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
      isModalAddCreneauOpen: false,
      currentDateStart: '',
      currentDateEnd: '',
      currentWeek: '',
    }
  },
  computed: {
    ...mapStores(usePlanningStore),
  },
  async mounted() {
    this.calendarOptions.slotMinTime = this.planningStore.slotMinTime
    this.calendarOptions.slotMaxTime = this.planningStore.slotMaxTime
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
      this.currentWeek = this.getWeekNumber(dateInfo.start)
      this.currentDateStart = this.$dayjs(dateInfo.start).format('D MMMM')
      this.currentDateEnd = this.$dayjs(dateInfo.end - 1).format('D MMMM YYYY')
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
    eventClick(eventClickInfo) {
      this.planningStore.setSelectedDate(eventClickInfo.event)
      this.isModalAddCreneauOpen = true
    },
    select(selectionInfo) {
      this.planningStore.setSelectedDate(selectionInfo)
      this.isModalAddCreneauOpen = true
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
