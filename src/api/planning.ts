import { defaultHeaders } from './api'
import $fetch from './refreshToken.js'

export async function getPlanning(debut: number, fit_arena: number, duree: number, zone: string): Promise<Planning> {
  const api_url = import.meta.env.VITE_API_URL

  const response = await $fetch(
    `${api_url}/api/planning?debut=${debut}&fit_arena=${fit_arena}&duree=${duree}&zones=[${zone}]`,
    {
      method: 'get',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/ld+json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    }
  )
  if (response.status !== 200) throw response
  return response.json()
}

export async function postCreneau(contract: CreneauEditContract): Promise<CreneauEditResponse> {
  const response = await $fetch(`${import.meta.env.VITE_API_URL}/api/creneau`, {
    method: 'post',
    headers: {
      ...defaultHeaders,
      'Content-Type': 'application/ld+json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
    body: JSON.stringify(contract),
  })
  if (response.status !== 201) throw response
  return response.json()
}

export async function updateCreneau(id: number, contract: CreneauEditContract): Promise<CreneauEditResponse> {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/creneau/${id}?mode=occurence`,
    {
      method: 'put',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/ld+json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify(contract),
    }
  )
  if (response.status !== 200) throw response
  return response.json()
}

export const deleteCreneau = async (id: number): Promise<void> => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/creneau/${id}`,
    {
      method: 'delete',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/merge-patch+json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    }
  )
  if (response.status !== 204) throw response
}
