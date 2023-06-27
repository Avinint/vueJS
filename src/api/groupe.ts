import { defaultHeaders, get } from './api.js'
import $fetch from './refreshToken.js'

export const fetchGroupes = async (organismeId: number) =>
  await get(
    `${import.meta.env.VITE_API_URL}/api/organismes/${organismeId}/groupes`
  )

export async function postGroup(groupe: GroupeEditContract): Promise<Groupe> {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/groupes`,
    {
      method: 'post',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/ld+json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify(groupe),
    }
  )

  if (response.status !== 201) throw response.json()
  return response.json()
}

export async function deleteGroup(groupe_id: number) {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/groupes/${groupe_id}`,
    {
      method: 'delete',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/ld+json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    }
  )

  if (response.status !== 204) throw response.json()
}

