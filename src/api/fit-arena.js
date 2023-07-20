import {defaultHeaders, get, post, put, upload} from './api.js'
import $fetch from './refreshToken.js'
import { useStorage } from '@vueuse/core'

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

export const getFitArenaConfig = async(id) => {
  return get(`${import.meta.env.VITE_API_URL}/api/fit_arenas/${id}/configuration`)
}

export const uploadMiniature = async(id, file) => {

  const formData = new FormData()
  formData.append('miniature', file)
  formData.append('fitArena', id)

  return await upload(`${import.meta.env.VITE_API_URL}/api/fit_arenas/configuration`, formData)
}

export const uploadBandeau = async(id, file) => {

  const formData = new FormData()
  formData.append('bandeau', file)
  formData.append('fitArena', id)

  return await upload(`${import.meta.env.VITE_API_URL}/api/fit_arenas/configuration`, formData)
}

export const uploadIconeService = async(service) => {

    const formData = new FormData()
    formData.append('icone', service.icone)
    formData.append('fitArenaId', service.fitArenaId)
    formData.append('libelle', service.libelle)

    if (service.id) {
        formData.append('id', service.id)
    }

    return await upload(`${import.meta.env.VITE_API_URL}/api/fit_arenas/service`, formData)
}

export const postReseauSocial = async (rs) => {
  const formData = new FormData()
  formData.append('fitArenaId', rs.fitArenaId)
  formData.append('libelle', rs.libelle)
  formData.append('url', rs.url)

  if (rs.iconeId) { formData.append('iconeId', rs.iconeId) }
  if (rs.id) { formData.append('id', rs.id) }

  return await upload(`${import.meta.env.VITE_API_URL}/api/fit_arenas/reseau-social`, formData)
}

export const putReseauSocial = async(rs) => {
    return await put(`${import.meta.env.VITE_API_URL}/api/fit_arenas/reseau-social/${rs.id}`, rs)
}

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

export const updateFitarenas = async (client, id) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/fit_arenas/${id}`,
    {
      method: 'put',
      headers: {
        ...defaultHeaders,
        // 'Content-Type': 'application/merge-patch+json',
        'Content-Type': 'application/ld+json',
        Authorization: 'Bearer ' + useStorage('token', '').value,
      },
      body: JSON.stringify(client),
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
