import { defaultHeaders } from './api'
import $fetch from './refreshToken.js'
import { useStorage } from '@vueuse/core'
import { upload } from "@api/upload"

export async function getDemandes(fitArenaId: number, page = 1, query = ''): Promise<Demande[]> {
  const response = await $fetch(
    `${
      import.meta.env.VITE_API_URL
    }/api/fit_arena/${fitArenaId}/demandes?page=${page}${query}`,
    {
      method: 'get',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/ld+json',
        Authorization: 'Bearer ' + useStorage('token', '').value,
      },
    }
  )
  if (response.status !== 200) throw response
  /**let resultat = [
    {
      demandeId: 1,
      demandeur: 'La Fifa',
      dateDemande: '21/12/2023',
      zones: [113, 114],
      horaire: '09H00 - 10H00',
      type: 'Créneau unique',
      nbPersonnesAttendu: 12,
      conflits: 1,
      statut: 'Demande acceptée'
    },
    {
      demandeId: 2,
      demandeur: 'OM',
      dateDemande: '09/11/2023',
      zones: [113],
      horaire: '16H00 - 18H00',
      type: 'Récurrence',
      nbPersonnesAttendu: 34,
      conflits: 0,
      statut: 'Demande refusée'
    }
  ];
  return resultat;**/
  return response.json()
}

