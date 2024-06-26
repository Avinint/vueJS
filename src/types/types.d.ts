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
  commentaires?: [],
  nbPersonnesAttendu?: number
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
    zones: { id: number; activites: { activiteId: number; tarifId: number }[] }[]
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
    mode: 'recurrence' | 'occurence',
    nbPersonnesAttendu: number
  }
  commentaire: string
  fitArenaId: number
  creneauModifId: number | null,
  nbPersonnesAttendu: number
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

type ZoneContract = { id: number; activites: { activiteId: number; tarifId?: number }[] }

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
  recurrence?: Recurrence,
  commentaire?: string
}

type DemandeCreneauEditContract = {
  creneau: CreneauDemandeContract
  commentaire: string
  fitArenaId: number,
  nbPersonnesAttendu?: number
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
    creneaux: Creneau[]
  },
  commentaire: string,
  fitarenaId: number,
  nbPersonnesAttendu: number
}

type CreneauEditResponse = {
  creneaux: Creneau[]
}

type DemandeCreneauEditResponse = {
  creneaux: DemandeCreneauResult[]
  commentaire: string
  fitArenaId: number,
  nbPersonnesAttendu: number
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
  organismeId?: number,
  nbPersonnesAttendu?: number
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
  tarifId?: number
  tarif?: TarifReponse
}

type ActiviteReponse = {
  id: number
  zoneId?: number
  libelle: string
  maxTerrain: number
  prix: number
  tarif?: TarifReponse
}

type Demande = {
  demandeId: number
  zones: []
  demandeur: string
  horaire: string
  type: string
  nbPersonnesAttendu: number
  conflits: number
  statut: string
  dateDemande: string
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
  currentViewName: planningView
  currentDateStart: any // TODO: Find a proper type
  currentDateEnd: any // TODO: Find a proper type
  currentWeek: number
  slotMinTime: string
  slotMaxTime: string
  scrollTime: string
}

type planningView = 'day' | 'week'

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
  extendedProps?: any,
  mode?: string
  organismeLabel?: string
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

type Tarif = {
  activite?: string
  titre?: string
  montant?: number
  niveauId?: number
  actif: boolean
  duree: number
  periodes: PeriodeTarif[]
}
type TarifReponse = {
  tarifId: number
  montant: number
}

type PeriodeTarif = {
  plageHoraireDebut: string,
  plageHoraireFin: string,
  dateDebut: string,
  dateFin: string,
  jours: boolean[]
}

type GroupeTarifParActivite = {
  activite: string,
  general?: GroupeTarifParNiveau
  exceptionnel?: GroupeTarifParNiveau
  special?: GroupeTarifParNiveau
  defaut?: GroupeTarifParNiveau
}
type GroupeTarifParNiveau = {
  tarifs: { id: number, niveau: number, libelle: string, type: string, prioriteMin: number, tarifs: [] }
  open: boolean
}


type index = number | string
