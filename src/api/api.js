import $fetch from '@api/refreshToken.js'
import { useStorage } from '@vueuse/core'

export const defaultHeaders = {
  Accept: 'application/json',
  // 'Authorization': 'Bearer '+ useStorage('token', '').value
}

export const getHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/ld+json',
}

export const getQuery = (queryParams = {}) => {
  let query = ''
  for (const prop in queryParams) {
    query += (query.length ? '&' : '?') + prop + '=' + queryParams[prop]
  }

  return query
}
export const get = async (url) => {
  const token = useStorage('token', '')
  const response = await $fetch(url, {
    method: 'get',
    headers: { ...getHeaders, Authorization: `Bearer ${token.value}` },
  })
  if (response.status !== 200) throw response
  return response.json()
}

export const post = async (url, body) => await request(url, body)

export const put = async (url, body) => await request(url, body, 'put')

export const request = async (url, body, method = 'post') => {
  const response = await $fetch(url, {
    method,
    headers: {
      ...defaultHeaders,
      // 'Content-Type': 'application/merge-patch+json',
      'Content-Type': 'application/ld+json',
      Authorization: 'Bearer ' + useStorage('token', '').value,
    },
    body: JSON.stringify(body.value),
  })
  if (response.status !== 200) throw response
  return response.json()
}
