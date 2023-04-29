import { defineStore } from 'pinia'
import { postCreneau, updateCreneau, deleteCreneau } from '@api/planning.js'

export const useCreneauStore = defineStore('creneau', {
  state: () => ({
    creneauType: 0,
    zoneId: 0,
    activites: [],
    titre: '',
    date: '',
    heureDebut: '', // "14:30:00"
    heureFin: '', // "14:30:00"
    dureeActivite: 0, // 55
    dureeInterCreneau: 0, // 5
    description: '',
    organisme: 0,
    animateurLabellise: 0,
    niveauPratique: 0,
    tarifHoraire: 0,
    nbParticipants: 0,
  }),
  actions: {
    async addCreneau() {
      const resp = await postCreneau(this.$state)
      console.log(resp)
    },
    async editCreneau() {
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
    formatCreneau(creneau) {
      creneau.extendedProps.activites.forEach((activite) => {
        activite.activiteId = activite.id
        activite.tarif = activite.prix
        delete activite.id
        delete activite.prix
        delete activite.maxTerrain
        delete activite.libelle
      })
    },
  },
})
