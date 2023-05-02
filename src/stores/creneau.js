import { defineStore } from 'pinia'
import { postCreneau, updateCreneau } from '@api/planning.js'

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
      const resp = await postCreneau(this.$state)
      console.log(resp)
    },
    async editCreneau() {
      this.formatCreneau()
      const id = 4
      const resp = await updateCreneau(id, this.$state)
      console.log(resp)
    },
    formatCreneau() {
      // for each this.zoneId
      // dataToSend = this.$state
      // dataToSend.zoneId = id
      // dataToSend.activites = filter(zone.id = id)
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
        (storedActivite) => storedActivite.activiteId === activite.activiteId
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
