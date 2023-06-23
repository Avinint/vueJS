import { defaultHeaders, get, post, put } from './api.js'
import $fetch from './refreshToken.js'

export const getAdherentsParOrganisme = async (id, page = 1, query = '') =>
  await get(`${import.meta.env.VITE_API_URL}/api/organismes/${id}/adherents?page=${page}${query}`)

export const postAdherent = async (adherent) => {

  return await post(`${import.meta.env.VITE_API_URL}/api/adherent`, adherent)
}

export const putAdherent = async (adherent, id) =>
  await put(`${import.meta.env.VITE_API_URL}/api/adherent/${id}`, adherent)

export const deleteAdherent = async (id) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/adherent/${id}`,
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

export const selectGroupes = async (organismeId) =>
  await get(`${import.meta.env.VITE_API_URL}/api/organismes/${organismeId}/groupes/select`)

export const groupes = async (organismeId) =>
await get(`${import.meta.env.VITE_API_URL}/api/organismes/${organismeId}/groupes/select`)

