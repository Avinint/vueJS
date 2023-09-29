import { defaultHeaders, patch } from './api.js'
import $fetch from './refreshToken.js'
import { useStorage } from '@vueuse/core'

export const getParametreZone = async (page = 1) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/parametre_zones?page=${page}`,
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

export const getParametreZoneById = async (id) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/parametre_zones/${id}`,
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

export const postParametreZone = async (param) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/parametre_zones`,
    {
      method: 'post',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/ld+json',
        Authorization: 'Bearer ' + useStorage('token', '').value,
      },
      body: JSON.stringify(param),
    }
  )
  if (response.status !== 201) throw response
  return response.json()
}

export const updateParametreZone = async (param, id) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/parametre_zones/${id}`,
    {
      method: 'put',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/ld+json',
        Authorization: 'Bearer ' + useStorage('token', '').value,
      },
      body: JSON.stringify(param),
    }
  )
  if (response.status !== 200) throw response
  return response.json()
}

export const deleteParametreZone = async (id) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/parametre_zones/${id}`,
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

export const patchParametreZone = async (param, id) =>
  await patch(`/api/parametre_zones/${id}`, param)
