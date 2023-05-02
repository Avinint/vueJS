<template>
  <div class="fa-planning">
    <PlanningNavigation
      :calendar-api="calendarApi"
      :current-date-start="currentDateStart"
      :current-date-end="currentDateEnd"
      :current-week="currentWeek"
      @filter-updated="planningStore.applyFilter"
    />
    <modalCreneau
      v-if="isModalCreneauOpen"
      :is-open="isModalCreneauOpen"
      :type-action="actionType"
      @close-modal-creneau="isModalCreneauOpen = false"
    />
    <FullCalendar ref="fullCalendar" :options="calendarOptions">
      <template #eventContent="arg">
        <div class="flex h-full items-center">
          <div class="h-full w-2 rounded-l-xl bg-red-600"></div>
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
                v-html="ICON[arg.event.extendedProps.activites[0].libelle]"
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
import { getActivites } from '@api/activite.js'
import { usePlanningStore } from '@stores/planning.js'
import { useCreneauStore } from '@stores/creneau.js'
import { mapStores } from 'pinia'

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
      currentDateStart: '',
      currentDateEnd: '',
      currentWeek: '',
      actionType: '',
    }
  },
  computed: {
    ...mapStores(usePlanningStore),
    ...mapStores(useCreneauStore),
  },
  async mounted() {
    this.calendarApi = this.$refs.fullCalendar.getApi()
    this.setRessources()
    await this.planningStore.fetch()
    this.calendarOptions.events = this.planningStore.creneaux
    this.calendarOptions.slotMinTime = this.planningStore.slotMinTime
    this.calendarOptions.slotMaxTime = this.planningStore.slotMaxTime
  },
  methods: {
    async setRessources() {
      const activites = await getActivites(this.$route.params.id)
      // do not use map with vue3 var (type Proxy), it wont work, use forEach instead
      activites.forEach(function (activite) {
        activite.title = activite.libelle
      })
      this.calendarOptions.resources = activites
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
      this.setSelectedCreneau(eventClickInfo.event)
      this.actionType = 'edit'
      this.isModalCreneauOpen = true
    },
    select(selectionInfo) {
      this.setSelectedCreneau(selectionInfo)
      this.actionType = 'create'
      this.isModalCreneauOpen = true
    },
    eventResizeOrDrag(info) {
      this.creneauStore.editCreneau(info.event)
    },
    setSelectedCreneau(fullCalendarCreneau) {
      this.creneauStore.date = this.$dayjs(fullCalendarCreneau.start).format(
        'YYYY-MM-DD'
      ) // 2023-01-23
      this.creneauStore.heureDebut = this.$dayjs(
        fullCalendarCreneau.start
      ).format('HH:mm') // "14:30:00"
      this.creneauStore.heureFin = this.$dayjs(fullCalendarCreneau.end).format(
        'HH:mm'
      ) // "14:30:00"

      // if there's already some data in the 'creneau' :
      if (fullCalendarCreneau.extendedProps) {
        this.creneauStore.creneauType = fullCalendarCreneau.extendedProps.type
        this.creneauStore.zoneId = fullCalendarCreneau.extendedProps.zones[0]
        this.creneauStore.activites =
          fullCalendarCreneau.extendedProps.activites
        this.creneauStore.titre = fullCalendarCreneau.extendedProps.titre
        this.creneauStore.dureeActivite =
          fullCalendarCreneau.extendedProps.dureeActivite // 55
        this.creneauStore.dureeInterCreneau =
          fullCalendarCreneau.extendedProps.dureeInterCreneau // 5
      }
    },
  },
}
</script>

<style lang="scss">
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
