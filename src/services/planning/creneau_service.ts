import { getCreneauDuration, getDateStringHour } from '../date_service'

type DemandeForm = {
  title: string,
  date: string,
  start_time: string,
  end_time: string,
  people_count: string,
  zones: number[],
}

/**
 * Generate an ``grand public`` type creneau edit contract that is properly typed to be used by the API
 * Only retreive the activities that are in the given zone_id, and set the zoneId of the
 * Creneau.
 *
 * @param zone_id The zone ID that is used to clean the object
 * @param creneau Creneau data
 */
export function makeCreneauEditContract(
  zone_id: number,
  creneau: Creneau
): CreneauEditContract {
  const activities = []
  for (const activity of creneau.activites) {
    if (activity.zoneId === zone_id) {
      activities.push({
        activiteId: activity.activiteId,
        tarif: activity.prix,
      })
    }
  }

  if (creneau.recurrence) {
    creneau.recurrence.dateDebut = creneau.date
  }

  const contract: CreneauEditContract = {
    activites: activities,
    titre: creneau.titre,
    animateurLabellise: creneau.animateurLabellise,
    creneauType: creneau.creneauType,
    date: creneau.date,
    description: creneau.description,
    dureeActivite: creneau.dureeActivite,
    dureeInterCreneau: creneau.dureeInterCreneau,
    heureDebut: `${creneau.heureDebut}:00`,
    heureFin: `${creneau.heureFin}:00`,
    nbParticipants: creneau.nbParticipants,
    niveauPratique: creneau.niveauPratique,
    organisme: creneau.organisme,
    tarifHoraire: creneau.tarifHoraire,
    zoneId: zone_id,
  }

  if (creneau.recurrence) {
    contract.recurrence =
      creneau.recurrence.separation > 0 ? creneau.recurrence : undefined
  }

  return contract
}

/**
 * Generate an ``organisme`` type creneau edit contract that is properly typed to be used by the API
 *
 * @param zone_id The zone ID that is used to clean the object
 * @param creneau Creneau data
 */
export function makeCreneauOGEditContract(
  fitarena_id: number,
  creneau: Creneau
): DemandeCreneauEditContract {
  if (creneau.recurrence) {
    creneau.recurrence.dateDebut = creneau.date
  }

  const zones = []
  for (const zone_id of creneau.zones) {
    const zone_activities = []
    for (const activity of creneau.activites) {
      if (activity.zoneId === zone_id) {
        zone_activities.push({
          activiteId: activity.activiteId,
          tarif: activity.tarif,
        })
      }
    }
    zones.push({ id: zone_id, activites: zone_activities })
  }

  return {
    creneau: {
      titre: creneau.titre,
      date: creneau.date,
      description: creneau.description,
      animateurLabellise: creneau.animateurLabellise,
      creneauType: creneau.creneauType,
      dureeActivite: getCreneauDuration(creneau.heureDebut, creneau.heureFin),
      dureeInterCreneau: 0,
      nbParticipants: creneau.nbParticipants,
      niveauPratique: creneau.niveauPratique,
      tarifHoraire: creneau.tarifHoraire,
      heureDebut: `${creneau.heureDebut}:00`,
      heureFin: `${creneau.heureFin}:00`,
      organisme: creneau.organisme,
      zones: zones,
      recurrence: creneau.recurrence,
    },
    commentaire: '',
    fitArenaId: fitarena_id,
  }
}

