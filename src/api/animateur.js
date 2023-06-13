import { defaultHeaders, get } from './api.js'
import $fetch from './refreshToken.js'

export const getAnimateurs = async (page = 1, query = '') => {
  return await get (`${import.meta.env.VITE_API_URL}/api/animateurs?page=${page}${query}`);
}

export const getAnimateursParOrganisme = async (id, page = 1, query = '') => {
  return await get (`${import.meta.env.VITE_API_URL}/api/organismes/${id}/animateurs?page=${page}${query}`);
}

export const postAnimateur = async (animateur) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/animateur`,
    {
      method: 'post',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/ld+json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify(animateur.value),
    }
  )
  if (response.status !== 201) throw response
  return response.json()
}

export const putAnimateur = async (animateur, id) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/animateur/${id}`,
    {
      method: 'put',
      headers: {
        ...defaultHeaders,
        // 'Content-Type': 'application/merge-patch+json',
        'Content-Type': 'application/ld+json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify(animateur.value),
    }
  )
  if (response.status !== 200) throw response
  return response.json()
}

export const deleteAnimateur = async (id) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/animateur/${id}`,
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
