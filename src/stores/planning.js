import { defineStore } from 'pinia'
import { defaultHeaders } from '@api/api.js'
import dayjs from 'dayjs'
import $fetch from '@api/refreshToken.js'

export const usePlanningStore = defineStore('planning', {
  state: () => ({
    creneauxFetched: [],
    creneaux: [],
    filter: {
      zone: [],
    },
    dateInfo: {},
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
    getStartDate(state) {
      return dayjs(state.dateInfo.start).format('D MMMM')
    },
    getEndDate(state) {
      return dayjs(state.dateInfo.end).format('D MMMM YYYY')
    },
    getCurrentWeek(state) {
      var d = new Date(state.dateInfo.start)
      d.setHours(0, 0, 0, 0)
      d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7))
      var week1 = new Date(d.getFullYear(), 0, 4)
      return (
        1 +
        Math.round(
          ((d.getTime() - week1.getTime()) / 86400000 -
            3 +
            ((week1.getDay() + 6) % 7)) /
            7
        )
      )
    },
  },
  actions: {
    async fetch(date = '1681077600', duree = 7, FA = 1) {
      // const test = await $fetch(
      //   `${
      //     import.meta.env.VITE_API_URL
      //   }/api/planning?date=${date}&duree=${duree}&FA=${FA}`,
      //   {
      //     method: 'get',
      //     headers: {
      //       ...defaultHeaders,
      //       'Content-Type': 'application/ld+json',
      //       Authorization: 'Bearer ' + localStorage.getItem('token'),
      //     },
      //   }
      // )
      // if (response.status !== 200) throw response
      // console.log(test)
      // return response.json()
      const response = {
        dateDebut: '"2023-04-19T00:00:00.000+00:00',
        dateFin: '"2023-04-19T00:00:00.000+00:00',
        creneaux: [
          {
            id: '',
            dateDebut: '2023-04-19T10:00:00.000+00:00',
            dateFinActivite: '2023-04-19T10:50:00.000+00:00',
            dateSortie: '2023-04-19T11:00:00.000+00:00',
            titre: 'Creneau 2',
            zones: [19, 21],
            activite: 1,
          },
          {
            id: '',
            dateDebut: '2023-04-18T10:00:00.000+00:00',
            dateFinActivite: '2023-04-18T13:50:00.000+00:00',
            dateSortie: '2023-04-18T12:00:00.000+00:00',
            titre: 'Creneau 42',
            zones: [21],
            activite: 2,
          },
          {
            id: '',
            dateDebut: '2023-04-18T13:00:00.000+00:00',
            dateFinActivite: '2023-04-18T13:50:00.000+00:00',
            dateSortie: '2023-04-18T14:00:00.000+00:00',
            titre: 'Creneau 4',
            zones: [21],
            activite: 2,
          },
          {
            id: '',
            dateDebut: '2023-04-18T09:00:00.000+00:00',
            dateFinActivite: '2023-04-18T13:50:00.000+00:00',
            dateSortie: '2023-04-18T14:00:00.000+00:00',
            titre: 'Creneau 4',
            zones: [21],
            activite: 1,
          },
          {
            id: '',
            dateDebut: '2023-04-19T13:00:00.000+00:00',
            dateFinActivite: '2023-04-19T13:50:00.000+00:00',
            dateSortie: '2023-04-19T14:00:00.000+00:00',
            titre: 'Creneau 5',
            zones: [39],
            activite: 5,
          },
          {
            id: '',
            dateDebut: '2023-04-18T13:00:00.000+00:00',
            dateFinActivite: '2023-04-18T13:50:00.000+00:00',
            dateSortie: '2023-04-18T14:00:00.000+00:00',
            titre: 'Creneau 5',
            zones: [39],
            activite: 5,
          },
          {
            id: '',
            dateDebut: '2023-04-20T13:00:00.000+00:00',
            dateFinActivite: '2023-04-20T13:50:00.000+00:00',
            dateSortie: '2023-04-20T14:00:00.000+00:00',
            titre: 'Creneau 6',
            zones: [39, 21],
            activite: 6,
          },
        ],
      }
      this.creneauxFetched = response.creneaux.map((creneau) => {
        creneau.start = creneau.dateDebut
        creneau.end = creneau.dateSortie
        creneau.title = creneau.titre
        creneau.resourceId = creneau.activite
        return creneau
      })
      this.applyFilter()
    },
    selectZone(newZone) {
      this.filter.zone = [newZone]
      this.applyFilter()
    },
    toggleZone(newZone) {
      if (this.filter.zone.includes(newZone)) {
        this.filter.zone.splice(this.filter.zone.indexOf(newZone), 1)
      } else {
        this.filter.zone.push(newZone)
      }
      this.applyFilter()
    },
    applyFilter() {
      if (this.filter.zone.length === 0) {
        this.creneaux = this.creneauxFetched
      } else {
        this.creneaux = this.creneauxFetched.filter((creneau) => {
          return this.filter.zone.some((zoneId) => {
            return creneau.zones.includes(zoneId)
          })
        })
      }
    },
  },
})
