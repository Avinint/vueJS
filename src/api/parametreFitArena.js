import { defaultHeaders } from './api.js'
import $fetch from './refreshToken.js'
import { useStorage } from '@vueuse/core'

export const getParametreFitArena = async (page = 1, query = '') => {
  const response = await $fetch(
    `${
      import.meta.env.VITE_API_URL
    }/api/parametre_fit_arenas?page=${page}${query}`,
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

export const getParametreFitArenaById = async (id) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/parametre_fit_arenas/${id}`,
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

export const postParametreFitArena = async (param) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/parametre_fit_arenas`,
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

export const updateParametreFitArena = async (param, id) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/parametre_fit_arenas/${id}`,
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

export const deleteParametreFitArena = async (id) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/parametre_fit_arenas/${id}`,
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

export const patchParametreFitArena = async (id) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/parametre_fit_arenas/${id}`,
    {
      method: 'patch',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/merge-patch+json',
        Authorization: 'Bearer ' + useStorage('token', '').value,
      },
    }
  )
  if (response.status !== 200) throw response
  return {}
}
