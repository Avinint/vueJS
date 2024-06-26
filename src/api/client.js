import { defaultHeaders, getHeaders, get } from './api.js'
import $fetch from './refreshToken.js'
import { useStorage } from '@vueuse/core'

export const getClients = async (query = {}) =>
   get( '/api/clients',{ ...{ page: 1, order: 'asc' }, ...query })

export const selectClients = async () =>
  get('/api/selects/clients')

export const postClient = async (client) => {
  const response = await $fetch(`${import.meta.env.VITE_API_URL}/api/clients`, {
    method: 'post',
    headers: {
      ...defaultHeaders,
      'Content-Type': 'application/ld+json',
      Authorization: 'Bearer ' + useStorage('token', '').value,
    },
    body: JSON.stringify(client),
  })
  if (response.status !== 201) throw response
  return response.json()
}

export const updateClient = async (client, id) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/clients/${id}`,
    {
      method: 'put',
      headers: {
        ...defaultHeaders,
        // 'Content-Type': 'application/merge-patch+json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + useStorage('token', '').value,
      },
      body: JSON.stringify(client),
    }
  )
  if (response.status !== 200) throw response
  return response.json()
}

export const deleteClient = async (id) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/clients/${id}`,
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

export const getGestionnaireCollectivites = async (page = 1, query = '') => {
  const response = await $fetch(
    `${
      import.meta.env.VITE_API_URL
    }/api/gestionnaire_collectivites?page=${page}${query}`,
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
