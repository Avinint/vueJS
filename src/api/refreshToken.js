import { defaultHeaders } from "./api.js";
import { useUserStore } from "../stores/user.js";

export default async (...args) => {
  if (!useUserStore().connected) {
    try {
      const {token, refresh_token} = await refreshToken()
      useUserStore().setCredential(token, refresh_token)
    } catch (e) {
      const path = window.location.href.replace(window.location.origin, '')
      if (path !== '/login')
        window.location.href = "/login"
    }
  }
  return fetch(...args)
}

const refreshToken = async () => {
  const refresh_token = localStorage.getItem('refresh_token')
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/token/refresh`, {
    method:'post',
    body: JSON.stringify({refresh_token}),
    headers: {
      ...defaultHeaders,
      'Content-Type': 'application/json'
    }
  })
  if (response.status !== 200)
    throw response
  return response.json()
}
