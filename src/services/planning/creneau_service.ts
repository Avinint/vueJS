/**
 * Generate a creneau object type from a Creneau store state object and a zone id.
 * Remove the activities that are not in the given zone_id, and set the zoneId of the
 * Creneau.
 *
 * @param zone_id The zone ID that is used to clean the object
 * @param state_data The state that come from the store
 * @returns A copy of the given state data **not a reference.**
 */
export function makeCreneau(zone_id: number, state_data: Creneau): Creneau {
  const copy = { ...state_data }

  copy.zoneId = zone_id
  const activites = []

  for (const index in copy.activites) {
    const activite = copy.activites[index]
    if (activite.zoneId == zone_id) {
      delete activite.zoneId
      activites.push(activite)
      continue
    }
  }

  copy.activites = activites
  return copy
}

export const default_creneau = (): Creneau => ({
  id: 0,
  creneauType: 0,
  zoneId: 0,
  activites: [],
  titre: '',
  date: '',
  heureDebut: '', // "14:30:00"
  heureFin: '', // "14:30:00"
  dureeActivite: 55, // 55
  dureeInterCreneau: 5,
  description: '',
  organisme: 0,
  animateurLabellise: 0,
  niveauPratique: 0,
  tarifHoraire: 0,
  nbParticipants: 0,
});