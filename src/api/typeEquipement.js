import { defaultHeaders } from './api.js'
import $fetch from './refreshToken.js'

export const getTypeEquipements = async (page = 1, query = '') => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/type_equipements?page=${page}${query}`,
    {
      method: 'get',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/ld+json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    }
  )
  if (response.status !== 200) throw response
  return response.json()
}

export const postTypeEquipements = async (typeEquipement) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/type_equipements`,
    {
      method: 'post',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/ld+json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify(typeActivite),
    }
  )
  if (response.status !== 201) throw response
  return response.json()
}

export const updateTypeEquipements = async (typeEquipement, id) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/type_equipements/${id}`,
    {
      method: 'put',
      headers: {
        ...defaultHeaders,
        // 'Content-Type': 'application/merge-patch+json',
        'Content-Type': 'application/ld+json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify(typeEquipement),
    }
  )
  if (response.status !== 200) throw response
  return response.json()
}

export const deleteTypeEquipements = async (id) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/type_equipements/${id}`,
    {
      method: 'delete',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/merge-patch+json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    }
  )
  if (response.status !== 204) throw response
  return {}
}
