import { defaultHeaders, get, getQuery } from './api.js'
import $fetch from './refreshToken.js'
import { useStorage } from '@vueuse/core'

export const getParametres = async (query = {page: 1}) => {
  return await get(`${import.meta.env.VITE_API_URL}/api/parametres${getQuery(query)}`)
}

export const getParametresByZone = async (id) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/configuration/zone/${id}`,
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

/**
 * exemple pour data:
 * {
        "idZone": 38,
        "parametres": [
            {
                "parametre": 1, // id ou code
                "valeur": 1
            }
        ]
    }
 */
export const postParametres = async (data) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/configuration`,
    {
      method: 'post',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/ld+json',
        Authorization: 'Bearer ' + useStorage('token', '').value,
      },
      body: JSON.stringify(data),
    }
  )
  if (response.status !== 201) throw response
  return response.json()
}

export const updateParametres = async (data) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/configuration`,
    {
      method: 'put',
      headers: {
        ...defaultHeaders,
        // 'Content-Type': 'application/merge-patch+json',
        'Content-Type': 'application/ld+json',
        Authorization: 'Bearer ' + useStorage('token', '').value,
      },
      body: JSON.stringify(data),
    }
  )
  if (response.status !== 200 && response.status !== 201) throw response
  return response.json()
}
