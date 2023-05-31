import { defineStore } from 'pinia'
import { getPlanning } from '@api/planning.js'
import * as dayjs from 'dayjs'
import { getActivites } from '@api/activite.js'
import { default_planning } from '../services/planning/planning_service'

export const usePlanningStore = defineStore('planning', {
  state: () => {
    return default_planning
  },
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
    getDebutOfDay() {
      const date = new Date(this.currentDateStart)
      date.setHours(0, 0, 0, 0)
      return Math.floor(date.getTime() / 1000)
    },
    getActivites(state) {
      return state.activites
    },
  },
  actions: {
    async fetch() {
      this.filters.debut =
        this.currentViewName === 'day'
          ? this.getDebutOfWeek
          : this.getDebutOfDay
      const response = await getPlanning(
        this.filters.debut,
        this.filters.fit_arena,
        this.filters.duree,
        this.filters.zone.join(',')
      )
      this.pushCreneaux(response.creneaux)
    },
    async fetchActivites(id: number) {
      const activites = await getActivites(id)
      // do not use map with vue3 var (Proxy type), it wont work, use forEach instead
      activites.forEach(function (activite) {
        activite.title = activite.libelle
      })

      this.activites = activites
    },
    async updateActivites() {
      const activites = new Map()
      const creneaux = []
      Object.assign(creneaux, this.creneaux)
      creneaux.forEach(function (creneau) {
        creneau.activites.forEach((activite) => {
          activites.set(activite.id, { ...activite, title: activite.libelle })
        })
      })
      const arr = Array.from(activites, function (entry) {
        return entry[1]
      })
      this.activites = arr
    },
    pushCreneaux(creneaux) {
      this.creneaux = creneaux.map((creneau) => {
        return this.normalize(creneau)
      })
    },
    normalize(creneau) {
      creneau.start = creneau.dateDebut
      creneau.end = creneau.dateSortie
      creneau.title = creneau.titre
      creneau.idCreneau = creneau.id
      creneau.resourceIds = creneau.zones;
      return creneau
    },
    addCreneaux(creneaux) {
      for (const creneau of creneaux) {
        if (!this.updateExisting(creneau)) {
          this.creneaux.push(this.normalize(creneau))
        }
      }
    },
    updateExisting(creneau) {
      for (const index in this.creneaux) {
        if (this.creneaux[index].id == creneau.id) {
          this.creneaux[index] = this.normalize(creneau)
          return true
        }
      }
      return false
    },
    selectZone(newZone) {
      this.filters.zone = [newZone]
    },
    toggleZone(newZone) {
      if (this.filters.zone.includes(newZone)) {
        this.filters.zone.splice(this.filters.zone.indexOf(newZone), 1)
      } else {
        this.filters.zone.push(newZone)
      }
    },
    setDebut() {
      this.filter.debut =
        this.currentViewName === 'week'
          ? this.getDebutOfWeek()
          : this.getDebutOfDay()
    },
  },
})
