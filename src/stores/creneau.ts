import { defineStore } from 'pinia'
import { postCreneau, updateCreneau } from '@api/planning'
import { usePlanningStore } from '@stores/planning'
import {
  default_creneau,
  makeCreneauEditContract,
} from '../services/planning/creneau_service'
import dayjs from 'dayjs'

export const useCreneauStore = defineStore('creneau', {
  state: default_creneau,
  actions: {
    setDefault() {
      this.$state = default_creneau()
    },
    setCreneau(creneau: CalendarEvent) {
      this.id = creneau.id
      this.date = dayjs(creneau.start).format('YYYY-MM-DD') // 2023-01-23
      this.heureDebut = dayjs(creneau.start).format('HH:mm') // "14:30:00"
      this.heureFin = dayjs(creneau.end).format('HH:mm') // "14:30:00"

      // Extended props contains the complete Creneau data.
      // Even if it is typed "any"
      if (creneau.extendedProps) {
        this.creneauType = creneau.extendedProps.type
        this.zones = creneau.extendedProps.zones
        this.activites = creneau.extendedProps.activites.map(
          (activite: any) => {
            activite.activiteId = activite.id
            activite.tarif = activite.prix
            return activite
          }
        )

        this.titre = creneau.extendedProps.titre
        this.dureeActivite = creneau.extendedProps.dureeActivite // 55
        this.dureeInterCreneau = creneau.extendedProps.dureeInterCreneau // 5
      } else {
        this.zones = []
      }
    },
    async addCreneau() {
      const planningStore = usePlanningStore()
      let created_creneaux: Creneau[] = []

      for (let i = 0; i < this.zones.length; i++) {
        const zone_id = this.zones[i]
        const creneau = makeCreneauEditContract(zone_id, this.$state)
        const response = await postCreneau(creneau)

        if (planningStore.currentViewName === 'day') {
          if (zone_id == planningStore.filters.zone[0])
            created_creneaux = created_creneaux.concat(response.creneaux)
        } else {
          created_creneaux = created_creneaux.concat(response.creneaux)
        }
      }

      planningStore.addCreneaux(created_creneaux)
    },
    async editCreneau() {
      const planningStore = usePlanningStore()

      this.zones.forEach(async (id: number) => {
        const contract = makeCreneauEditContract(id, this)
        const response = await updateCreneau(this.id!, contract)
        planningStore.addCreneaux(response.creneaux)
      })
    },
    addActivite(activite: Activite) {
      const index = this.activites.findIndex(
        (storedActivite: Activite) =>
          storedActivite.activiteId == activite.activiteId &&
          storedActivite.zoneId == activite.zoneId
      )
      if (index === -1) this.activites.push(activite)
    },
    dropActivite(id: number) {
      const index = this.activites.findIndex(
        (storedActivite: Activite) => storedActivite.activiteId == id
      )
      if (index !== -1) this.activites.splice(index, 1)
    },
  },
})
