<template>
  <section>
    <nav>
      <button @click="zone">zones</button>
      <button @click="fetch">fetch</button>
      <button @click="post">post</button>
      <button @click="update">update</button>
      <button @click="delete">delete</button>
    </nav>
    <textarea id="" v-model="response" name="" cols="130" rows="33"> </textarea>
  </section>
</template>

<script>
import { usePlanningStore } from '@stores/planning.js'
import { mapStores } from 'pinia'
import { getZones } from '@api/zone'
import {
  getPlanning,
  postCreneau,
  updateCreneau,
  deleteCreneau,
} from '@api/planning.js'

export default {
  data() {
    return {
      response: '',
      data: {
        creneauType: 1,
        zoneId: 2,
        activites: [
          {
            activiteId: 4,
            tarif: 3400,
          },
        ],
        titre: 'Titre',
        date: '2023-05-02',
        heureDebut: '14:30:00',
        heureFin: '15:30:00',
        dureeActivite: 55,
        dureeInterCreneau: 5,
        description: '',
        organisme: 0,
        animateurLabellise: 0,
        niveauPratique: 0,
        tarifHoraire: 0,
        nbParticipants: 0,
      },
    }
  },
  methods: {
    async zone() {
      this.response = await getZones(1, '&typeZone.code=zone&fitArena=2')
      this.response = JSON.stringify(this.response)
    },
    async fetch() {
      this.response = ''
      let debut = '1683010758'
      let fit_arena = 1
      let duree = 14
      let zone = '1,2,3'
      this.response = await getPlanning(debut, fit_arena, duree, zone)
      this.response = JSON.stringify(this.response)
    },
    async post() {
      this.response = ''
      this.response = await postCreneau(this.data)
      this.response = JSON.stringify(this.response)
    },
    async update() {
      this.response = ''
      this.data.titre = 'updated'
      this.response = await updateCreneau(1, this.data)
      this.response = JSON.stringify(this.response)
    },
    async delete() {
      this.response = ''
      this.response = await deleteCreneau(1, this.data)
      this.response = JSON.stringify(this.response)
    },
  },
}
</script>
