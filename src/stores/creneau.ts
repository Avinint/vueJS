import { defineStore } from 'pinia'
import { deleteCreneau, postCreneau, updateCreneau } from '@api/planning'
import { usePlanningStore } from '@stores/planning'
import { getOrganismes } from '@api/organisme'
import {
  ParseDemandeCreneauResponse,
  default_creneau,
  makeCreneauEditContract,
  makeCreneauOGEditContract,
  makeDemandeCreneauEditContract,
} from '../services/planning/creneau_service'
import dayjs from 'dayjs'
import { getCreneauSeances } from '@api/seance'

export const useCreneauStore = defineStore('creneau', {
  state: default_creneau,
  getters: {
    getId: (state) => parseInt(state.id?.toString() || '0'),
  },
  actions: {
    setDefault() {
      this.$state = default_creneau()
    },
    setCreneau(creneau: CalendarEvent) {
      this.id = creneau.id as number
      this.date = dayjs(creneau.start).format('YYYY-MM-DD') // 2023-01-23
      this.heureDebut = dayjs(creneau.start).format('HH:mm') // "14:30:00"
      this.heureFin = dayjs(creneau.end).format('HH:mm') // "14:30:00"

      // Extended props contains the complete Creneau data.
      // Even if it is typed "any"
      if (creneau.extendedProps) {
        this.creneauType = creneau.extendedProps.type
        this.zones = creneau.extendedProps.zones
        this.activites = creneau.extendedProps.activites.map(
          (activite: any) => {
            activite.activiteId = activite.id
            activite.tarif = activite.tarif
            return activite
          }
        )

        this.titre = creneau.extendedProps.titre
        this.dureeActivite = creneau.extendedProps.dureeActivite // 55
        this.dureeInterCreneau = creneau.extendedProps.dureeInterCreneau // 5
        this.organisme = creneau.extendedProps.organismeId
        this.recurrence = creneau.extendedProps.recurrence
      } else {
        this.zones = []
      }
    },
    async addCreneau(fitarena_id: number) {
      const planningStore = usePlanningStore()
      const creneau = makeDemandeCreneauEditContract(fitarena_id, this.$state)
      const response = await postCreneau(creneau)
      const creneaux = ParseDemandeCreneauResponse(response);
      planningStore.addCreneaux(creneaux);
    },
    async addCreneauOrganisme(fitarena_id: number) {
      const planningStore = usePlanningStore()
      const creneau = makeCreneauOGEditContract(fitarena_id, this.$state)
      const response = await postCreneau(creneau)
      const creneaux = ParseDemandeCreneauResponse(response);
      planningStore.addCreneaux(creneaux);
    },
    async editCreneau(fitarena_id: number) {
      if (!this.id) return

      const planningStore = usePlanningStore()
      const contract = makeDemandeCreneauEditContract(fitarena_id, this.$state)
      const response = await updateCreneau(this.id, contract)
      planningStore.addCreneaux(ParseDemandeCreneauResponse(response));
    },
    async editCreneauOrganisme(fitarena_id: number) {
      if (!this.id) return

      const planningStore = usePlanningStore()
      const contract = makeCreneauOGEditContract(fitarena_id, this.$state)
      const response = await updateCreneau(this.id, contract)
      planningStore.addCreneaux(ParseDemandeCreneauResponse(response));
    },
    addActivite(activite: Activite) {
      const index = this.activites.findIndex(
        (storedActivite: Activite) =>
          storedActivite.activiteId == activite.activiteId &&
          storedActivite.zoneId == activite.zoneId
      )
      if (index === -1) this.activites.push(activite)
    },
    dropActivite(id: number) {
      const index = this.activites.findIndex(
        (storedActivite: Activite) => storedActivite.activiteId == id
      )
      if (index !== -1) this.activites.splice(index, 1)
    },
    async delete() {
      if (this.id) {
        await deleteCreneau(this.id)
        const planning_store = usePlanningStore()
        planning_store.removeCreneau(this.id)
      }
    },
    async fetchSeances() {
      this.seances = []
      if (this.id) {
        this.seances = await getCreneauSeances(this.id)
      }
    },
  },
})
