import { defaultHeaders, del, get, patch, post, put } from './api.js'
import $fetch from './refreshToken.js'
import { useStorage } from '@vueuse/core'

export const getParametreFitArena = async (query = {page: 1}) => {
  return await get('/api/parametre_fit_arenas', query)
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
  return await post(`${import.meta.env.VITE_API_URL}/api/parametre_fit_arenas`, param)
}

export const updateParametreFitArena = async (param, id) => {
  return await put(`${import.meta.env.VITE_API_URL}/api/parametre_fit_arenas/${id}`, param)
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

export const patchParametreFitArena = async (param, id) => {
   await patch(`${import.meta.env.VITE_API_URL}/api/parametre_fit_arenas/${id}`, param)
}

export const patchParametreFitArenaProfil = async (param, id) => {
  await patch(`${import.meta.env.VITE_API_URL}/api/parametre_fit_arena_profils/${id}`, param)
}

export const putParametreFitArenaProfil = async (param, id) => {
  await put(`${import.meta.env.VITE_API_URL}/api/parametre_fit_arena_profils/${id}`, param)
}

export const postParametreFitArenaProfil = async (param) => {
  await post(`${import.meta.env.VITE_API_URL}/api/parametre_fit_arena_profils`, param)
}

export const deleteParametreFitArenaProfil = async (id) => {
   await del(`${import.meta.env.VITE_API_URL}/api/parametre_fit_arena_profils/${id}`)
}