import {defaultHeaders, get, post, put} from './api.js'
import $fetch from './refreshToken.js'
import { useStorage } from '@vueuse/core'


export async function getDetailsDemande(id: number): Promise<[]> {
    return get('/api/demande/' + id)
}

export async function rejeterDemande(id: number) {
    return put(`/api/demande/${id}/refuser`)
}

export async function accepterDemande(id: number) {
    return put(`/api/demande/${id}/accepter`)
}

export const postCommentaire = async (contract: { commentaire: string }, id: number): Promise<{}> =>
    put(`/api/creneau/demande/${id}/commentaire`, contract)

export async function postCreneauDemande(contract: DemandeEditContract): Promise<CreneauDemandePostResponse> {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/creneau/demandes`,
    {
      method: 'post',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/ld+json',
        Authorization: 'Bearer ' + useStorage('token', '').value,
      },
      body: JSON.stringify(contract),
    }
  )
  if (response.status !== 201) throw response
  return response.json()
}

export async function postCreneauVerifDemande(contract: DemandeEditContract): Promise<CreneauDemandePostResponse> {
    return await post(`/api/creneau/demandes/verifier`, contract) as CreneauDemandePostResponse
}

export async function updateCreneauDemande(contract: DemandeEditContract, id: number, mode="occurence"): Promise<CreneauDemandePostResponse> {
    return await put(`/api/creneau/${id}/demandes?mode=${mode}`, contract) as CreneauDemandePostResponse
}

export async function deleteCreneauDemande(event: object, id: number) {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/demande/${id}/annuler`,
    {
      method: 'put',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + useStorage('token', '').value,
      },
      body: JSON.stringify(event),
    }
  )
  if (response.status !== 200) throw response
  return response.json()
}

export async function deleteGroup(groupe_id: number) {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/groupes/${groupe_id}`,
    {
      method: 'delete',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/ld+json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    }
  )

  if (response.status !== 204) throw response.json()
}