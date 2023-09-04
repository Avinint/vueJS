import { defaultHeaders } from './api'
import $fetch from './refreshToken.js'
import { useStorage } from '@vueuse/core'

export async function getPlanning(
  debut: number,
  fit_arena: number,
  duree: number,
  zone: string,
  organisme?: number
): Promise<Planning> {
  const api_url = import.meta.env.VITE_API_URL

  const url = new URL(`${api_url}/api/planning`)
  url.searchParams.append('debut', debut.toString())
  url.searchParams.append('fit_arena', fit_arena.toString())
  url.searchParams.append('duree', duree.toString())
  url.searchParams.append('zones', `[${zone}]`)

  if(organisme)
    url.searchParams.append('organisme', organisme.toString());

  const response = await $fetch(url.toString(), {
    method: 'get',
    headers: {
      ...defaultHeaders,
      'Content-Type': 'application/ld+json',
      Authorization: 'Bearer ' + useStorage('token', '').value,
    },
  })
  if (response.status !== 200) throw response
  return response.json()
}

export async function postCreneau(
  contract: DemandeCreneauEditContract
): Promise<DemandeCreneauEditResponse> {
  const response = await $fetch(`${import.meta.env.VITE_API_URL}/api/creneau/demandes`, {
    method: 'post',
    headers: {
      ...defaultHeaders,
      'Content-Type': 'application/ld+json',
      Authorization: 'Bearer ' + useStorage('token', '').value,
    },
    body: JSON.stringify(contract),
  })
  if (response.status !== 201) throw response
  return response.json()
}

export async function updateCreneau(
  id: number,
  contract: DemandeCreneauEditContract
): Promise<DemandeCreneauEditResponse> {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/creneau/demandes/${id}`,
    {
      method: 'put',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/ld+json',
        Authorization: 'Bearer ' + useStorage('token', '').value,
      },
      body: JSON.stringify(contract),
    }
  )
  if (response.status !== 200) throw response
  return response.json()
}

export const deleteCreneau = async (id: number): Promise<void> => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/creneau/${id}?mode=occurence`,
    {
      method: 'delete',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/merge-patch+json',
        Authorization: 'Bearer ' + useStorage('token', '').value,
      },
    }
  )
  if (response.status !== 204) throw response
}
