import { defaultHeaders } from './api.js'
import $fetch from './refreshToken.js'
import { useStorage } from '@vueuse/core'

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
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/creneau/demandes/verifier`,
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

export async function updateCreneauDemande(contract: DemandeEditContract, id: number): Promise<CreneauDemandePostResponse> {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/creneau/${id}/demandes?mode=occurence`,
    {
      method: 'put',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + useStorage('token', '').value,
      },
      body: JSON.stringify(contract),
    }
  )
  if (response.status !== 200) throw response
  return response.json()
}

export async function deleteCreneauDemande(id: number) {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/demande/${id}/annuler`,
    {
      method: 'put',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/ld+json',
        Authorization: 'Bearer ' + useStorage('token', '').value,
      },
    }
  )
  if (response.status !== 200) throw response.json()
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