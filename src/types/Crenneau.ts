// SQRS Ecriture / SEND Format
export default interface Activite {
  activiteId: Number,
  tarif: Number,
}

export default interface Creneau {
  creneauType: Number,
  zoneId: Number,
  activites: Activite[],
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
