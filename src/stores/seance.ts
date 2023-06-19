import { getAnimateursOrganisme } from '@api/animateur'
import { default_seance, parseSeance } from '../services/planning/seance_service'
import { defineStore } from 'pinia'
import { postSeance } from '@api/seance'
import { useCreneauStore } from './creneau'

type SeanceStoreState = {
  animateurs: Animateur[],
  selected_animateurs: boolean[],
  data: Seance,
}

export const useSeanceStore = defineStore('seance', {
  state: (): SeanceStoreState => ({
    animateurs: [],
    selected_animateurs: [],
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
      this.selected_animateurs = this.animateurs.map(() => {return false});
    },
    async post() {
      const creneau_store = useCreneauStore();
      if(creneau_store.id) {
        const response = await postSeance(parseSeance(creneau_store.getId, this.animateurs, this.data));
        creneau_store.seances.push(response.reservation);
      }
    },
    setDefault() {
      this.data = default_seance
    },
  },
})
