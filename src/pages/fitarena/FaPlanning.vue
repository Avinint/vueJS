<template>
  <div class="fa-planning">
    <EditOptions ref="edit_options" @on-edit-single="editSingle" @on-edit-multiple="editRecurence" />
    <PlanningNavigation
      class="mb-6"
      :calendar-api="calendarApi"
      @filter-updated="applyFilter"
      @after-fetch="redraw_key++"
    />
    <modalCreneau
      v-if="isModalCreneauOpen"
      :is-open="isModalCreneauOpen"
      :type-action="actionType"
      @close-modal-creneau="closeModal"
    />
    <ModalDetailDemande ref="modal_demande"/>
    <div
      class="space-y-3 p-4"
    >
      <FullCalendar ref="fullCalendar" :options="calendarOptions">
        <template #eventContent="arg">
          <Event
            v-if="arg.event.extendedProps.event_type == 0"
            :event="arg.event"
          />
          <EventDemande
            v-else-if="arg.event.extendedProps.event_type == 1"
            :event="arg.event"
            :key="redraw_key"
          />
        </template>
      </FullCalendar>
    </div>
  </div>
</template>

<script>
import PlanningNavigation from '@components/faPlanning/navigation.vue' // PlanningNavigation as navigation is an html reserved tag
import modalCreneau from '@components/faPlanning/modalCreneau.vue'
import EditOptions from '@components/faPlanning/EditOptions.vue'
import Event from '@components/faPlanning/Event.vue'
import EventDemande from '@components/faPlanning/EventDemande.vue'

import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import frLocale from '@fullcalendar/core/locales/fr'
import { usePlanningStore } from '@stores/planning.ts'
import { useCreneauStore } from '@stores/creneau.ts'
import { useTypeCreneauStore } from '@stores/typeCreneau.js'
import { getZones } from '@api/zone.js'
import ModalDetailDemande from '@components/faPlanning/ModalDetailDemande.vue'
import { mapStores } from 'pinia'

export default {
  components: {
    PlanningNavigation,
    modalCreneau,
    FullCalendar,
    EditOptions,
    Event,
    EventDemande,
    ModalDetailDemande
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
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        slotEventOverlap: true,
        weekends: true,
        datesSet: this.refreshDates,
        eventClick: this.eventClick,
        eventResize: this.eventResizeOrDrag,
        eventDrop: this.eventResizeOrDrag,
        editable: false,
        select: this.select,
        dayHeaderFormat: { weekday: 'long', day: 'numeric', month: 'long' },
        nowIndicator: true,
        eventDisplay: 'block',
        events: [],
        resources: [],
        allDaySlot: false,
        eventOverlap: true,
        selectOverlap: true,
        height: '80vh',
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
      redraw_key: 0
    }
  },
  watch: {
    async idFitArena(idActuel, avant) {
      if (idActuel !== avant) {
        await this.initZones();
      }
    }
  },
  computed: {
    ...mapStores(usePlanningStore),
    ...mapStores(useCreneauStore),
    ...mapStores(useTypeCreneauStore),
    idFitArena() {
      return this.$route.params.id
    }
  },
  async created() {
    this.calendarOptions.slotMinTime = this.planningStore.slotMinTime
    this.calendarOptions.slotMaxTime = this.planningStore.slotMaxTime
    // sync events from store/api
    this.$watch(
      () => this.planningStore.getCreneauxEvents,
      (newCreneaux) => {
        this.calendarOptions.events = newCreneaux
        this.redraw_key++
      }
    )
  },
  async mounted() {
    this.calendarApi = this.$refs.fullCalendar.getApi()
    await this.initZones();
    await this.typeCreneauStore.fetchTypeCreneaux()
    this.calendarOptions.scrollTime = this.planningStore.scrollTime
  },
  methods: {
    async initZones () {
      this.zones = await getZones({ page: 1, 'typeZone.code': 'zone', fitArena: this.$route.params.id })
      this.calendarOptions.resources = [
        { id: this.zones[0].id, title: this.zones[0].libelle },
      ]
    },
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
      if (eventClickInfo.event.extendedProps.recurrence)
        this.$refs.edit_options.open();
      else {
        this.creneauStore.recurrence = undefined;
        this.isModalCreneauOpen = true;
      }
    },
    editSingle() {
      this.creneauStore.recurrence = undefined;
      this.isModalCreneauOpen = true;
    },
    editRecurence() {
      this.isModalCreneauOpen = true
      if (eventClickInfo.event.extendedProps.event_type == 0) {
        this.actionType = 'edit'
        this.setSelectedCreneau(eventClickInfo.event)
        this.isModalCreneauOpen = true
      }

      if(eventClickInfo.event.extendedProps.event_type == 1) {
        this.$refs.modal_demande.setDemande(eventClickInfo.event.extendedProps);
        this.$refs.modal_demande.open(); 
      }
    },
    select(selectionInfo) {
      this.actionType = 'create'
      this.creneauStore.setDefault()
      this.setSelectedCreneau(selectionInfo)
      this.isModalCreneauOpen = true
    },
    eventResizeOrDrag(info) {
      this.creneauStore.editCreneau(info.event)
      this.redraw_key++
    },
    setSelectedCreneau(fullCalendarCreneau) {
      this.creneauStore.setCreneau(fullCalendarCreneau)
    },
    getWeekNumber(date) {
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

tr {
  height: 5vh;
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

  .fc-timegrid-slot-minor {
    border-top-style: none;
  }
}

.fc-direction-ltr .fc-timegrid-col-events {
  margin: 0;
}
</style>
