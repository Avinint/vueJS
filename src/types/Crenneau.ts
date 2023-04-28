// SQRS Lecture / RECEIVE Format
export default interface ActiviteRECEIVE {
  id: Number,
  libelle: String,
  maxTerrain: Number,
  prix?: Number,
}
export default interface CreneauRECEIVE {
  id: Number,
  dateDebut: String,
  dateFinCreneau: String,
  dateSortie: String,
  titre: String,
  activites: ActiviteRECEIVE[],
  type: Number,
  remplissage: Number,
  zones: Number[],
  dureeActivite: Number,
  dureeInterCreneau: Number,

  start: String,
  end: String,
  title: String,
}

// SQRS Ecriture / SEND Format
export default interface ActiviteSEND {
  activiteId: Number,
  tarif: Number,
}

export default interface CreneauSEND {
  creneauType: Number,
  zoneId: Number,
  activites: ActiviteSEND[],
  titre: String,
  date: String,
  heureDebut: String, // "14:30:00"
  heureFin: String, // "14:30:00"
  dureeActivite: Number, // 55
  dureeInterCreneau: Number, // 5
  description: String,
  organisme: Number,
  animateurLabellise: Number,
  niveauPratique: Number,
  tarifHoraire: Number,
  nbParticipants: Number,
}
