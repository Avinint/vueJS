import { get } from './api.js'

export const getTarifs = async (query = { page: 1 }) => {

  if (!query.idFitArena) {
    throw 'Requête invalide car la Fit Arena est inconnue.'
  }

  // return (await get('/api/fitarena/tarifs', query))

  const data = [
    {
      "activite": "PADEL",
      "tarifs": [
        {
          "id" : 1,
          "niveau": 1,
          "type": "Tarifs exceptionnels",
          "tarifs": [
            {
              "id": 11,
              "priorite": 1,
              "actif": true,
              "nom": "Vacances journée 23/24",
              "tarif": "30 € / 60 min",
              "periodes": [
                {
                  "plage_horaire": "12:00 à 14:00",
                  "jours": ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"],
                  "date_debut": "12/12/23",
                  "date_fin": "12/12/24"
                },
                {
                  "plage_horaire": "16:00 à 19:00",
                  "jours": ["Sa", "Di"],
                  "date_debut": "01/01/24",
                  "date_fin": "01/10/24"
                }
              ]
            },
            {
              "id": 12,
              "priorite": 2,
              "actif": true,
              "nom": "Soirée",
              "tarif": "2 € / 60 min",
              "periodes": [
                {
                  "plage_horaire": "17:00 à 23:00",
                  "jours": ["Lu", "Ma", "Me", "Je", "Ve"],
                  "date_debut": "13/12/24",
                  "date_fin": "13/12/25"
                }
              ]
            }
          ]
        },
        // {
        //   "id" : 2,
        //   "niveau": 2,
        //   "type": "Tarifs spéciaux",
        //   "tarifs": [
        //     {
        //       "id": 13,
        //       "priorite": 1,
        //       "actif": true,
        //       "nom": "Vacances",
        //       "tarif": "12 € / 60 min",
        //       "periodes": [
        //         {
        //           "plage_horaire": "08:00 à 22:00",
        //           "jours": ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"],
        //           "date_debut": "01/01/23",
        //           "date_fin": "01/01/25"
        //         }
        //       ]
        //     },
        //     {
        //       "id": 14,
        //       "priorite": 2,
        //       "actif": true,
        //       "nom": "Début semaine",
        //       "tarif": "20 € / 60 min",
        //       "periodes": [
        //         {
        //           "plage_horaire": "17:00 à 23:00",
        //           "jours": ["Lu"],
        //           "date_debut": "10/10/23",
        //           "date_fin": "10/01/24"
        //         },
        //         {
        //           "plage_horaire": "18:00 à 21:00",
        //           "jours": ["Ma"],
        //           "date_debut": "09/09/23",
        //           "date_fin": "10/10/24"
        //         }
        //       ]
        //     }
        //   ]
        // },
        // {
        //   "id" : 3,
        //   "niveau": 3,
        //   "type": "Tarifs généraux",
        //   "tarifs": [
        //     {
        //       "id": 15,
        //       "priorite": 1,
        //       "actif": true,
        //       "nom": "Vacances journée 23/24",
        //       "tarif": "30 € / 60 min",
        //       "periodes": [
        //         {
        //           "plage_horaire": "12:00 à 14:00",
        //           "jours": ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"],
        //           "date_debut": "12/12/23",
        //           "date_fin": "01/10/24"
        //         }
        //       ]
        //     },
        //     {
        //       "id": 16,
        //       "priorite": 2,
        //       "actif": false,
        //       "nom": "Vacances Soirée 23/24",
        //       "tarif": "20 € / 60 min",
        //       "periodes": [
        //         {
        //           "plage_horaire": "17:00 à 23:00",
        //           "jours": ["Lu", "Ma", "Di"],
        //           "date_debut": "10/02/24",
        //           "date_fin": "10/12/25"
        //         },
        //         {
        //           "plage_horaire": "17:45 à 23:45",
        //           "jours": ["Lu", "Ma", "Di"],
        //           "date_debut": "13/09/22",
        //           "date_fin": "13/02/25"
        //         },
        //         {
        //           "plage_horaire": "11:00 à 23:00",
        //           "jours": ["Lu", "Ma", "Sa"],
        //           "date_debut": "10/10/23",
        //           "date_fin": "10/12/24"
        //         },
        //         {
        //           "plage_horaire": "17:00 à 23:00",
        //           "jours": ["Ma"],
        //           "date_debut": "04/04/23",
        //           "date_fin": "04/04/25"
        //         }
        //       ]
        //     }
        //   ]
        // },
        // {
        //   "id" : 4,
        //   "niveau": 4,
        //   "type": "Tarif par défaut",
        //   "tarifs": [
        //     {
        //       "id": 17,
        //       "priorite": 1,
        //       "actif": true,
        //       "nom": "Semaine 23/24",
        //       "tarif": "1 € / 60 min",
        //       "periodes": [
        //         {
        //           "plage_horaire": "08:00 à 20:00",
        //           "jours": ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"],
        //           "date_debut": "12/04/21",
        //           "date_fin": "12/04/25"
        //         }
        //       ]
        //     },
        //     {
        //       "id": 18,
        //       "priorite": 2,
        //       "actif": true,
        //       "nom": "WE 23/24",
        //       "tarif": "3 € / 60 min",
        //       "periodes": [
        //         {
        //           "plage_horaire": "08:00 à 20:00",
        //           "jours": ["Sa", "Di"],
        //           "date_debut": "01/01/24",
        //           "date_fin": "01/01/26"
        //         }
        //       ]
        //     }
        //   ]
        // }
      ]
    }
  ]

  return data
}