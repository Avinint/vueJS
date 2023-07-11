import { defaultHeaders } from './api.js'
import $fetch from './refreshToken.js'
import { useStorage } from '@vueuse/core'

export const getParametres = async (page = 1) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/parametres?page=${page}`,
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

export const getParametresById = async (id) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/parametres/${id}`,
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

export const postParametres = async (param) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/parametres`,
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

export const updateParametres = async (param, id) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/parametres/${id}`,
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

export const deleteParametres = async (id) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/parametres/${id}`,
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

export const patchParametres = async (id) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/parametres/${id}`,
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
