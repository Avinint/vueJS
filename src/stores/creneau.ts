import { defineStore } from 'pinia'
import { deleteCreneau, postCreneau, updateCreneau } from '@api/planning'
import { usePlanningStore } from '@stores/planning'
import {
  default_creneau,
  makeCreneauOGEditContract,
  makeDemandeCreneauEditContract
} from '../services/planning/creneau_service'
import dayjs from 'dayjs'
import { getCreneauSeances } from '@api/seance'
import { getDateStringHour } from "../services/date_service";

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
      this.id = parseInt(creneau.id as string)
      this.date = dayjs(creneau.start).format('YYYY-MM-DD') // 2023-01-23
      this.heureDebut = dayjs(creneau.start).format('HH:mm') // "14:30:00"
      this.heureFin = dayjs(creneau.end).format('HH:mm') // "14:30:00"

      // Extended props contains the complete Creneau data.
      // Even if it is typed "any"
      if (creneau.extendedProps) {
        this.creneauType = creneau.extendedProps.type
        this.zones = creneau.extendedProps.zones
        this.activites = creneau.extendedProps.activites

        this.titre = creneau.extendedProps.titre
        this.dureeActivite = creneau.extendedProps.dureeActivite // 55
        this.dureeInterCreneau = creneau.extendedProps.dureeInterCreneau // 5
        this.organisme = creneau.extendedProps.organismeId ?? creneau.extendedProps.organisme
        this.recurrence = creneau.extendedProps.recurrence
      } else {
        this.zones = []
      }
    },
    async addCreneau(fitarena_id: number) {
      const planningStore = usePlanningStore()
      const creneau = makeDemandeCreneauEditContract(fitarena_id, this.$state)
      const response = await postCreneau(creneau)
      const creneaux = this.parseDemandeCreneauResponse(response);
      planningStore.addCreneaux(creneaux);
    },
    async addCreneauOrganisme(fitarena_id: number) {
      const planningStore = usePlanningStore()
      const creneau = makeCreneauOGEditContract(fitarena_id, this.$state)
      const response = await postCreneau(creneau)
      const creneaux = this.parseDemandeCreneauResponse(response);
      planningStore.addCreneaux(creneaux);
    },
    async editCreneau(fitarena_id: number) {
      if (!this.id) return
      const planningStore = usePlanningStore()
      const contract = makeDemandeCreneauEditContract(fitarena_id, this.$state)
      const response = await updateCreneau(this.id, contract)
      planningStore.addCreneaux(this.parseDemandeCreneauResponse(response));
      planningStore.removeCreneau(this.id)
    },
    async editCreneauOrganisme(fitarena_id: number) {
      if (!this.id) return

      const planningStore = usePlanningStore()
      const contract = makeCreneauOGEditContract(fitarena_id, this.$state)
      const response = await updateCreneau(this.id, contract)
      planningStore.addCreneaux(this.parseDemandeCreneauResponse(response));
      // planningStore.removeCreneau(this.id)
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
        const planningStore = usePlanningStore()
        planningStore.removeCreneau(this.id)
      }
    },
    async fetchSeances() {
      this.seances = []
      if (this.id) {
        this.seances = await getCreneauSeances(this.id)
      }
    },

    parseReponseActivite({id: activiteId, libelle, maxTerrain = 0, prix: tarif}: ActiviteReponse): Activite {
      return {
        activiteId,
        libelle,
        maxTerrain,
        tarif
      }
    },

    parseDemandeCreneauResponse(response: DemandeCreneauEditResponse): Creneau[] {

      return response.creneaux.map(creneau => {
        const value: Creneau = {
          id: creneau.id,
          activites: creneau.activites.map((activite: ActiviteReponse): Activite => this.parseReponseActivite(activite)),
          creneauType: creneau.type,
          type: creneau.type,
          titre: creneau.titre,
          date: creneau.dateDebut, // besoin de l'heure
          description: creneau.description,
          animateurLabellise: 0,
          dureeActivite: creneau.dureeActivite,
          dureeInterCreneau: creneau.dureeInterCreneau,
          dateDebut: creneau.dateDebut,
          dateSortie: creneau.dateSortie,
          nbParticipants: creneau.remplissage,
          niveauPratique: 0,
          tarifHoraire: 0,
          heureDebut: getDateStringHour(creneau.dateDebut),
          heureFin: getDateStringHour(creneau.dateFinCreneau),
          organisme: creneau.organismeId ?? 0,
          zones: creneau.zones,
          dateFinCreneau: creneau.dateFinCreneau,
          seances: [],
          zoneId: 0,
          recurrence: creneau.recurrence,
          mode: '',
        }

        return value;
      })

    },

    rafraichirCreneau(creneau: Creneau) {
      for (const prop in creneau) {
        this[prop] = creneau[prop]
      }
    }
  },
})
