import { defineStore } from 'pinia'
import { postCreneau, updateCreneau } from '@api/planning'
import { usePlanningStore } from '@stores/planning.js'
import { default_creneau, makeCreneau } from '../services/planning/creneau_service'

export const useCreneauStore = defineStore('creneau', {
  state: default_creneau,
  actions: {
    async addCreneau() {
      this.formatCreneau()
      const planningStore = usePlanningStore()

      this.zoneId.forEach(async (zone_id: number) => {
        const creneau = makeCreneau(zone_id, this.$state)
        const response = await postCreneau(creneau)
        planningStore.addCreneaux(response.creneaux)
      })
    },
    async editCreneau() {
      this.formatCreneau()
      const planningStore = usePlanningStore()

      this.zoneId.forEach(async (id: number) => {
        const creneau = makeCreneau(id, this.$state)
        const response = await updateCreneau(this.id, creneau)
        planningStore.addCreneaux(response.creneaux)
      })
    },
    formatCreneau() {
      this.heureDebut += ':00'
      this.heureFin += ':00'
      const minuteDebut =
        this.heureDebut.split(':')[0] * 60 +
        Number(this.heureDebut.split(':')[1])
      const minuteFin =
        this.heureFin.split(':')[0] * 60 + Number(this.heureFin.split(':')[1])
      this.dureeActivite = minuteFin - minuteDebut
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
