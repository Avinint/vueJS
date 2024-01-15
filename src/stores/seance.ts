import { getAnimateursParOrganisme } from '@api/animateur'
import {
  default_seance,
  parseSeance,
} from '../services/planning/seance_service'
import { defineStore } from 'pinia'
import { deleteSeance, postSeance, putSeance } from '@api/seance'
import { useCreneauStore } from './creneau'
import { getDateStringHour } from '../services/date_service'

type SeanceStoreState = {
  animateurs: Animateur[]
  groupes: Groupe[]
  selected_animateurs: boolean[]
  selected_groupes: boolean[]
  data: Seance
}

export const useSeanceStore = defineStore('seance', {
  state: (): SeanceStoreState => ({
    animateurs: [],
    groupes: [],
    selected_animateurs: [],
    selected_groupes: [],
    data: default_seance,
  }),
  getters: {
    getAnimateurs: (state) => state.animateurs,
    getGroupes: (state) => state.groupes,
    getDebut: (state) => state.data.dateHeureDebut,
    getFin: (state) => state.data.dateHeureFin,
  },
  actions: {
    getAnimateur(id: number) {
      for (const animateur of this.animateurs) {
        if (animateur.id == id) return animateur
      }
      throw 'Animateur not found.'
    },
    updateSeance(seance_id: number, updated_seance: Seance) {
      const creneau_store = useCreneauStore()
      for (let index in creneau_store.seances) {
        const seance = creneau_store.seances[index]
        if (seance.id == seance_id) {
          updated_seance.animateurs = updated_seance.animateurs.map((e) =>
            this.getAnimateur(e.id)
          )
          updated_seance.type = 'animateur'
          updated_seance.id = seance_id
          creneau_store.seances[index] = updated_seance
        }
      }
    },
    removeSeance(seance_id: number) {
      const creneau_store = useCreneauStore()
      for (const index in creneau_store.seances) {
        const seance = creneau_store.seances[index]
        if (seance.id == seance_id) {
          creneau_store.seances.splice(parseInt(index), 1)
        }
      }
    },
    async fetchAnimateurs(id_organisme: number) {
      this.animateurs = await getAnimateursParOrganisme(id_organisme)
      this.selected_animateurs = this.animateurs.map(() => {
        return false
      })
    },
    async post() {
      const creneau_store = useCreneauStore()
      if (creneau_store.id) {
        const response = await postSeance(
          parseSeance(
            creneau_store.getId,
            this.animateurs,
            this.selected_animateurs,
            this.groupes,
            this.selected_groupes,
            this.data
          )
        )
        creneau_store.seances.push(response.reservation)
      }
    },
    async put() {
      const creneau_store = useCreneauStore()
      if (creneau_store.id) {
        const seance = parseSeance(
          creneau_store.getId,
          this.animateurs,
          this.selected_animateurs,
          this.groupes,
          this.selected_groupes,
          this.data
        )
        const response = await putSeance(this.data.id, seance)
        this.updateSeance(this.data.id, response)
      }
    },
    async delete() {
      const creneau_store = useCreneauStore()
      if (creneau_store.id) {
        await deleteSeance(this.data.id)
        this.removeSeance(this.data.id)
      }
    },
    load(seance: Seance) {
      for (const index in this.animateurs) {
        const animateur = this.animateurs[index]
        let found = false
        for (const seance_animateur of seance.animateurs) {
          if (seance_animateur.id == animateur.id) {
            this.selected_animateurs[index] = true
            found = true
          }
        }
        if (!found) this.selected_animateurs[index] = false
      }

      for (const index in this.groupes) {
        const groupe = this.groupes[index]
        let found = false
        for (const seance_groupe of seance.groupes) {
          if (seance_groupe.id == groupe.id) {
            this.selected_groupes[index] = true
            found = true
          }
        }
        if (!found) this.selected_groupes[index] = false
      }

      this.data = {
        ...seance,
        dateHeureDebut: getDateStringHour(seance.dateHeureDebut),
        dateHeureFin: getDateStringHour(seance.dateHeureFin),
      }
    },
    setDefault() {
      this.data = default_seance
    }
  }
})
