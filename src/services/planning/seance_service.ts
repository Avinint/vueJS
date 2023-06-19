export const default_seance: Seance = {
    id: 0,
    type: "",
    selected_animateurs: [],
    animateurs: [],
    participants: [],
    dateHeureDebut: '00:00',
    dateHeureFin: '00:00',
}

export function parseSeance(id_creneau: number, animateurs: Animateur[], seance: Seance): SeanceEditContract {

    const output_animateurs = [];
    for(const index in animateurs) {
        const animateur = animateurs[index];
        if(seance.selected_animateurs[index]) {
            output_animateurs.push({id: animateur.id});
        } 
    }

    return {
        idCreneau: id_creneau,
        dateHeureDebut: seance.dateHeureDebut,
        dateHeureFin: seance.dateHeureFin,
        animateurs: output_animateurs,
    }
}