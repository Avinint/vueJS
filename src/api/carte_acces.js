import { get } from "@api/api.js";

export const getCarteAcces = async (id) => {
  return await get(`/api/carte_acces/${id}`)
}