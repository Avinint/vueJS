type Creneau = {
    id?: number;
    activites: Activite[];
    creneauType: number;
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

type CreneauEditResponse = {
    creneaux: Creneau[];
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