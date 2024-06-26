import { defaultHeaders } from './api.js'
import $fetch from './refreshToken.js'
import { useStorage } from '@vueuse/core'

export const getProfils = async () => {
  const response = await $fetch(`${import.meta.env.VITE_API_URL}/api/profils`, {
    method: 'get',
    headers: {
      ...defaultHeaders,
      'Content-Type': 'application/ld+json',
      Authorization: 'Bearer ' + useStorage('token', '').value,
    },
  })
  if (response.status !== 200) throw response
  return response.json()
}
