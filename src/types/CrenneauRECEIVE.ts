// SQRS Lecture / RECEIVE Format
export default interface Activite {
  id: Number,
  libelle: String,
  maxTerrain: Number,
  prix?: Number,
}
export default interface Creneau {
  id: Number,
  dateDebut: String,
  dateFinCreneau: String,
  dateSortie: String,
  titre: String,
  activites: Activite[],
  type: Number,
  remplissage: Number,
  zones: Number[],
  dureeActivite: Number,
  dureeInterCreneau: Number,

  start: String,
  end: String,
  title: String,
}
