type Creneau = {
    id?: number;
    activites: Activite[];
    creneauType: number;
    type: number;
    titre: string;
    date: string;
    dateDebut: string,
    dateSortie: string,
    dateFinCreneau: string,
    heureDebut: string, // "14:30:00;
    heureFin: string, // "14:30:00;
    dureeActivite: number, // 5;
    dureeInterCreneau: number;
    description: string;
    organisme: number;
    animateurLabellise: number;
    niveauPratique: number;
    tarifHoraire: number;
    nbParticipants: number;
    zones: number[];
    zoneId?: number;
    mode: string | null;
    seances: Seance[];
}

type Zone = {
    id: number,
    libelle: string,
}

type CreneauOGEditContract = {
    creneauType: 2;
    zoneId: number;
    titre: string;
    date: string;
    heureDebut: string;
    heureFin: string;
    dureeActivite: number;
    dureeInterCreneau: number;
    description: string;
    organisme: number;
}

// POST // PUT
type CreneauEditContract = {
    creneauType: number,
    zoneId: number,
    activites: { activiteId: number, tarif: number }[],
    titre: string,
    date: string,
    heureDebut: string,
    heureFin: string,
    dureeActivite: number,
    dureeInterCreneau: number,
    description: string,
    organisme: number,
    animateurLabellise: number,
    niveauPratique: number,
    tarifHoraire: number,
    nbParticipants: number,
}

type SeanceEditContract = {
    dateHeureDebut: string;
    dateHeureFin: string;
    idCreneau: number;
    animateurs: { id: number }[];
}

type CreneauEditResponse = {
    creneaux: Creneau[];
}

type SeanceEditResponse = {
    idReservationParent: number;
    reservation: Seance;
    qrCode: string;
}

enum CreneauType {
    GP = 1, 
    OG = 2, 
    AC = 3,
}

type Activite = {
    activiteId: number;
    zoneId?: number;
    libelle: string;
    maxTerrain: number;
    prix: number;
}

type PlanningFilters = {
    debut: number;
    fit_arena: number;
    duree: number;
    zone: number[];
}

type Planning = {
  creneaux: Creneau[];
  filters: PlanningFilters; 
  activites: Activite[],
  currentViewName: string,
  currentDateStart: any,    // TODO: Find a proper type
  currentDateEnd: any,      // TODO: Find a proper type
  currentWeek: number,
  slotMinTime: string,
  slotMaxTime: string,
}

type Organisme = {
    id: number,
    libelle: string,
}

type CalendarEvent = {
    id: number,
    start: string,
    end: string,
    title: string,
    resourceIds: number[],
    extendedProps?: any
}

type Participant = {
    id: number,
    idUser: number,
    nom: string,
    prenom: string,
    organisateur: boolean,
    statut: string,
}

type Animateur = {
    id: number,
    idUser: number,
    nom: string,
    prenom: string,
    organisateur: boolean,
    statut: string,
    email: string,
    telephone: string,
    titulaireCarte: boolean,
}

type Seance = {
    id: number,
    dateHeureDebut: string,
    dateHeureFin: string,
    type: string,
    participants: Participant[],
    animateurs: Animateur[],
    selected_animateurs: number[],
}