import { defaultHeaders } from './api.js'
import $fetch from './refreshToken.js'
import { useStorage } from '@vueuse/core'

export const getUsers = async (page = 1, query = '') => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/users?page=${page}${query}`,
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

export const getClientUsers = async (page, idClient, query = '') => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/clients/${idClient}/users?page=${page}${query}`,
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

export const getUser = async (id = 1) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/users/${id}`,
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

export const patchUser = async (user, id) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/users/${id}`,
    {
      method: 'patch',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/merge-patch+json',
        Authorization: 'Bearer ' + useStorage('token', '').value,
      },
      body: JSON.stringify(user),
    }
  )
  if (response.status !== 200) throw response
  return response.json()
}

// export const updateUser = async (user, id) => {
//   const response = await $fetch(
//     `${import.meta.env.VITE_API_URL}/api/users/${id}`,
//     {
//       method: 'put',
//       headers: {
//         ...defaultHeaders,
//         // 'Content-Type': 'application/merge-patch+json',
//         'Content-Type': 'application/ld+json',
//         Authorization: 'Bearer ' + useStorage('token', '').value,
//       },
//       body: JSON.stringify(user),
//     }
//   )
//   if (response.status !== 200) throw response
//   return response.json()
// }

// export const deleteZones = async (id) => {
//   const response = await $fetch(
//     `${import.meta.env.VITE_API_URL}/api/zones/${id}`,
//     {
//       method: 'delete',
//       headers: {
//         ...defaultHeaders,
//         'Content-Type': 'application/merge-patch+json',
//         Authorization: 'Bearer ' + useStorage('token', '').value,
//       },
//     }
//   )
//   if (response.status !== 204) throw response
//   return {}
// }
