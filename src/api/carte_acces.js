import { get } from "@api/api.js";

export const getCarteAcces = async (id) => {
  return await get(`${import.meta.env.VITE_API_URL}/api/carte_acces/${id}`)
}