import { defineStore } from 'pinia'
import { postCreneau, updateCreneau } from '@api/planning'
import { usePlanningStore } from '@stores/planning'
import {
  default_creneau,
  makeCreneau,
} from '../services/planning/creneau_service'

export const useCreneauStore = defineStore('creneau', {
  state: default_creneau,
  actions: {
    async addCreneau() {
      this.formatCreneau()
      const planningStore = usePlanningStore()
      let created_creneau = null;

      for(let i = 0; i < this.zoneId.length; i++) {
        const zone_id = this.zoneId[i];
        const creneau = makeCreneau(zone_id, this.$state)
        if (i == 0) {
          const response = await postCreneau(creneau)
          created_creneau = response.creneaux[0];
          continue;
        }
        await updateCreneau(created_creneau.id, creneau);
      }

      planningStore.addCreneaux([created_creneau]);
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
