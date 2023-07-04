import { defaultHeaders } from './api.js'
import $fetch from './refreshToken.js'
import { useStorage } from '@vueuse/core'

export const getTypeZone = async (page = 1, query = '') => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/type_zones?page=${page}${query}`,
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

export const postTypeZone = async (typeZone) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/type_zones`,
    {
      method: 'post',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/ld+json',
        Authorization: 'Bearer ' + useStorage('token', '').value,
      },
      body: JSON.stringify(typeZone),
    }
  )
  if (response.status !== 201) throw response
  return response.json()
}

export const updateTypeZone = async (typeZone, id) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/type_zones/${id}`,
    {
      method: 'put',
      headers: {
        ...defaultHeaders,
        // 'Content-Type': 'application/merge-patch+json',
        'Content-Type': 'application/ld+json',
        Authorization: 'Bearer ' + useStorage('token', '').value,
      },
      body: JSON.stringify(typeZone),
    }
  )
  if (response.status !== 200) throw response
  return response.json()
}

export const deleteTypeZone = async (id) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/type_zones/${id}`,
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
