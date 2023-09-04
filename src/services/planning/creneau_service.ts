import { getCreneauDuration } from '../date_service'

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
  zone_id: number,
  creneau: Creneau
): CreneauOGEditContract {
  if (creneau.recurrence) {
    creneau.recurrence.dateDebut = creneau.date
  }

  return {
    creneauType: 2,
    titre: creneau.titre,
    date: creneau.date,
    description: creneau.description,
    dureeActivite: getCreneauDuration(creneau.heureDebut, creneau.heureFin),
    dureeInterCreneau: 0,
    heureDebut: `${creneau.heureDebut}:00`,
    heureFin: `${creneau.heureFin}:00`,
    organisme: creneau.organisme,
    zoneId: zone_id,
    recurrence: creneau.recurrence,
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
      creneauType: 1, //creneau.creneauType.libelle: retourner un ID plutot qu'un libelle,
      dureeActivite: creneau.dureeActivite,
      dureeInterCreneau: creneau.dureeIntercreneau,
      nbParticipants: 0,
      niveauPratique: 0,
      tarifHoraire: 0,
      heureDebut: creneau.heureDebut,
      heureFin: '',
      organisme: 0, // creneau.organismes? kesako
      zones: [], // besoin?
      activites: [], // besoin?
      dateDebut: creneau.dateDebut,
      dateFinCreneau: '',
      dateSortie: '',
      seances: [],
      type: 1,
      zoneId: 0,
    }

    return value;
  })
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
