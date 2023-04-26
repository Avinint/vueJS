export default interface Creneau {
  id: string,
  dateDebut: string,        // '2023-04-26T10:00:00.000+00:00'
  dateFinActivite: string,  // '2023-04-26T10:00:00.000+00:00'
  dateSortie: string,
  titre: string,
  zones: number[],
  activite: number,
}
