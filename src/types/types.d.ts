type Creneau = {
  id?: number
  activites: Activite[]
  creneauType: number
  type: number
  titre: string
  date: string
  dateDebut: string
  dateSortie: string
  dateFinCreneau: string
  heureDebut: string // "14:30:00;
  heureFin: string // "14:30:00;
  dureeActivite: number // 5;
  dureeInterCreneau: number
  description: string
  organisme: number
  animateurLabellise: number
  niveauPratique: number
  tarifHoraire: number
  nbParticipants: number
  zones: number[]
  zoneId?: number
  mode: string | null
  seances: Seance[]
  recurrence: Recurrence
  demandeId?: number
  statut?: string
  commentaires?: []
}

type CreneauAnonyme = {
  id?: number | string
  dateDebut: string,
  dateSortie: string,
  dateFinCreneau: string,
  type: number,
  zones: number[],
  statut: string
}

type Recurrence = {
  dateDebut: string
  dateFin?: string
  maxOccurrences: number
  separation: number
  recurrenceType: number
  recurrenceJoursSemaine: number[]
  recurrenceSemainesMois: number[]
  recurrenceOrdinaux: { id: number }[]
}

type DemandeCreneau = {}

type Zone = {
  id: number
  libelle: string
}

type DemandeEditContract = {
  creneau: {
    id?: number
    creneauType: number
    zones: { id: number; activites: { activiteId: number; tarif: number }[] }[]
    titre: string
    date: string
    heureDebut: string
    heureFin: string
    dureeActivite: number
    dureeInterCreneau: number
    description: string
    organisme: number
    animateurLabellise: number
    niveauPratique: number
    tarifHoraire: number
    nbParticipants: number
    recurrence: Recurrence
  }
  commentaire: string
  fitArenaId: number
}

type CreneauOGEditContract = {
  creneauType: 2
  zoneId: number
  titre: string
  date: string
  heureDebut: string
  heureFin: string
  dureeActivite: number
  dureeInterCreneau: number
  description: string
  organisme: number
  recurrence?: Recurrence
}

// POST // PUT
type CreneauEditContract = {
  creneauType: number
  zoneId: number
  activites: { activiteId: number; tarif: number }[]
  titre: string
  date: string
  heureDebut: string
  heureFin: string
  dureeActivite: number
  dureeInterCreneau: number
  description: string
  organisme: number
  animateurLabellise: number
  niveauPratique: number
  tarifHoraire: number
  nbParticipants: number
  recurrence?: Recurrence
}

type ZoneContract = { id: number; activites: { activiteId: number; tarif: number }[] }

type CreneauDemandeContract = {
  id?: number
  creneauType: number
  zones: ZoneContract[]
  titre: string
  date: string
  heureDebut: string
  heureFin: string
  dureeActivite: number
  dureeInterCreneau: number
  description: string
  organisme: number
  animateurLabellise: number
  niveauPratique: number
  tarifHoraire: number
  nbParticipants: number
  recurrence: Recurrence,
  commentaire?: string
}

type DemandeCreneauEditContract = {
  creneau: CreneauDemandeContract
  commentaire: string
  fitArenaId: number
}

type SeanceEditContract = {
  dateHeureDebut: string
  dateHeureFin: string
  idCreneau: number
  animateurs: { id: number }[]
  groupes: { id: number }[]
}

type GroupeEditContract = {
  libelle: string
  idOrganisme: number
  animateurs: { id: number }[]
  adherents: { id: number }[]
}

type CreneauDemandePostResponse = {
    creneau: {
        creneaux: Creneau[],
    },
    commentaire: string,
    fitarenaId: number
}

type CreneauEditResponse = {
  creneaux: Creneau[]
}

type DemandeCreneauEditResponse = {
  creneaux: DemandeCreneauResult[]
  commentaire: string
  fitArenaId: number
}

type CommentaireDemande = {
  texte: string
  userEmail: string
}

type DemandeCreneauResult = {
  id: number
  dateDebut: string
  dateSortie: string
  dateFinCreneau: string
  titre: string
  description: string
  activites: ActiviteReponse[],
  type: number,
  remplissage: number,
  zones: number[],
  dureeActivite: number
  dureeInterCreneau: number
  statut: string
  recurrence: Recurrence,
  demandeId?: number
  organismeId?: number
}

type SeanceEditResponse = {
  idReservationParent: number
  reservation: Seance
  qrCode: string
}

type QRCodeResponse = {
  qrcode: string
}

enum CreneauType {
  GP = 1,
  OG = 2,
  AC = 3,
}

type Activite = {
  activiteId: number
  zoneId?: number
  libelle: string
  maxTerrain: number
  tarif: number
}

type ActiviteReponse = {
  id: number
  zoneId?: number
  libelle: string
  maxTerrain: number
  prix: number
}


type PlanningFilters = {
  debut: number
  fit_arena: number
  duree: number
  zone: number[]
  organisme: number
}

type Planning = {
  creneaux: Creneau[]
  creneauxAnonymes: CreneauAnonyme[]
  demandes: Creneau[]
  filters: PlanningFilters
  activites: Activite[]
  currentViewName: string
  currentDateStart: any // TODO: Find a proper type
  currentDateEnd: any // TODO: Find a proper type
  currentWeek: number
  slotMinTime: string
  slotMaxTime: string
  scrollTime: string
}

type Organisme = {
  id: number
  libelle: string
}

type CalendarEvent = {
  id: number | string
  start: string
  end: string
  title: string
  resourceIds: number[]
  classNames?: string[]
  overlap?: boolean
  editable?: boolean
  selectable?: boolean
  extendedProps?: any
}

type CalendarEventAnonyme = {
  start: string
  end: string
}

type Participant = {
  id: number
  idUser: number
  nom: string
  prenom: string
  organisateur: boolean
  statut: string
}

type Animateur = {
  id: number
  idUser: number
  nom: string
  prenom: string
  organisateur: boolean
  statut: string
  email: string
  telephone: string
  titulaireCarte: boolean
}

type Seance = {
  id: number
  dateHeureDebut: string
  dateHeureFin: string
  type: string
  participants: Participant[]
  animateurs: Animateur[]
  groupes: Groupe[]
  selected_animateurs: number[]
}

type Adherent = {
  id: number
  nom: string
  prenom: string
  dateNaissance: string
  numeroAdherent: string
  dateAdhesion: string
  dateFinAdhesion: string
  groupes: Groupe[]
  adresse: any // TODO: type entity
  email: string
  telephone: string
  licence: string
  genre: string
}

type Groupe = {
  id: number
  statut: boolean
  groupe: string
  libelle: string
  animateurs: Animateur[]
  adherents: Adherent[]
}
