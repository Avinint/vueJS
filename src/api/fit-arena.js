import {defaultHeaders} from "./api.js";
import $fetch from './refreshToken.js'

export const getFitArenas = async (page = 1, query = '') => {
  const response = await $fetch(`${import.meta.env.VITE_API_URL}/api/fit_arenas?page=${page}${query}`, {
    method:'get',
    headers: {
      ...defaultHeaders,
      'Content-Type': 'application/ld+json',
      'Authorization': 'Bearer '+ localStorage.getItem('token')
    }
  })
  if (response.status !== 200)
    throw response
  return response.json()
}

export const postFitArenas = async (fa) => {
  const response = await $fetch( `${import.meta.env.VITE_API_URL}/api/fit_arenas`, {
    method:'post',
    headers: {
      ...defaultHeaders,
      'Content-Type': 'application/ld+json',
      'Authorization': 'Bearer '+ localStorage.getItem('token')
    },
    body: JSON.stringify(fa)
  })
  if (response.status !== 201)
    throw response
  return response.json()
}

export const updateFitarenas = async (client, id) => {
  const response = await $fetch(`${import.meta.env.VITE_API_URL}/api/fit_arenas/${id}`, {
    method:'put',
    headers: {
      ...defaultHeaders,
      // 'Content-Type': 'application/merge-patch+json',
      'Content-Type': 'application/ld+json',
      'Authorization': 'Bearer '+ localStorage.getItem('token')
    },
    body: JSON.stringify(client)
  })
  if (response.status !== 200)
    throw response
  return response.json()
}

export const deleteFitArenas = async (id) => {
  const response = await $fetch(`${import.meta.env.VITE_API_URL}/api/fit_arenas/${id}`, {
    method:'delete',
    headers: {
      ...defaultHeaders,
      'Content-Type': 'application/merge-patch+json',
      'Authorization': 'Bearer '+ localStorage.getItem('token')
    }
  })
  if (response.status !== 204)
    throw response
  return {}
}
