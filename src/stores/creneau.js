import { defineStore } from 'pinia'
import { postCreneau, updateCreneau } from '@api/planning.js'
import { usePlanningStore } from '@stores/planning.js'

export const useCreneauStore = defineStore('creneau', {
  state: () => ({
    id: 0,
    creneauType: 0,
    zoneId: [],
    activites: [],
    titre: '',
    date: '',
    heureDebut: '', // "14:30:00"
    heureFin: '', // "14:30:00"
    dureeActivite: 0, // 55
    dureeInterCreneau: 5,
    description: '',
    organisme: 0,
    animateurLabellise: 0,
    niveauPratique: 0,
    tarifHoraire: 0,
    nbParticipants: 0,
  }),
  actions: {
    async sendCreneau(actionType) {
      this.formatCreneau()
      // Post 1 creneau for each zone
      this.zoneId.forEach(async (zoneId) => {
        let dataToSend = { ...this.$state }
        delete dataToSend.id
        dataToSend.zoneId = zoneId
        dataToSend.activites = this.$state.activites.filter(
            (activite) => activite.zoneId === zoneId
        )
        dataToSend.activites.forEach((activite) => delete activite.zoneId)
        if (actionType === 'create') {
          const resp = await postCreneau(dataToSend)
          const planningStore = usePlanningStore()
          planningStore.pushCreneaux(resp.creneaux)
        } else if (actionType === 'edit') {
          const id = this.id
          delete dataToSend.id
          const resp = await updateCreneau(id, dataToSend)
          const planningStore = usePlanningStore() // may need a creneauX store
          planningStore.updateCreneaux(resp)
        }
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
    resetCreneau() {
      this.$reset()
    },
    addActivite(activite) {
      const index = this.activites.findIndex(
          (storedActivite) =>
              storedActivite.activiteId === activite.activiteId &&
              storedActivite.zoneId === activite.zoneId
      )
      if (index === -1) this.activites.push(activite)
    },
    dropActivite(id) {
      const index = this.activites.findIndex(
          (storedActivite) => storedActivite.activiteId === id
      )
      if (index !== -1) this.activites.splice(index, 1)
    },
  },
})
