import { get } from './api.js'

export const getModes = async (page = 1, query = '') => {
  return await get(`${import.meta.env.VITE_API_URL}/api/modes?page=${page}${query}`)
}
