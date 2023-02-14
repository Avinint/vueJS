const defaultHeaders = {
  'Content-Type': 'application/ld+json',
  'Accept': 'application/json',
  // 'Authorization': 'Bearer '+ localStorage.getItem('token')
}

export const getClients = async () => {
  console.log(localStorage.getItem('token'))
  const response = await fetch(import.meta.env.VITE_API_URL +'/api/clients?page=1', {
    method:'get',
    headers: {
      ...defaultHeaders,
      'Authorization': 'Bearer '+ localStorage.getItem('token')
    }
  })
  if (response.status !== 200)
    throw response
  return response.json()
}

export const postClient = async (client) => {
  const response = await fetch( `${import.meta.env.VITE_API_URL}/api/clients`, {
    method:'post',
    headers: {
      ...defaultHeaders,
      'Authorization': 'Bearer '+ localStorage.getItem('token')
    },
    body: JSON.stringify(client)
  })
  return response.json()
}

export const updateClient = async (client, id) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/clients/${id}`, {
    method:'patch',
    headers: {
      ...defaultHeaders,
      'Authorization': 'Bearer '+ localStorage.getItem('token')
    },
    body: JSON.stringify(client)
  })
  return response.json()
}
