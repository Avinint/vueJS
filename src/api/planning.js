import { defaultHeaders } from './api.js'
import $fetch from './refreshToken.js'

export const getPlanning = async (debut, fit_arena, duree, zone) => {
  const response = await $fetch(
    `${
      import.meta.env.VITE_API_URL
    }/api/planning?debut=${debut}&fit_arena=${fit_arena}&duree=${duree}&zone=${zone}`,
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

export const postCreneau = async (data) => {
  const response = await $fetch(`${import.meta.env.VITE_API_URL}/api/creneau`, {
    method: 'post',
    headers: {
      ...defaultHeaders,
      'Content-Type': 'application/ld+json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
    body: JSON.stringify(data),
  })
  if (response.status !== 201) throw response
  return response.json()
}

export const updateCreneau = async (id, data) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/creneau/${id}`,
    {
      method: 'put',
      headers: {
        ...defaultHeaders,
        // 'Content-Type': 'application/merge-patch+json',
        'Content-Type': 'application/ld+json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify(data),
    }
  )
  if (response.status !== 200) throw response
  return response.json()
}

export const deleteCreneau = async (id) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/creneau/${id}`,
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
