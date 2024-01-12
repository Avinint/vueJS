import { defaultHeaders } from './api'
import $fetch from './refreshToken.js'
import { useStorage } from '@vueuse/core'
import { upload } from "@api/upload"

import { get } from './api.js'

// export async function getDemandes(fitArenaId: number, page = 1, idOrganisme: number, statutDemande: number): Promise<Demande[]> {
//   const response = await $fetch(
//     `${
//       import.meta.env.VITE_API_URL
//     }/api/fit_arena/${fitArenaId}/demandes?page=${page}&idOrganisme=${idOrganisme}&statutDemande=${statutDemande}`,
//     {
//       method: 'get',
//       headers: {
//         ...defaultHeaders,
//         'Content-Type': 'application/ld+json',
//         Authorization: 'Bearer ' + useStorage('token', '').value,
//       },
//     }
//   )
//   if (response.status !== 200) throw response
//   return response.json()
// }

export const getDemandes = async (query = {page: 1}) => {

  if (!query.idFA) {
    throw 'Requête invalide car la Fit Arena est inconnue.'
  }

  return (await get('/api/demande/liste', query)).demandesListe
}