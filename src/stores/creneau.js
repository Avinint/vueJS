import { defineStore } from 'pinia'
import { postCreneau, updateCreneau, deleteCreneau } from '@api/planning.js'

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
    async dropCreneau(creneau) {
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
    async trySend() {
      const resp = await postCreneau({
        creneauType: 2,
        zoneId: 3,
        activites: [
          {
            activiteId: 4,
            tarif: 34,
          },
        ],
        titre: 'Test en dur',
        date: '01-05-2023',
        heureDebut: '14:30:00',
        heureFin: '14:30:00',
        dureeActivite: 55,
        dureeInterCreneau: 5,
        description: 'description',
        organisme: 3,
        animateurLabellise: 0,
        niveauPratique: 0,
        tarifHoraire: 0,
        nbParticipants: 0,
      })
      console.log(resp)
    },
  },
})
