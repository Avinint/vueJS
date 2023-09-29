import { get } from './api.js'

export const getTypeCreneaux = async (query = {}) => await get('/api/creneau_types', query)

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
