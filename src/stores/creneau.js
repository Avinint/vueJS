import { defineStore } from 'pinia'
import { postCreneau, updateCreneau } from '@api/planning.js'
import { usePlanningStore } from '@stores/planning.js'

export const useCreneauStore = defineStore('creneau', {
  state: () => ({
    id: 0,
    creneauType: 0,
    zoneId: 0,
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
    async addCreneau() {
      this.formatCreneau()
      this.zoneId.forEach(async (id) => {
        let dataToSend = { ...this.$state }
        dataToSend.zoneId = id

        const response = await postCreneau(dataToSend)

        const planningStore = usePlanningStore()
        planningStore.addCreneaux(response.creneaux)
      })
    },
    async editCreneau() {
      this.formatCreneau()
      this.zoneId.forEach(async (id) => {
        let dataToSend = { ...this.$state }

        dataToSend.zoneId = id
        await updateCreneau(this.id, dataToSend)
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
