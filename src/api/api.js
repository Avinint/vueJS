import $fetch from '@api/refreshToken.js'
import { useStorage } from '@vueuse/core'


const successCodes = { post: 201, put: 200, delete: 204}
export const defaultHeaders = {
  Accept: 'application/json',
  // 'Authorization': 'Bearer '+ useStorage('token', '').value
}

export const getHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/ld+json',
}

export const getQuery = (queryParams = {}, ignore = [null, false, '']) => {
  let query = ''
  for (const prop in queryParams) {
    if ( !ignore.includes(queryParams[prop])) query += (query.length ? '&' : '?') + prop + '=' + queryParams[prop]
  }

  return query
}
export const get = async (url) => {
  const token = useStorage('token', '')
  const response = await $fetch(url, {
    method: 'get',
    headers: { ...getHeaders, Authorization: `Bearer ${token.value}` },
  })
  if (response.status !== 200) throw response.json()
  return response.json()
}

export const post = async (url, body) => await request(url, body)

export const put = async (url, body = {}) => await request(url, body, 'put')

export const request = async (url, body, method = 'post', contentType= "application/ld+json") => {
  let options= {}

  if (!(body instanceof FormData)) {
    body = JSON.stringify(body.value || body)
    options = { 'Content-Type': contentType }
  }

  const response = await $fetch(url, {
    method,
    headers: {
      ...defaultHeaders,
      // 'Content-Type': 'application/merge-patch+json',
      ...options,
      Authorization: 'Bearer ' + useStorage('token', '').value,
    },
    body: body,
  })
  if (response.status !== successCodes[method]) throw response.json()
  return response.json()
}
