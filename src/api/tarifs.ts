import { get, patch } from './api.js'

export const getTarifs = async (idFitArena) => {

  return await get(`${import.meta.env.VITE_API_URL}/api/fitarena/${idFitArena}/tarifs`)

  // const data = [
  //   {
  //     "activite": "PADEL",
  //     "tarifs": [
  //       {
  //         "id" : 1,
  //         "niveau": 1,
  //         "type": "Tarifs exceptionnels",
  //         "tarifs": [
  //           {
  //             "id": 11,
  //             "priorite": 1,
  //             "actif": true,
  //             "nom": "Vacances journée 23/24",
  //             "tarif": "3000",
  //             "duree": "60",
  //             "periodes": [
  //               {
  //                 "plage_horaire_debut": "12:00:00",
  //                 "plage_horaire_fin": "14:00:00",
  //                 "jours": ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"],
  //                 "date_debut": "12/12/23",
  //                 "date_fin": "12/12/24"
  //               },
  //               {
  //                 "plage_horaire_debut": "16:00:00",
  //                 "plage_horaire_fin": "19:00:00",
  //                 "jours": ["Sa", "Di"],
  //                 "date_debut": "01/01/24",
  //                 "date_fin": "01/10/24"
  //               }
  //             ]
  //           },
  //           {
  //             "id": 12,
  //             "priorite": 2,
  //             "actif": true,
  //             "nom": "Soirée",
  //             "tarif": "200",
  //             "duree": "60",
  //             "periodes": [
  //               {
  //                 "plage_horaire_debut": "17:00:00",
  //                 "plage_horaire_fin": "23:00:00",
  //                 "jours": ["Lu", "Ma", "Me", "Je", "Ve"],
  //                 "date_debut": "13/12/24",
  //                 "date_fin": "13/12/25"
  //               }
  //             ]
  //           }
  //         ]
  //       },
  //       {
  //         "id" : 2,
  //         "niveau": 2,
  //         "type": "Tarifs spéciaux",
  //         "tarifs": [
  //           {
  //             "id": 13,
  //             "priorite": 1,
  //             "actif": true,
  //             "nom": "Vacances",
  //             "tarif": "1200",
  //             "duree": "60",
  //             "periodes": [
  //               {
  //                 "plage_horaire_debut": "08:00:00",
  //                 "plage_horaire_fin": "22:00:00",
  //                 "jours": ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"],
  //                 "date_debut": "01/01/23",
  //                 "date_fin": "01/01/25"
  //               }
  //             ]
  //           },
  //           {
  //             "id": 14,
  //             "priorite": 2,
  //             "actif": true,
  //             "nom": "Début semaine",
  //             "tarif": "2000",
  //             "duree": "60",
  //             "periodes": [
  //               {
  //                 "plage_horaire_debut": "17:00:00",
  //                 "plage_horaire_fin": "22:00:00",
  //                 "jours": ["Lu"],
  //                 "date_debut": "10/10/23",
  //                 "date_fin": "10/01/24"
  //               },
  //               {
  //                 "plage_horaire_debut": "18:00:00",
  //                 "plage_horaire_fin": "21:00:00",
  //                 "jours": ["Ma"],
  //                 "date_debut": "09/09/23",
  //                 "date_fin": "10/10/24"
  //               }
  //             ]
  //           }
  //         ]
  //       },
  //       {
  //         "id" : 3,
  //         "niveau": 3,
  //         "type": "Tarifs généraux",
  //         "tarifs": [
  //           {
  //             "id": 15,
  //             "priorite": 1,
  //             "actif": true,
  //             "nom": "Vacances journée 23/24",
  //             "tarif": "3000",
  //             "duree": "60",
  //             "periodes": [
  //               {
  //                 "plage_horaire_debut": "12:00:00",
  //                 "plage_horaire_fin": "14:00:00",
  //                 "jours": ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"],
  //                 "date_debut": "12/12/23",
  //                 "date_fin": "01/10/24"
  //               }
  //             ]
  //           },
  //           {
  //             "id": 16,
  //             "priorite": 2,
  //             "actif": false,
  //             "nom": "Vacances Soirée 23/24",
  //             "tarif": "2000",
  //             "duree": "60",
  //             "periodes": [
  //               {
  //                 "plage_horaire_debut": "12:00:00",
  //                 "plage_horaire_fin": "14:00:00",
  //                 "jours": ["Lu", "Ma", "Di"],
  //                 "date_debut": "10/02/24",
  //                 "date_fin": "10/12/25"
  //               },
  //               {
  //                 "plage_horaire_debut": "18:00:00",
  //                 "plage_horaire_fin": "19:45:00",
  //                 "jours": ["Lu", "Ma", "Di"],
  //                 "date_debut": "13/09/22",
  //                 "date_fin": "13/02/25"
  //               },
  //               {
  //                 "plage_horaire_debut": "20:00:00",
  //                 "plage_horaire_fin": "20:30:00",
  //                 "jours": ["Lu", "Ma", "Sa"],
  //                 "date_debut": "10/10/23",
  //                 "date_fin": "10/12/24"
  //               },
  //               {
  //                 "plage_horaire_debut": "23:00:00",
  //                 "plage_horaire_fin": "23:45:00",
  //                 "jours": ["Ma"],
  //                 "date_debut": "04/04/23",
  //                 "date_fin": "04/04/25"
  //               }
  //             ]
  //           }
  //         ]
  //       },
  //       {
  //         "id" : 4,
  //         "niveau": 4,
  //         "type": "Tarif par défaut",
  //         "tarifs": [
  //           {
  //             "id": 17,
  //             "priorite": 1,
  //             "actif": true,
  //             "nom": "Semaine 23/24",
  //             "tarif": "100",
  //             "duree": "60",
  //             "periodes": [
  //               {
  //                 "plage_horaire_debut": "08:00:00",
  //                 "plage_horaire_fin": "20:00:00",
  //                 "jours": ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"],
  //                 "date_debut": "12/04/21",
  //                 "date_fin": "12/04/25"
  //               }
  //             ]
  //           },
  //           {
  //             "id": 18,
  //             "priorite": 2,
  //             "actif": true,
  //             "nom": "WE 23/24",
  //             "tarif": "300",
  //             "duree": "60",
  //             "periodes": [
  //               {
  //                 "plage_horaire_debut": "01:00:00",
  //                 "plage_horaire_fin": "23:00:00",
  //                 "jours": ["Sa", "Di"],
  //                 "date_debut": "01/01/24",
  //                 "date_fin": "01/01/26"
  //               }
  //             ]
  //           }
  //         ]
  //       }
  //     ]
  //   }
  // ]

  // return data
}

export const getTarif = async (idTarif) => {
  const data = {
    "titre": "WE HP 23/24 S2",
    "actif": true,
    "activite": 10,
    "montant": 3200,
    "duree": "60",
    "niveau": 3, // "Niv 3: Tarif général"
    "plagesHorairesEtPeriodes": [
      {
        "plageHoraire": {
          "debut": "10:00",
          "fin": "13:00"
        },
        "periode": {
          "debut": "01/01/2024",
          "fin": "31/08/2024"
        },
        "joursEffet": ["Ve", "Sa", "Di"]
      }
    ]
  }
  // return data
  return await get(`${import.meta.env.VITE_API_URL}/tarif/${idTarif}`)
}
export const patchTarif = async (idFitArena, idTarif, tarif) => {
  return await patch(`${import.meta.env.VITE_API_URL}/fitarena/${idFitArena}/tarif/${idTarif}`, tarif)
}