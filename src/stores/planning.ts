import { defineStore } from 'pinia'
import { getPlanning } from '@api/planning'
import dayjs from 'dayjs'
import { getActivites } from '@api/activite'
import { default_planning, parseCreneauToEvent } from '../services/planning/planning_service'
import { Calendar, type CalendarOptions, type EventSourceInput } from '@fullcalendar/core'
import type { EventImpl } from '@fullcalendar/core/internal'

export const usePlanningStore = defineStore('planning', {
  state: () => (default_planning),
  getters: {
    isZoneActive(state) {
      return (id: number) => {
        return state.filters.zone.includes(id)
      }
    },
    getNumberActiveZone(state) {
      const nbZone = state.filters.zone.length
      return nbZone === 0 ? '' : `(${nbZone})`
    },
    getActiveZones(state) {
      return state.filters.zone
    },
    getCurrentDateStart(state) {
      return dayjs(state.currentDateStart).format('D MMMM')
    },
    getCurrentDateEnd(state) {
      return dayjs(state.currentDateEnd - 1).format('D MMMM YYYY')
    },
    getDebutOfWeek(state) {
      const firstDayOfWeek = new Date(
        state.currentDateStart.setDate(
          state.currentDateStart.getDate() -
            ((state.currentDateStart.getDay() + 6) % 7)
        )
      )
      firstDayOfWeek.setHours(0, 0, 0, 0)
      return Math.floor(firstDayOfWeek.getTime() / 1000)
    },
    getDebutOfDay(): number {
      const date: Date = new Date(this.currentDateStart)
      date.setHours(0, 0, 0, 0)
      return Math.floor(date.getTime() / 1000)
    },
    getActivites(state) {
      return state.activites
    },
    getCreneauxEvents(state): CalendarEvent[] {
      return state.creneaux.map(creneau => parseCreneauToEvent(creneau));
    }
  },
  actions: {
    async fetch() {
      const debut = this.currentViewName === 'day' ? this.getDebutOfWeek : this.getDebutOfDay

      const response = await getPlanning(
        debut,
        this.filters.fit_arena,
        this.filters.duree,
        this.filters.zone.join(',')
      )
      this.pushCreneaux(response.creneaux)
    },
    async fetchActivites(id: number) {
      this.activites = await getActivites(id)
    },
    async updateActivites() {
      const activites = new Map()
      const creneaux: Creneau[] = []
      Object.assign(creneaux, this.creneaux)
      creneaux.forEach(function (creneau) {
        creneau.activites.forEach((activite) => {
          activites.set(activite.activiteId, { ...activite, title: activite.libelle })
        })
      })
      const arr = Array.from(activites, function (entry) {
        return entry[1]
      })
      this.activites = arr
    },
    pushCreneaux(creneaux: Creneau[]) {
      this.creneaux = creneaux;
    },
    addCreneaux(creneaux: Creneau[]) {
      for (const creneau of creneaux) {
        if (!this.updateExisting(creneau)) {
          this.creneaux.push(creneau)
        }
      }
    },
    removeCreneau(id: number) {
      for(let i = 0; i < this.creneaux.length; i++) {
        if(this.creneaux[i].id == id) {
          this.creneaux.splice(i, 1);
        }
      }
    },
    updateExisting(creneau: Creneau) {
      for (const index in this.creneaux) {
        if (this.creneaux[index].id == creneau.id) {
          this.creneaux[index] = creneau
          return true
        }
      }
      return false
    },
    selectZone(newZone: number) {
      this.filters.zone = [newZone]
    },
    toggleZone(newZone: number) {
      if (this.filters.zone.includes(newZone)) {
        this.filters.zone.splice(this.filters.zone.indexOf(newZone), 1)
      } else {
        this.filters.zone.push(newZone)
      }
    },
    setDebut() {
      this.filters.debut =
        this.currentViewName === 'week'
          ? this.getDebutOfWeek
          : this.getDebutOfDay
    },
  },
})
