import { defineStore } from 'pinia'
import { defaultHeaders } from '@api/api.js'
import $fetch from '@api/refreshToken.js'

export const usePlanningStore = defineStore('planning', {
  state: () => ({
    creneauxFetched: [],
    creneaux: [],
    filter: {
      zone: [],
    },
  }),
  getters: {
    isZoneActive(state) {
      return (id) => {
        return state.filter.zone.includes(id)
      }
    },
    getNumberActiveZone(state) {
      let filterZoneLength = state.filter.zone.length
      return state.filter.zone.length === 0
        ? ''
        : `(${state.filter.zone.length})`
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
            activites: [19, 21],
          },
          {
            id: '',
            dateDebut: '2023-04-19T13:00:00.000+00:00',
            dateFinActivite: '2023-04-19T13:50:00.000+00:00',
            dateSortie: '2023-04-19T14:00:00.000+00:00',
            titre: 'Creneau 4',
            activites: [21],
          },
          {
            id: '',
            dateDebut: '2023-04-19T13:00:00.000+00:00',
            dateFinActivite: '2023-04-19T13:50:00.000+00:00',
            dateSortie: '2023-04-19T14:00:00.000+00:00',
            titre: 'Creneau 5',
            activites: [39],
          },
          {
            id: '',
            dateDebut: '2023-04-20T13:00:00.000+00:00',
            dateFinActivite: '2023-04-20T13:50:00.000+00:00',
            dateSortie: '2023-04-20T14:00:00.000+00:00',
            titre: 'Creneau 6',
            activites: [39, 21],
          },
        ],
      }
      this.creneauxFetched = response.creneaux.map((creneau) => {
        creneau.start = creneau.dateDebut
        creneau.end = creneau.dateSortie
        creneau.title = creneau.titre
        return creneau
      })
      this.creneaux = this.creneauxFetched
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
            return creneau.activites.includes(zoneId)
          })
        })
      }
    },
  },
})
