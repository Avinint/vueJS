import { defaultHeaders, get } from './api.js'
import $fetch from './refreshToken.js'
import { useStorage } from '@vueuse/core'

export const getZones = async (query = {}) => {
  // const response = await $fetch(
  //   `${import.meta.env.VITE_API_URL}/api/zones?page=${page}${query}`,
  //   {
  //     method: 'get',
  //     headers: {
  //       ...defaultHeaders,
  //       'Content-Type': 'application/ld+json',
  //       Authorization: 'Bearer ' + useStorage('token', '').value,
  //     },
  //   }
  // )
  // if (response.status !== 200) throw response
  // return response.json()

  return await get('/api/zones', {page: 1,  ...query })
}

export const getZone = async (id = 1) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/zones/${id}`,
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

export const postZones = async (fa) => {
  const response = await $fetch(`${import.meta.env.VITE_API_URL}/api/zones`, {
    method: 'post',
    headers: {
      ...defaultHeaders,
      'Content-Type': 'application/ld+json',
      Authorization: 'Bearer ' + useStorage('token', '').value,
    },
    body: JSON.stringify(fa),
  })
  if (response.status !== 201) throw response
  return response.json()
}

export const patchZones = async (zone, id) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/zones/${id}`,
    {
      method: 'patch',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/merge-patch+json',
        //'Content-Type': 'application/ld+json',
        Authorization: 'Bearer ' + useStorage('token', '').value,
      },
      body: JSON.stringify(zone),
    }
  )
  if (response.status !== 200) throw response
  return response.json()
}

export const updateZones = async (zone, id) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/zones/${id}`,
    {
      method: 'put',
      headers: {
        ...defaultHeaders,
        // 'Content-Type': 'application/merge-patch+json',
        'Content-Type': 'application/ld+json',
        Authorization: 'Bearer ' + useStorage('token', '').value,
      },
      body: JSON.stringify(zone),
    }
  )
  if (response.status !== 200) throw response
  return response.json()
}

export const deleteZones = async (id) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/zones/${id}`,
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
