import { defaultHeaders } from './api.js'
import $fetch from './refreshToken.js'
import { useStorage } from '@vueuse/core'

export const getParametreActivite = async (page = 1) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/parametre_activites?page=${page}`,
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

export const getParametreActiviteById = async (id) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/parametre_activites/${id}`,
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

export const postParametreActivite = async (param) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/parametre_activites`,
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

export const updateParametreActivite = async (param, id) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/parametre_activites/${id}`,
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

export const deleteParametreActivite = async (id) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/parametre_activites/${id}`,
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

export const patchParametreActivite = async (param, id) => {
  const response = await $fetch(

    `${import.meta.env.VITE_API_URL}/api/parametre_activites/${id}`,
    {
      method: 'patch',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/merge-patch+json',
        Authorization: 'Bearer ' + useStorage('token', '').value,
      },
      body: JSON.stringify(param),
    }
  )
  if (response.status !== 200) throw response
  return {}
}
