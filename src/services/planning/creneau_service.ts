import { getCreneauDuration } from "../date_service";

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
export function makeCreneauEditContract(zone_id: number, creneau: Creneau): CreneauEditContract {

  const activities = [];
  for(const activity of creneau.activites) {
    if(activity.zoneId === zone_id) {
      activities.push({
        activiteId: activity.activiteId,
        tarif: activity.prix,
      });
    }
  }

  return {
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
}

/**
 * Generate an ``organisme`` type creneau edit contract that is properly typed to be used by the API
 *
 * @param zone_id The zone ID that is used to clean the object
 * @param creneau Creneau data
 */
export function makeCreneauOGEditContract(zone_id: number, creneau: Creneau): CreneauOGEditContract {
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
  }
}

export function makeDemandeEditContract(zone_id: number, organisme_id: number, form: DemandeForm): DemandeEditContract {
  return {
    creneau: {
      zoneId: zone_id,
      titre: form.title,
      date: form.date,
      heureDebut: form.start_time,
      heureFin: form.end_time,
      dureeActivite: 0,
      dureeInterCreneau: 0,
      description: '',
      organisme: organisme_id,
      creneauType: 2,
    },
    commentaire: ''
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
});