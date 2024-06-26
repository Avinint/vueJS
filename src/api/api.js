import $fetch from '@api/refreshToken.js'
import { useStorage } from '@vueuse/core'


const successCodes = { post: 201, put: 200, delete: 204, patch: 200 }
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
export const get = async (uri, query = null) => {
  const token = useStorage('token', '')
  const url =  (uri.startsWith('http') ? uri : import.meta.env.VITE_API_URL + uri) + ( query !== null ? getQuery(query) : '')
  const headers = { ...getHeaders, Authorization: `Bearer ${token.value}` }
  const response = await $fetch(url, { method: 'get', headers })

  if (response.status !== 200) throw response.json()
  return response.json()
}

export const post = async (url, body) => await request(url, body)

export const put = async (url, body = {}) => await request(url, body, 'put')

export const patch = async (url, body) => request(url, body, 'patch')

export const del = async (url) => request(url, {}, 'delete')

export const request = async (uri, requestBody, method = 'post') => {
  const { body, options } = prepareRequest(requestBody, method)
  const url = uri.startsWith('http') ? uri : import.meta.env.VITE_API_URL + uri
  const response = await fetchResponse(url, method, options, body);
  if (response.status !== successCodes[method]) throw response.json()
  return ['patch', 'delete'].includes(method) ? {} : await response.json()
}

const prepareRequest = (body, method, options = {}) => {
  if (!(body instanceof FormData)) {
    body = JSON.stringify(body.value || body)
    const contentType = ['patch', 'delete'].includes(method) ? 'application/merge-patch+json' : "application/ld+json"
    options = { 'Content-Type': contentType }
  }

  return { body, options }
}

const fetchResponse = async (url, method, options, body) => await $fetch(url, {
    method, body,
    headers: {
      ...defaultHeaders,
      ...options,
      Authorization: 'Bearer ' + useStorage('token', '').value,
    },
  })