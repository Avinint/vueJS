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
  // (TODO FITE2D-2853): Load data from WS instead of static mock
  demandes: [
    {
      id: 0,
      creneauType: 0,
      type: 0,
      activites: [],
      titre: 'test',
      date: '2023-07-25T01:00:00.000+02:00',
      heureDebut: '2023-07-25T01:00:00.000+02:00', // "14:30:00"
      heureFin: '2023-07-25T03:00:00.000+02:00', // "14:30:00"
      dateSortie: '',
      dateDebut: '',
      dateFinCreneau: '',
      zones: [],
      dureeActivite: 55, // 55
      dureeInterCreneau: 5,
      description: '',
      organisme: 0,
      animateurLabellise: 0,
      niveauPratique: 0,
      tarifHoraire: 0,
      nbParticipants: 0,
      mode: null,
      seances: [],
    },
    {
      id: 1,
      creneauType: 0,
      type: 0,
      activites: [],
      titre: 'test',
      date: '2023-07-25T01:00:00.000+02:00',
      heureDebut: '2023-07-25T02:00:00.000+02:00', // "14:30:00"
      heureFin: '2023-07-25T04:00:00.000+02:00', // "14:30:00"
      dateSortie: '',
      dateDebut: '',
      dateFinCreneau: '',
      zones: [],
      dureeActivite: 55, // 55
      dureeInterCreneau: 5,
      description: '',
      organisme: 0,
      animateurLabellise: 0,
      niveauPratique: 0,
      tarifHoraire: 0,
      nbParticipants: 0,
      mode: null,
      seances: [],
    },
  ],
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
  slotMinTime: '07:00',
  slotMaxTime: '22:00',
}

export function parseCreneauToEvent(creneau: Creneau): CalendarEvent {
  return {
    id: creneau.id ?? 0,
    start: creneau.dateDebut,
    end: creneau.dateSortie,
    title: creneau.titre,
    resourceIds: creneau.zones,
    overlap: true,
    extendedProps: { ...creneau, event_type: EventType.CRENEAU },
  }
}

export function parseDemandeToEvent(demande: Creneau): CalendarEvent {
  return {
    id: demande.id ?? 0,
    start: demande.heureDebut,
    end: demande.heureFin,
    title: demande.titre,
    resourceIds: [],
    classNames: ['fc-event-demande'],
    overlap: true,
    editable: false,
    selectable: false,
    extendedProps: { ...demande, event_type: EventType.DEMANDE },
  }
}

export const planning_configuration: CalendarOptions = {
  plugins: [dayGridPlugin, timeGridPlugin, resourceTimeGridPlugin],
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
