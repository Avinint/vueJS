import { defineStore } from 'pinia'
import { getPlanning } from '@api/planning.js'
import dayjs from 'dayjs'

export const usePlanningStore = defineStore('planning', {
  state: () => ({
    creneaux: [],
    filters: {
      debut: 0,
      fit_arena: 0,
      duree: 0,
      zone: [],
    },
    currentViewName: 'week',
    currentDateStart: {},
    currentDateEnd: {},
    currentWeek: 0,
    slotMinTime: '07:00',
    slotMaxTime: '22:00',
  }),
  getters: {
    isZoneActive(state) {
      return (id) => {
        return state.filters.zone.includes(id)
      }
    },
    getNumberActiveZone(state) {
      const nbZone = state.filters.zone.length
      return nbZone === 0 ? '' : `(${nbZone})`
    },
    getCurrentDateStart(state) {
      return dayjs(state.currentDateStart).format('D MMM')
    },
    getCurrentDateEnd(state) {
      return dayjs(state.currentDateEnd - 1).format('D MMM YYYY')
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
    pushCreneaux(newCreneaux) {
      newCreneaux.forEach((newCreneau) => {
        newCreneau.start = newCreneau.dateDebut
        newCreneau.end = newCreneau.dateSortie
        newCreneau.title = newCreneau.titre
        newCreneau.idnewCreneau = newCreneau.id
        newCreneau.resourceIds = newCreneau.zones
        return newCreneau
      })
      this.creneaux = [...this.creneaux, ...newCreneaux]
    },
    updateCreneaux(newCreneau) {
      newCreneau.start = newCreneau.dateDebut
      newCreneau.end = newCreneau.dateSortie
      newCreneau.title = newCreneau.titre
      newCreneau.idnewCreneau = newCreneau.id
      newCreneau.resourceIds = newCreneau.zones
      const index = this.creneaux.findIndex(
          (creneau) => creneau.id === newCreneau.idnewCreneau
      )
      this.creneaux.splice(index, 1)
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
