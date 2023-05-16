import { defineStore } from 'pinia'
import { postCreneau, updateCreneau } from '@api/planning.js'
import { usePlanningStore } from '@stores/planning.js'

export const useCreneauStore = defineStore('creneau', {
  state: () => ({
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
    async addCreneau() {
      this.formatCreneau()
      // Post 1 creneau for each zone
      this.zoneId.forEach(async (id) => {
        let dataToSend = { ...this.$state }
        dataToSend.zoneId = id
        dataToSend.activites = this.$state.activites.filter(
          (activite) => activite.zoneId === id
        )
        dataToSend.activites.forEach((activite) => delete activite.zoneId)
        const resp = await postCreneau(dataToSend)
        const planningStore = usePlanningStore()
        planningStore.addCreneaux(resp.creneaux)
      })
    },
    async editCreneau() {
      this.formatCreneau()
      const id = 4
      const resp = await updateCreneau(id, this.$state)
      console.log(resp)
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
