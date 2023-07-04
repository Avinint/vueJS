import { defaultHeaders } from './api.js'
import $fetch from './refreshToken.js'
import { useStorage } from '@vueuse/core'

export const getTypeCreneau = async (page = 1, query = '') => {
  // const response = await $fetch(
  //   `${import.meta.env.VITE_API_URL}/api/type_crenneau?page=${page}${query}`,
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
  return [
    {
      id: 1,
      libelle: 'Grand public',
    },
    {
      id: 2,
      libelle: 'Organisme',
    },
    {
      id: 3,
      libelle: 'Animateur labelisé',
    },
    {
      id: 4,
      libelle: 'Maintenance',
    },
  ]
}

// export const postTypeCreneau = async (typeActivite) => {
//   const response = await $fetch(
//     `${import.meta.env.VITE_API_URL}/api/type_crenneau`,
//     {
//       method: 'post',
//       headers: {
//         ...defaultHeaders,
//         'Content-Type': 'application/ld+json',
//         Authorization: 'Bearer ' + useStorage('token', '').value,
//       },
//       body: JSON.stringify(typeActivite),
//     }
//   )
//   if (response.status !== 201) throw response
//   return response.json()
// }

// export const updateTypeActivite = async (typeActivite, id) => {
//   const response = await $fetch(
//     `${import.meta.env.VITE_API_URL}/api/type_crenneau/${id}`,
//     {
//       method: 'put',
//       headers: {
//         ...defaultHeaders,
//         'Content-Type': 'application/ld+json',
//         Authorization: 'Bearer ' + useStorage('token', '').value,
//       },
//       body: JSON.stringify(typeActivite),
//     }
//   )
//   if (response.status !== 200) throw response
//   return response.json()
// }

// export const deleteTypeActivite = async (id) => {
//   const response = await $fetch(
//     `${import.meta.env.VITE_API_URL}/api/type_crenneau/${id}`,
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
