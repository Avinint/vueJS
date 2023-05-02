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
      return dayjs(state.currentDateStart).format('D MMMM')
    },
    getCurrentDateEnd(state) {
      return dayjs(state.currentDateEnd - 1).format('D MMMM YYYY')
    },
  },
  actions: {
    async fetch() {
      const response = await getPlanning(
        this.filters.debut,
        this.filters.fit_arena,
        this.filters.duree,
        this.filters.zone.join(',')
      )
      this.pushCreneaux(response.creneaux)
    },
    pushCreneaux(creneaux) {
      this.creneaux = creneaux.map((creneau) => {
        creneau.start = creneau.dateDebut
        creneau.end = creneau.dateSortie
        creneau.title = creneau.titre
        creneau.idCreneau = creneau.id
        creneau.resourceIds = creneau.activites.map((activite) => activite.id)
        return creneau
      })
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
