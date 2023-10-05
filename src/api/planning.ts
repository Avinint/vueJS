import {defaultHeaders, get} from './api'
import $fetch from './refreshToken.js'
import { useStorage } from '@vueuse/core'

export async function getPlanning(
  debut: string,
  fit_arena: number,
  duree: number,
  zone: string,
  organisme?: number
): Promise<Planning> {

  let params = {
    debut:     debut,
    fit_arena: fit_arena,
    duree:     duree,
    zones:     `[${zone}]`,
    organisme: organisme ?? null
  }

  return await get(`/api/planning`, params)
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
    `${import.meta.env.VITE_API_URL}/api/creneau/${id}/demandes`,
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
