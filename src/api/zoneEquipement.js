import { defaultHeaders } from './api.js'
import $fetch from './refreshToken.js'
import { useStorage } from '@vueuse/core'

export const postZoneEquipement = async (body) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/zone_equipement`,
    {
      method: 'post',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/ld+json',
        Authorization: 'Bearer ' + useStorage('token', '').value,
      },
      body: JSON.stringify(body),
    }
  )
  if (response.status !== 201) throw response
  return response.json()
}

export const deleteZoneEquipement = async (id) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/zone_equipement/` + id,
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

export const deleteZoneEquipementByIds = async (zone, equipement) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/zone/` +
      zone +
      `/equipement/` +
      equipement,
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
