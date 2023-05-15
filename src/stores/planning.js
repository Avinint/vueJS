import { defineStore } from 'pinia'
import { getPlanning } from '@api/planning.js'
import dayjs from 'dayjs'
import { getActivites } from '@api/activite.js'

export const usePlanningStore = defineStore('planning', {
  state: () => ({
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
      return state.activites;
    }
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
    async fetchActivites(id) {
      const activites = await getActivites(id)
      // do not use map with vue3 var (Proxy type), it wont work, use forEach instead
      activites.forEach(function (activite) {
        activite.title = activite.libelle
      })

      this.activites = activites;
    },
    async updateActivites() {
      const activites = new Map();
      const creneaux = [];
      Object.assign(creneaux, this.creneaux);
      creneaux.forEach(function (creneau) {
        creneau.activites.forEach((activite) => {
          activites.set(activite.id, { ...activite, title: activite.libelle });
        })
      })
      const arr = Array.from(activites, function (entry) {
        return entry[1];
      });
      this.activites = arr;
    },
    pushCreneaux(creneaux) {
      const created_creneaux = creneaux.map((creneau) => {
        creneau.start = creneau.dateDebut
        creneau.end = creneau.dateSortie
        creneau.title = creneau.titre
        creneau.idCreneau = creneau.id
        creneau.resourceIds = creneau.activites.map((activite) => activite.id)
        return creneau
      });
      this.creneaux = this.creneaux.concat(created_creneaux);
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
