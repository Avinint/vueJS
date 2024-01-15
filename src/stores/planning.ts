import { defineStore } from 'pinia'
import { getPlanning } from '@api/planning'
import dayjs from 'dayjs'
import { getActivites } from '@api/activite'
import { useUserStore } from './user'

import {
  EventType,
  default_planning,
  parseCreneauToEvent,
  parseDemandeToEvent,
  parseCreneauAnonymeToEvent
} from '../services/planning/planning_service'

export const usePlanningStore = defineStore('planning', {
  state: () => default_planning,
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
      return dayjs(state.currentDateStart).format('YYYY-MM-DD')
    },
    getCurrentDateEnd(state) {
      return dayjs(state.currentDateEnd - 1).format('YYYY-MM-DD')
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
      const creneaux = state.creneaux.map((creneau) =>
        parseCreneauToEvent(creneau)
      )

      const demandes = state.demandes.map((demande) => 
        parseDemandeToEvent(demande)
      )

      return creneaux.concat(demandes)
    },
    getCreneauxOrganismesEvents(state): CalendarEvent[] {
      const creneaux = state.creneaux.map((creneau) =>
        parseCreneauToEvent(creneau)
      )
      
      const creneauxAnonymes = state.creneauxAnonymes.map((ca) => 
        parseCreneauAnonymeToEvent(ca)
      )

      const output = creneaux.concat(creneauxAnonymes)
      return output
    },
    getCreneauxAnonymesOrganismesEvents(state): CalendarEventAnonyme[] {
      const output: CalendarEventAnonyme[] = []
      for (const creneauAnonyme of state.creneauxAnonymes) {
        output.push(parseCreneauAnonymeToEvent(creneauAnonyme))
      }
      return output
    },
    getOrganismeEvents(state) {
      return state.idOrganisme
    },
  },
  actions: {
    async fetch() {
      const debut =
        this.currentViewName === 'week'
          ? this.getDebutOfWeek
          : this.getDebutOfDay

      const date_debut = new Date(debut * 1000);
      const response = await getPlanning(
        date_debut.toISOString(),
        this.filters.fit_arena,
        this.filters.duree,
        this.filters.zone.join(','),
        this.filters.organisme
      )

      console.log(response.creneaux)
      this.pushCreneaux(response.creneaux)
      this.pushCreneauxAnonymes(response.creneauxAnonymes)
    },
    async fetchPlanningOrganisme(organisme_id: number) {
      const debut =
        this.currentViewName === 'week'
          ? this.getDebutOfWeek
          : this.getDebutOfDay

      const date_debut = new Date(debut * 1000);
      const response = await getPlanning(
        date_debut.toISOString(),
        this.filters.fit_arena,
        this.filters.duree,
        this.filters.zone.join(','),
        organisme_id
      )
      this.pushCreneaux(response.creneaux)
      this.pushCreneauxAnonymes(response.creneauxAnonymes)
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
          activites.set(activite.activiteId, {
            ...activite,
            title: activite.libelle,
          })
        })
      })
      const arr = Array.from(activites, function (entry) {
        return entry[1]
      })
      this.activites = arr
    },
    pushCreneaux(creneauxTemp: Creneau[]) {
      const user = useUserStore()
      
      if (user.isAdmin || user.isGestCo) {
        // SI JE SUIS ADMIN OU GESTCOL
        // J'AI DES DEMANDES ET DES CRÉNEAUX VALIDÉS
        this.demandes = creneauxTemp
          .filter(creneau => creneau.statut === 'demande')

        this.creneaux = creneauxTemp
          .filter(creneau => !this.demandes.some((dem) => dem.id === creneau.id))
      } else if (user.isGestOrg) {
        // SI JE SUIS GESTORG
        // J'AI SEULEMENT DES CRÉNEAUX EN STATUT DEMANDE
        this.creneaux = creneauxTemp
      }
    },
    pushCreneauxAnonymes(creneaux: CreneauAnonyme[]) {
      this.creneauxAnonymes = creneaux
    },
    addCreneaux(creneaux: Creneau[]) {
      for (const creneau of creneaux) {
        if (!this.updateExisting(creneau)) {
          this.creneaux.push(creneau)
        }
      }
    },
    removeCreneau(id: number) {
      for (let i = 0; i < this.creneaux.length; i++) {
        if (this.creneaux[i].id == id) {
          this.creneaux.splice(i, 1)
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
    }
  }
})