export function makeDemandeCreneauEditContract(
  fitarena_id: number,
  creneau: Creneau
): DemandeCreneauEditContract {
  if (creneau.recurrence) {
    creneau.recurrence.dateDebut = creneau.date
  }

  const zones = []
  for (const zone_id of creneau.zones) {
    const zone_activities = []
    for (const activity of creneau.activites) {
      if (activity.zoneId === zone_id) {
        zone_activities.push({
          activiteId: activity.activiteId,
          tarif: activity.tarif,
        })
      }
    }
    zones.push({ id: zone_id, activites: zone_activities })
  }

  return {
    creneau: {
      titre: creneau.titre,
      date: creneau.date,
      description: creneau.description,
      animateurLabellise: creneau.animateurLabellise,
      creneauType: creneau.creneauType,
      dureeActivite: creneau.dureeActivite,
      dureeInterCreneau: creneau.dureeInterCreneau,
      nbParticipants: creneau.nbParticipants,
      niveauPratique: creneau.niveauPratique,
      tarifHoraire: creneau.tarifHoraire,
      heureDebut: `${creneau.heureDebut}:00`,
      heureFin: `${creneau.heureFin}:00`,
      organisme: creneau.organisme,
      zones: zones,
      recurrence: creneau.recurrence,
    },
    commentaire: '',
    fitArenaId: fitarena_id,
  }
}

export function ParseDemandeCreneauResponse(response: DemandeCreneauEditResponse): Creneau[] {

  return response.creneaux.map(creneau => {
    const value: Creneau = {
      id: creneau.id,
      titre: creneau.titre,
      date: creneau.dateDebut, // besoin de l'heure
      description: creneau.description,
      animateurLabellise: 0,
      creneauType: creneau.type,
      dureeActivite: creneau.dureeActivite,
      dureeInterCreneau: creneau.dureeIntercreneau,
      nbParticipants: creneau.remplissage,
      niveauPratique: 0,
      tarifHoraire: 0,
      heureDebut: getDateStringHour(creneau.dateDebut),
      heureFin: getDateStringHour(creneau.dateFinCreneau),
      organisme: 0, // creneau.organismes? kesako
      zones: creneau.zones,
      activites: creneau.activites.map(e => {
        return {
          activiteId: e.id,
          libelle: e.libelle,
          tarif: e.prix,
           maxTerrain: 0,
        }
      }),
      dateDebut: creneau.dateDebut,
      dateFinCreneau: creneau.dateFinCreneau,
      dateSortie: creneau.dateSortie,
      seances: [],
      type: creneau.type,
      zoneId: 0,
      recurrence: creneau.recurrence,
      mode: '',
    }

    return value;
  })
}

export function makeDemandeEditContract(fitarena_id: number, organisme_id: number, form: any): DemandeEditContract {
  if (form.recurrence) {
    form.recurrence.dateDebut = form.date
  }

  const zones = []
  for (const zone_id of form.zones) {
    zones.push({ id: zone_id, activites: [] })
  }

  return {
    creneau: {
      titre: form.title,
      date: form.date,
      description: '',
      animateurLabellise: 0,
      creneauType: 2,
      dureeActivite: 0,
      dureeInterCreneau: 0,
      nbParticipants: form.people_count,
      niveauPratique: 0,
      tarifHoraire: 0,
      heureDebut: `${form.start_time}:00`,
      heureFin: `${form.end_time}:00`,
      organisme: organisme_id,
      zones: zones,
      recurrence: form.recurrence,
    },
    commentaire: form.commentaire,
    fitArenaId: fitarena_id
  }
}

export const default_creneau = (): Creneau => ({
  id: 0,
  creneauType: 0,
  type: 0,
  activites: [],
  titre: '',
  date: '',
  heureDebut: '', // "14:30:00"
  heureFin: '', // "14:30:00"
  dateSortie: '',
  dateDebut: '',
  dateFinCreneau: '',
  zones: [],
  dureeActivite: 55, // 55
  dureeInterCreneau: 5,
  description: '',
  organisme: 0,
  animateurLabellise: 0,
  niveauPratique: 0,
  tarifHoraire: 0,
  nbParticipants: 0,
  mode: null,
  seances: [],
  recurrence: {
    dateDebut: '',
    dateFin: '',
    maxOccurrences: 0,
    recurrenceType: 1,
    recurrenceJoursSemaine: [],
    recurrenceOrdinaux: [],
    recurrenceSemainesMois: [],
    separation: 0,
  },
})
