import { defaultHeaders, get, post, put } from './api.js'
import $fetch from './refreshToken.js'
import { useStorage } from '@vueuse/core'
import { upload } from "@api/upload";

export const getFitArenas = async (page = 1, query = '') => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/fit_arenas?page=${page}${query}`,
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

export const getFitArena = async (id) =>
  await get(`/api/fit_arenas/${id}`)

export const getFitArenaConfig = async (id) =>
  await get(`/api/fit_arenas/${id}/configuration`)

export const uploadMiniature = async (id, file) =>
  await upload(`${import.meta.env.VITE_API_URL}/api/fit_arenas/configuration`, { miniature: file, fitArena: id })

export const uploadBandeau = async (id, file) =>
  await upload(`${import.meta.env.VITE_API_URL}/api/fit_arenas/configuration`, { bandeau: file, fitArena: id })


export const uploadIconeService = async (service) =>
  await upload(`${import.meta.env.VITE_API_URL}/api/fit_arenas/service`, service)

export const putService = async (service) =>
  await put(`${import.meta.env.VITE_API_URL}/api/fit_arenas/service/${service.id}`, service)


export const postReseauSocial = async (rs) =>
  await upload(`${import.meta.env.VITE_API_URL}/api/fit_arenas/reseau-social`, rs)

export const putReseauSocial = async(rs) => await put(`${import.meta.env.VITE_API_URL}/api/fit_arenas/reseau-social/${rs.id}`, rs)

export const postFitArenas = async (fa) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/fit_arenas`,
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

export const updateFitarenas = async (fa, id) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/fit_arenas/${id}`,
    {
      method: 'put',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/ld+json',
        Authorization: 'Bearer ' + useStorage('token', '').value,
      },
      body: JSON.stringify(fa),
    }
  )
  if (response.status !== 200) throw response
  return response.json()
}

export const deleteFitArenas = async (id) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/fit_arenas/${id}`,
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
