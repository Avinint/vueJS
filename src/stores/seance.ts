import { getAnimateursOrganisme } from '@api/animateur'
import { default_seance } from '../services/planning/seance_service'
import { defineStore } from 'pinia'

type SeanceStoreState = {
  animateurs: Animateur[],
  data: Seance,
}

export const useSeanceStore = defineStore('seance', {
  state: (): SeanceStoreState => ({
    animateurs: [],
    data: default_seance,
  }),
  getters: {
    getAnimateurs: (state) => state.animateurs,
    getDebut: (state) => state.data.dateHeureDebut,
    getFin: (state) => state.data.dateHeureFin,
  },
  actions: {
    async fetchAnimateurs(id_organisme: number) {
      this.animateurs = await getAnimateursOrganisme(id_organisme);
    },
    setDefault() {
      this.data = default_seance
    },
  },
})
