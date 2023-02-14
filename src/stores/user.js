import { defineStore } from 'pinia'
import {computed, reactive, ref} from "vue";

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export const useUserStore = defineStore('user', () => {
  let user = reactive({

  })

  let _token_decoded = reactive({})

  const iat = computed(() => _token_decoded.iat ?? 0)
  const exp = computed(() => _token_decoded.exp ?? 0)
  const token_decoded = computed(() => _token_decoded.roles ?? [])
  const username = computed(() => _token_decoded.username ?? '')

  async function login(login, pass) {
    const response = await fetch(import.meta.env.VITE_API_URL +'/auth', {
      method:'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({"email":login ,"password": pass})
    })
    if (response.status !== 200)
      throw response
    const {token} = await response.json()
    localStorage.setItem('token', token)
    _token_decoded = parseJwt(token)
  }

  // AT MOUNT
  if (localStorage.getItem('token')) {
    const token_in_storage = localStorage.getItem('token')
    _token_decoded = parseJwt(token_in_storage)
  }

  return { user, login, iat, exp, username }
})
