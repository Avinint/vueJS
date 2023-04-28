import { defineStore } from 'pinia'
import { getPlanning } from '@api/planning.js'

export const usePlanningStore = defineStore('planning', {
  state: () => ({
    creneaux: [],
    filter: {
      zone: [],
    },
    currentViewName: 'week',
    slotMinTime: '07:00:00',
    slotMaxTime: '22:00:00',
  }),
  getters: {
    isZoneActive(state) {
      return (id) => {
        return state.filter.zone.includes(id)
      }
    },
    getNumberActiveZone(state) {
      const nbZone = state.filter.zone.length
      return nbZone === 0 ? '' : `(${nbZone})`
    },
  },
  actions: {
    async fetch() {
      const response = await getPlanning()
      this.creneaux = response.creneaux.map((creneau) => {
        creneau.start = creneau.dateDebut
        creneau.end = creneau.dateSortie
        creneau.title = creneau.titre
        creneau.idCreneau = creneau.id
        return creneau
      })
    },
    selectZone(newZone) {
      this.filter.zone = [newZone]
    },
    toggleZone(newZone) {
      if (this.filter.zone.includes(newZone)) {
        this.filter.zone.splice(this.filter.zone.indexOf(newZone), 1)
      } else {
        this.filter.zone.push(newZone)
      }
    },
    applyFilter() {
      // console.log('apply filters')
    },
  },
})
