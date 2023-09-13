import { defaultHeaders } from './api.js'

export const postControleAcces = async (data) => {
  const response = await fetch(
    'http://admin-dev.fit-arena.fr/fitarena/ca/open',
    {
      method: 'post',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/json',
        'api-key': 'abaa1ea0-c16e-45d6-a7a3-549284d8cd06',
      },
      body: JSON.stringify(data),
    }
  )
  if (response.status !== 200) throw response
  return response.json()
}
