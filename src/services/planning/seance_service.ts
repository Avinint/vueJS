export const default_seance: Seance = {
    id: 0,
    type: "",
    selected_animateurs: [],
    animateurs: [],
    participants: [],
    groupes: [],
    dateHeureDebut: '00:00',
    dateHeureFin: '00:00',
}

export function parseSeance(id_creneau: number, animateurs: Animateur[], selected_animateurs: boolean[], groupes: Groupe[], selected_groupes: boolean[], seance: Seance): SeanceEditContract {

    const output_animateurs = [];
    for(const index in animateurs) {
        const animateur = animateurs[index];
        if(selected_animateurs[index]) {
            output_animateurs.push({id: animateur.id});
        } 
    }

    const output_groupes = [];
    for(const index in groupes) {
        const groupe = groupes[index];
        if(selected_groupes[index]) {
            output_groupes.push({id: groupe.id });
        }
    }

    return {
        idCreneau: id_creneau,
        dateHeureDebut: seance.dateHeureDebut,
        dateHeureFin: seance.dateHeureFin,
        animateurs: output_animateurs,
        groupes: output_groupes,
    }
}