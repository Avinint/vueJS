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
      @closeModalCreneau="isModalCreneauOpen = false"
    />
    <FullCalendar ref="fullCalendar" :options="calendarOptions">
      <template #eventContent="arg">
        <div class="flex h-full items-center">
          <div class="h-full w-2 rounded-l-xl bg-red-600"></div>
          <div class="flex grow justify-between px-3 pr-3 text-xs text-black">
            <span class="flex flex-col">
              <span>
                {{ $dayjs(arg.event.start).format('H:mm') }} -
                {{ $dayjs(arg.event.end).format('H:mm') }}
              </span>
              <span class="">{{ arg.event.title }}</span>
            </span>
            <span
              v-if="arg.event.extendedProps.activites"
              class="fill-red-600"
              v-html="ICON[arg.event.extendedProps.activites[0].libelle]"
            ></span>
          </div>
        </div>
      </template>
    </FullCalendar>
  </div>
</template>

<script lang="ts">
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
import { mapStores } from 'pinia'
import Modal from '@components/common/Modal.vue'

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
      isModalCreneauOpen: false,
      currentDateStart: '',
      currentDateEnd: '',
      currentWeek: '',
      actionType: '',
      ICON: {
        Football:
          '<svg width="30" height="30" xmlns="http://www.w3.org/2000/svg"><path d="M14.58 29.994a15.004 15.004 0 0 1-11.319-5.658A14.991 14.991 0 0 1 .085 13.415 15.001 15.001 0 0 1 11.425.435a14.91 14.91 0 0 1 4.99-.365 15.06 15.06 0 0 1 4.765 1.266c.263.118.84.408 1.085.545a14.992 14.992 0 0 1 3.991 3.209 15.007 15.007 0 0 1 3.588 12.055A15.008 15.008 0 0 1 17.94 29.709l-.242.045c-.573.108-1.23.185-1.928.226-.176.01-1.012.02-1.19.014zm.8-1.274a13.413 13.413 0 0 0 2.136-.23c.015-.006.064-.107.194-.402a995.498 995.498 0 0 0 2.252-5.128c.001-.008-.441-.608-.982-1.333l-.984-1.317-3.35.002-3.35.003-.988 1.32a76.447 76.447 0 0 0-.985 1.332c.001.007.53 1.214 1.177 2.683l1.175 2.67.165.04a13.606 13.606 0 0 0 3.54.36zm4.41-.86a13.768 13.768 0 0 0 5.935-4.305c.093-.116.345-.449.342-.451l-.592.077-2.515.335c-1.059.14-1.928.259-1.932.262-.004.005-1.859 4.211-1.895 4.3-.005.013.395-.12.657-.218zm-9.773-.082c-.012-.03-1.76-4.003-1.761-4.005a6193.528 6193.528 0 0 1-3.9-.521 11.336 11.336 0 0 0-.364-.046c-.002.001.046.067.107.146a13.733 13.733 0 0 0 5.611 4.317c.31.128.316.13.307.108zm-.777-6.883c.628-.842 1.15-1.538 1.159-1.548.016-.017.022-.014.116.057.055.041.101.072.102.068.003-.007-1.823-5.631-1.83-5.638a20813.433 20813.433 0 0 1-2.726-1.118c-.548-.225-.554-.227-.575-.208l-.451.398-3.203 2.832c-.407.36-.512.458-.512.477a13.659 13.659 0 0 0 1.37 4.87c.13.264.339.658.358.677.004.004.333.05.732.103l2.515.334c.985.13 1.793.235 1.796.232.004-.003.52-.695 1.149-1.536Zm14.77 1.17c1.47-.195 2.675-.353 2.678-.35.002.002.015.087.03.19l.025.186.082-.139a13.751 13.751 0 0 0 1.86-6.03 9.126 9.126 0 0 0-.224.249c-.196.22-.224.249-.239.237-.015-.012-4.006-3.538-4.296-3.796a.662.662 0 0 0-.155-.119c-.018.005-3.274 1.338-3.28 1.342-.004.005-1.841 5.658-1.838 5.661.001.001.053-.036.116-.083a.464.464 0 0 1 .12-.076c.005.004.529.704 1.164 1.554l1.156 1.546.063-.009 2.737-.363zm-5.704-5.715c.475-1.46.863-2.662.863-2.67 0-.008-.131-.11-.292-.226l-1.487-1.08a27531.465 27531.465 0 0 0-2.722-1.977l-.027-.02-.268.195a745.59 745.59 0 0 0-4.267 3.107c.004.018 1.727 5.317 1.73 5.324.003.004 1.266.006 2.806.005l2.802-.003Zm10.405-1.715a13.755 13.755 0 0 0-1.103-5.04c-.12-.277-.181-.408-.344-.735a13.31 13.31 0 0 0-1.042-1.75c-.166-.236-.437-.591-.441-.578-.003.007-.221 1.163-.486 2.568l-.482 2.555.04.04a5638.718 5638.718 0 0 1 3.326 2.943l.536.474.003-.064a10.9 10.9 0 0 0-.007-.413zm-25.806-1.58c.858-.758 1.562-1.38 1.564-1.38.004-.004-.806-4.325-.818-4.364-.006-.021-.021-.002-.127.16a13.755 13.755 0 0 0-2.244 6.953v.07l.033-.03c.017-.018.734-.651 1.592-1.41zm7.23-1.01 2.258-1.64 1.446-1.05V7.239l.001-2.117-2.238-1.31A248.207 248.207 0 0 0 9.349 2.5c-.02 0-.293.129-.558.263a13.674 13.674 0 0 0-2.726 1.822 14.97 14.97 0 0 0-1.318 1.291l-.037.042.495 2.623.498 2.625a1590.838 1590.838 0 0 0 3.367 1.38c.124.051.232.092.24.09.008-.002.38-.268.826-.592zm10.939.148 1.8-.737.71-.291.528-2.799c.29-1.54.53-2.8.532-2.803.002-.003.086.01.185.03.1.018.181.032.181.03 0-.014-.364-.382-.554-.56-.35-.331-.558-.514-.876-.769a13.788 13.788 0 0 0-3.402-2.003.486.486 0 0 0-.098-.034c0 .003.013.029.03.057l.03.052-2.343 1.374L15.3 5.205l-.155.092-.002 1.919-.002 1.919 2.412 1.752c1.327.964 2.416 1.752 2.42 1.753.006 0 .5-.201 1.1-.447zM16.629 2.92a137.503 137.503 0 0 0 1.963-1.162 13.48 13.48 0 0 0-3.266-.477 13.662 13.662 0 0 0-4.126.533c-.247.071-.285.084-.277.092.022.022 3.706 2.173 3.719 2.171.009-.001.903-.522 1.987-1.157Z"/></svg>',
      },
    }
  },
  computed: {
    ...mapStores(usePlanningStore),
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
      // map cause error (operator 'in' problem), use forEach
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
      this.planningStore.setSelectedCreneau(eventClickInfo.event)
      this.actionType = 'edit'
      this.isModalCreneauOpen = true
    },
    select(selectionInfo) {
      this.planningStore.setSelectedCreneau(selectionInfo)
      this.actionType = 'create'
      this.isModalCreneauOpen = true
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
