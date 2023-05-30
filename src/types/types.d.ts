type Creneau = {
    id?: number;
    activites: Activite[];
    creneauType: number;
    zoneId: number;
    titre: string;
    date: string;
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
}

type Activite = {
    activiteId: number;
    zoneId: number;
    libelle: string;
    maxTerrain: number;
    prix: number;
}