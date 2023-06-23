import $fetch from "@api/refreshToken.js";

export const defaultHeaders = {
  Accept: 'application/json',
  // 'Authorization': 'Bearer '+ localStorage.getItem('token')
}

export const getHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/ld+json',
  Authorization: 'Bearer ' + localStorage.getItem('token'),
}


export const get = async (url) => {
    const response = await $fetch(
      url,
      {
          method: 'get',
          headers: { ...getHeaders },
      }
    )
    if (response.status !== 200) throw response
    return response.json()
}

export const post = async (url, body) => await request(url, body)

export const put = async (url, body) => await request(url, body, 'put')

export const request = async (url, body, method = 'post') => {
  const response = await $fetch(
    url,
    {
      method,
      headers: {
        ...defaultHeaders,
        // 'Content-Type': 'application/merge-patch+json',
        'Content-Type': 'application/ld+json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify(body.value),
    }
  )
  if (response.status !== 200) throw response
  return response.json()
}
