import { defineStore } from 'pinia'
import {
  getPlanning,
  postCreneau,
  updateCreneau,
  deleteCreneau,
} from '@api/planning.js'
import dayjs from 'dayjs'

export const usePlanningStore = defineStore('planning', {
  state: () => ({
    creneaux: [],
    filter: {
      zone: [],
    },
    selectedCreneau: {
      date: '',
      day: '',
      title: '',
      start: {
        minute: 0,
        hour: 0,
      },
      end: {
        minute: 0,
        hour: 0,
      },
    },
    currentTitle: '',
    currentViewName: 'week',
    slotMinTime: '07:00:00',
    slotMaxTime: '22:00:00',
    timeSeparator: ':',
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
    getSelectedFormatedStart(state) {
      return (
        state.selectedCreneau.start.hour +
        state.timeSeparator +
        state.selectedCreneau.start.minute
      )
    },
    getSelectedFormatedEnd(state) {
      return (
        state.selectedCreneau.end.hour +
        state.timeSeparator +
        state.selectedCreneau.end.minute
      )
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
    setSelectedCreneau(info) {
      this.selectedCreneau.title = info.title
      this.selectedCreneau.date = info.start
      this.selectedCreneau.day = dayjs(info.start).format('DD / MM / YYYY')
      this.selectedCreneau.start.hour = dayjs(info.start).format('H')
      this.selectedCreneau.start.minute = dayjs(info.start).format('mm')
      this.selectedCreneau.end.hour = dayjs(info.end).format('H')
      this.selectedCreneau.end.minute = dayjs(info.end).format('mm')
    },
    async addCreneau(creneau) {
      // query
      await postCreneau(creneau)
      this.creneaux.push(creneau)
    },
    async editCreneau(id, creneau) {
      console.log(id, creneau)
      const resp = await updateCreneau(id, creneau)
      console.log(resp)
      // const index = this.creneaux.findIndex(
      //   (oldCreneau) => oldCreneau.id === creneau.id
      // )
      // if (index) {
      //   this.creneaux[index] = creneau
      // } else {
      //   console.log('no creneau to edit')
      // }
    },
    async dropCreneau(creneau) {
      // query
      await deleteCreneau(creneau)
      const index = this.creneaux.findIndex(
        (oldCreneau) => oldCreneau.id === creneau.id
      )
      if (index) {
        this.creneaux.splice(index, 1)
      } else {
        console.log('no creneau to delete')
      }
    },
  },
})
