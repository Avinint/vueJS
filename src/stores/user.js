import { defineStore } from 'pinia'
import {computed, reactive, ref} from "vue";
import { useStorage } from '@vueuse/core'

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export const useUserStore = defineStore('user', () => {

  const token_in_storage = useStorage('token', '')
  const refresh_token_in_storage = useStorage('refresh_token', '')

  const iat = computed(() => parseJwt(token_in_storage.value)?.iat ?? 0)
  const exp = computed(() => parseJwt(token_in_storage.value)?.exp ?? 0)
  const username = computed(() => parseJwt(token_in_storage.value)?.username ?? '')
  const connected = computed(() => (Math.floor(Date.now() / 1000) < exp?.value))

  async function login(login, pass) {
    const response = await fetch(import.meta.env.VITE_API_URL +'/auth', {
      method:'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({"email":login ,"password": pass})
    })
    if (response.status !== 200)
      throw response
    const {token, refresh_token} = await response.json()
    setCredential(token, refresh_token)
  }

  function setCredential(token, refresh_token) {
    token_in_storage.value = token
    refresh_token_in_storage.value = refresh_token
  }

  function logout() {
    token_in_storage.value = ''
    refresh_token_in_storage.value = ''
  }

  return { login, logout, iat, exp, username, connected, setCredential }
})
