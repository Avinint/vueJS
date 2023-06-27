import type { Calendar, CalendarOptions, EventSourceInput } from '@fullcalendar/core/index.js'
import type { EventImpl } from '@fullcalendar/core/internal.js'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import frLocale from '@fullcalendar/core/locales/fr'

export const default_planning: Planning = {
  creneaux: [],
  filters: {
    debut: 0,
    fit_arena: 0,
    duree: 0,
    zone: [],
  },
  activites: [],
  currentViewName: 'week',
  currentDateStart: {},
  currentDateEnd: {},
  currentWeek: 0,
  slotMinTime: '00:00',
  slotMaxTime: '23:59',
}

export function parseCreneauToEvent(creneau: Creneau): CalendarEvent {
  return {
    id: creneau.id ?? 0,
    start: creneau.dateDebut,
    end: creneau.dateSortie,
    title: creneau.titre,
    resourceIds: creneau.zones,
    extendedProps: creneau,
  }
}

export const planning_configuration: CalendarOptions = {
  plugins: [
    dayGridPlugin,
    timeGridPlugin,
    resourceTimeGridPlugin,
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
}
