import { useStorage } from '@vueuse/core'
import {defaultHeaders, get} from './api.js'
import $fetch from './refreshToken.js'

export const selectOrganismes = async () => {
  return await get(`${import.meta.env.VITE_API_URL}/api/select/organismes`)
}

export async function getOrganismes(page = 1, query = ''): Promise<Organisme[]> {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/organismes?page=${page}${query}`,
    {
      method: 'get',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + useStorage('token', '').value,
      }
    }
  )
  if (response.status !== 200) throw response
  return response.json()
}

export async function getOrganismesSelect(page = 1, query = ''): Promise<Organisme[]> {
  const response = await $fetch(
  `${import.meta.env.VITE_API_URL}/api/select/organismes?${query}`,
    {
      method: 'get',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + useStorage('token', '').value,
      }
    }
  )
  if (response.status !== 200) throw response
  return response.json()
}

export async function getOrganismesParClient(id: number): Promise<Organisme[]> {

    return await get(`${import.meta.env.VITE_API_URL}/api/clients/${id}/organismes`)
}

export const postOrganismes = async (organisme) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/organismes`,
    {
      method: 'post',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + useStorage('token', '').value,
      },
      body: JSON.stringify(organisme.value),
    }
  )
  if (response.status !== 201) throw response
  return response.json()
}

export const updateOrganismes = async (organisme, id) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/organismes/${id}`,
    {
      method: 'put',
      headers: {
        ...defaultHeaders,
        // 'Content-Type': 'application/merge-patch+json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + useStorage('token', '').value,
      },
      body: JSON.stringify(organisme.value),
    }
  )
  if (response.status !== 200) throw response
  return response.json()
}

export const deleteOrganismes = async (id) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/organismes/${id}`,
    {
      method: 'delete',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + useStorage('token', '').value,
      },
    }
  )
  if (response.status !== 204) throw response
  return {}
}
