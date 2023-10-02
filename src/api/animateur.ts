import { defaultHeaders, get } from './api.js'
import $fetch from './refreshToken.js'
import { useStorage } from '@vueuse/core'

export const getAnimateurs = async (query= {}) => {
  return await get ('/api/animateurs', {...{page: 1}, ...query});
}

export const getAnimateursParOrganisme = async (id: number, query: object = {}): Promise<Animateur[]> => {
  return await get (`/api/organismes/${id}/animateurs`, {...{page: 1}, ...query});
}

export const postAnimateur = async (animateur) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/animateur`,
    {
      method: 'post',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/ld+json',
        Authorization: 'Bearer ' + useStorage('token', '').value,
      },
      body: JSON.stringify(animateur.value),
    }
  )

  if (response.status !== 201) throw response.json()
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
        Authorization: 'Bearer ' + useStorage('token', '').value,
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
        Authorization: 'Bearer ' + useStorage('token', '').value,
      },
    }
  )
  if (response.status !== 204) throw response
  return {}
}