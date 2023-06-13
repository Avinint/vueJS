import { defaultHeaders } from './api.js'
import $fetch from './refreshToken.js'

export async function getCreneauSeances(id_creneau: number, page = 1): Promise<Seance[]> {
  const api_url = import.meta.env.VITE_API_URL
  const url = new URL(`${api_url}/api/creneau/${id_creneau}/reservations`)
  url.searchParams.append('page', page.toString());

  const response = await $fetch(url.toString(), {
    method: 'get',
    headers: {
      ...defaultHeaders,
      'Content-Type': 'application/ld+json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  })
  if (response.status !== 200) throw response
  return response.json()
}
