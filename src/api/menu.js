import { defaultHeaders } from './api.js'
import $fetch from './refreshToken.js'
import { useStorage } from '@vueuse/core'

export const getMenu = async (page = 1, query = '') => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/menu`,
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


