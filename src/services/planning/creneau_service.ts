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
    dureeActivite: creneau.dureeActivite,
    dureeInterCreneau: creneau.dureeInterCreneau,
    heureDebut: `${creneau.heureDebut}:00`,
    heureFin: `${creneau.heureFin}:00`,
    organisme: creneau.organisme,
    zoneId: zone_id,
  }
}

export const default_creneau = (): Creneau => ({
  id: 0,
  creneauType: 0,
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
});