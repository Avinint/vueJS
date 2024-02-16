import { get, patch } from './api.js'

export const getTarifs = async (idFitArena) => {

  return await get(`${import.meta.env.VITE_API_URL}/api/fitarena/${idFitArena}/tarifs`)
}

export const getTarif = async (idTarif) => {
  return await get(`${import.meta.env.VITE_API_URL}/api/tarif/${idTarif}`)
}
export const patchTarif = async (idFitArena, idTarif, tarif) => {
  return await patch(`${import.meta.env.VITE_API_URL}/fitarena/${idFitArena}/tarif/${idTarif}`, tarif)
}