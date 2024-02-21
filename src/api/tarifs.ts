import { get, put, post } from './api.js'

// récupération de la liste des tarifs
export const getTarifs = async (idFitArena: number) => {
  return await get(`${import.meta.env.VITE_API_URL}/api/fitarena/${idFitArena}/tarifs`)
}

// récupération d'un tarif
export const getTarif = async (idTarif: number) => {
  return await get(`${import.meta.env.VITE_API_URL}/api/tarif/${idTarif}`)
}

// modification d'un tarif existant
export const putTarif = async (idTarif: number, tarif: object) => {
  return await put(`${import.meta.env.VITE_API_URL}/api/tarif/${idTarif}`, tarif)
}

// création d'un tarif
export const postTarif = async (tarif: object) => {
  return await post(`${import.meta.env.VITE_API_URL}/api/tarif`, tarif)
}

// activation / désactivation d'un tarif
export const putActifTarif = async (idTarif: number, actif: object) => {
  return await put(`${import.meta.env.VITE_API_URL}/api/tarif/activer/${idTarif}`, actif)
}