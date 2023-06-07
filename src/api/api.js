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
