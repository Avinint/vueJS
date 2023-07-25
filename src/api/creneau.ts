import { defaultHeaders } from './api.js'
import $fetch from './refreshToken.js'
import { useStorage } from '@vueuse/core'

export async function postCreneauDemande(contract: DemandeEditContract): Promise<CreneauDemandePostResponse> {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/creneau/demandes`,
    {
      method: 'post',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/ld+json',
        Authorization: 'Bearer ' + useStorage('token', '').value,
      },
      body: JSON.stringify(contract),
    }
  )
  if (response.status !== 201) throw response
  return response.json()
}