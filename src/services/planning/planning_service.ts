import type {
  Calendar,
  CalendarOptions,
  EventSourceInput,
} from '@fullcalendar/core/index.js'
import type { EventImpl } from '@fullcalendar/core/internal.js'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import frLocale from '@fullcalendar/core/locales/fr'

export enum EventType {
  CRENEAU,
  DEMANDE,
}

export const default_planning: Planning = {
  creneaux: [],
  creneauxAnonymes: [],
  // (TODO FITE2D-2853): Load data from WS instead of static mock
  demandes: [],
  filters: {
    debut: 0,
    fit_arena: 0,
    duree: 0,
    zone: [],
    organisme: 0,
  },
  activites: [],
  currentViewName: 'week',
  currentDateStart: {},
  currentDateEnd: {},
  currentWeek: 0,
  slotMinTime: '00:00',
  slotMaxTime: '24:00',
  scrollTime: '07:00'
}

export function parseCreneauToEvent(creneau: Creneau): CalendarEvent {
  const test = {
    id: creneau.id ?? 0,
    start: creneau.dateDebut,
    end: creneau.dateSortie,
    title: creneau.titre,
    resourceIds: creneau.zones,
    overlap: true,
    extendedProps: { ...creneau, event_type: EventType.CRENEAU },
  }
  return test
}

export function parseCreneauAnonymeToEvent(creneau: CreneauAnonyme): CalendarEvent {
  return {
    id: creneau.id ?? creneau.dateDebut,
    start: creneau.dateDebut,
    end: creneau.dateSortie,
    title: '',
    resourceIds: creneau.zones,
    classNames: ['fc-event-anonyme'],
    overlap: true
  }
}

export function parseDemandeToEvent(demande: Creneau): CalendarEvent {
  const test = {
    id: demande.id ?? 0,
    start: demande.dateDebut,
    end: demande.dateSortie,
    title: demande.titre,
    resourceIds: demande.zones,
    classNames: ['fc-event-demande'],
    overlap: true,
    extendedProps: { ...demande, event_type: EventType.CRENEAU },
  }
  return test
}

export const planning_configuration: CalendarOptions = {
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
  dayHeaderFormat: { weekday: 'long', day: 'numeric', month: 'long' },
  nowIndicator: true,
  eventDisplay: 'block',
  events: [],
  resources: [],
  allDaySlot: false,
  eventOverlap: false,
  selectOverlap: false,
  height: '80vh',
  scrollTime: '07:00',
  schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
  // timeZone: 'UTC', // TODO dayjs UTC local: https://dayjs.gitee.io/docs/en/parse/unix-timestamp
  slotLabelFormat: {
    hour: 'numeric',
    minute: '2-digit',
  },
}
