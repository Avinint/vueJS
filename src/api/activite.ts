import { defaultHeaders } from './api'
import $fetch from './refreshToken.js'
import { useStorage } from '@vueuse/core'
import { upload } from "@api/upload"

export async function getActivites(fitArenaId: number, page = 1, query = ''): Promise<Activite[]> {
  const response = await $fetch(
    `${
      import.meta.env.VITE_API_URL
    }/api/fit_arena/${fitArenaId}/activites?page=${page}${query}`,
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
  return response.json()
}

export const postActivites = async (fa) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/activites`,
    {
      method: 'post',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/ld+json',
        Authorization: 'Bearer ' + useStorage('token', '').value,
      },
      body: JSON.stringify(fa),
    }
  )
  if (response.status !== 201) throw response
  return response.json()
}

export const uploadActivite = async (activite, id) => {

    activite.id = id
    const url = activite.id ? 'maj' : 'creer'

    return upload(`${import.meta.env.VITE_API_URL}/api/activite/${url}`, activite)
}

export const postActiviteWithIcone = async (fa) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/activite/creer`,
    {
      method: 'post',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + useStorage('token', '').value,
      },
      body: JSON.stringify(fa),
    }
  )
  if (response.status !== 201) throw response
  return response.json()
}

export const updateActivites = async (activite, id) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/activites/${id}`,
    {
      method: 'put',
      headers: {
        ...defaultHeaders,
        // 'Content-Type': 'application/merge-patch+json',
        'Content-Type': 'application/ld+json',
        Authorization: 'Bearer ' + useStorage('token', '').value,
      },
      body: JSON.stringify(activite),
    }
  )
  if (response.status !== 200) throw response
  return response.json()
}

export const patchActivites = async (activite, id) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/activites/${id}`,
    {
      method: 'patch',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/merge-patch+json',
        Authorization: 'Bearer ' + useStorage('token', '').value,
      },
      body: JSON.stringify(activite),
    }
  )
  if (response.status !== 200) throw response
  return response.json()
}

export const deleteActivites = async (id) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/activites/${id}`,
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
  return {}
}
