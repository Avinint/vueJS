import { defaultHeaders, get, post, put } from './api.js'
import $fetch from './refreshToken.js'
import { useStorage } from '@vueuse/core'

export const getAdherentsParOrganisme = async (id: number, query: object = { page: 1 }) =>
  await get(`/api/organismes/${id}/adherents`, query)

export const postAdherent = async (adherent) => {

  return await post(`${import.meta.env.VITE_API_URL}/api/adherent`, adherent)
}

export const putAdherent = async (adherent, id) =>
  await put(`${import.meta.env.VITE_API_URL}/api/adherent/${id}`, adherent)

export const deleteAdherent = async (id: number) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/adherent/${id}`,
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

export const selectGroupes = async (organismeId: number) =>
  await get(`/api/organismes/${organismeId}/groupes/select`)

export const groupes = async (organismeId: number) =>
await get(`/api/organismes/${organismeId}/groupes/select`)


