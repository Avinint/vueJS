import type { Calendar, EventSourceInput } from "@fullcalendar/core/index.js";
import type { EventImpl } from "@fullcalendar/core/internal.js";

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
    extendedProps: creneau
  }
}