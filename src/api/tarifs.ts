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
          "niveau": 1,
          "type": "Tarifs exceptionnels",
          "tarifs": [
            {
              "priorite": 1,
              "actif": true,
              "nom": "Vacances journée 23/24",
              "tarif": "30 € / 60 min",
              "periodes": [
                {
                  "plage_horaire": "12:00 à 14:00",
                  "jours": ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"],
                  "date_debut": "12/12/23",
                  "date_fin": "31/12/23"
                },
                {
                  "plage_horaire": "19:00 à 21:00",
                  "jours": ["Sa", "Di"],
                  "date_debut": "01/01/24",
                  "date_fin": "01/01/25"
                },
                {
                  "plage_horaire": "21:15 à 22:00",
                  "jours": ["Sa"],
                  "date_debut": "01/01/24",
                  "date_fin": "01/01/25"
                }
              ]
            },
            {
              "priorite": 2,
              "actif": false,
              "nom": "Vacances Soirée 23/24",
              "tarif": "20 € / 60 min",
              "periodes": [
                {
                  "plage_horaire": "17:00 à 23:00",
                  "jours": ["Lu", "Ma", "Me", "Je", "Ve"],
                  "date_debut": "01/02/24",
                  "date_fin": "01/03/24"
                }
              ]
            }
          ]
        },
        {
          "niveau": 2,
          "type": "Tarifs spéciaux",
          "tarifs": [
            {
              "priorite": 1,
              "actif": true,
              "nom": "Vacances journée 23/24",
              "tarif": "30 € / 60 min",
              "periodes": [
                {
                  "plage_horaire": "12:00 à 14:00",
                  "jours": ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"],
                  "date_debut": "01/07/24",
                  "date_fin": "01/09/24"
                },
              ]
            },
            {
              "priorite": 2,
              "actif": true,
              "nom": "Vacances Soirée 23/24",
              "tarif": "20 € / 60 min",
              "periodes": [
                {
                  "plage_horaire": "17:00 à 23:00",
                  "jours": ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"],
                  "date_debut": "02/02/24",
                  "date_fin": "02/02/25"
                },
                {
                  "plage_horaire": "11:00 à 12:00",
                  "jours": ["Lu", "Ma", "Me"],
                  "date_debut": "02/05/24",
                  "date_fin": "02/08/24"
                },
              ]
            }
          ]
        },
        {
          "niveau": 3,
          "type": "Tarifs généraux",
          "tarifs": [
            {
              "priorite": 1,
              "actif": true,
              "nom": "Vacances journée 23/24",
              "tarif": "30 € / 60 min",
              "periodes": [
                {
                  "plage_horaire": "12:00 à 14:00",
                  "jours": ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"],
                  "date_debut": "01/12/24",
                  "date_fin": "21/12/24"
                },
                {
                  "plage_horaire": "22:00 à 23:30",
                  "jours": ["Sa", "Di"],
                  "date_debut": "01/11/24",
                  "date_fin": "18/11/24"
                },
              ]
            },
            {
              "priorite": 2,
              "actif": false,
              "nom": "Vacances Soirée 23/24",
              "tarif": "20 € / 60 min",
              "periodes": [
                {
                  "plage_horaire": "17:00 à 23:00",
                  "jours": ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"],
                  "date_debut": "12/12/24",
                  "date_fin": "10/12/25"
                },
              ]
            },
            {
              "priorite": 3,
              "actif": false,
              "nom": "Vacances 23/24",
              "tarif": "20 € / 60 min",
              "periodes": [
                {
                  "plage_horaire": "08:00 à 13:00",
                  "jours": ["Lu"],
                  "date_debut": "01/01/24",
                  "date_fin": "01/01/25"
                },
                {
                  "plage_horaire": "13:00 à 15:30",
                  "jours": ["Lu"],
                  "date_debut": "01/01/25",
                  "date_fin": "01/01/26"
                }
              ]
            }
          ]
        },
        {
          "niveau": 4,
          "type": "Tarif par défaut",
          "tarifs": [
            {
              "priorite": 1,
              "actif": true,
              "nom": "Vacances",
              "tarif": "12 € / 60 min",
              "periodes": [
                {
                  "plage_horaire": "12:00 à 14:00",
                  "jours": ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"],
                  "date_debut": "Date début période 1",
                  "date_fin": "Date fin période 1"
                }
              ]
            }
          ]
        }
      ]
    }
  ]

  return data
}