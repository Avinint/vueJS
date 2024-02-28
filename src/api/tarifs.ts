import { get, put, post } from './api.js'

// récupération de la liste des tarifs
export const getTarifs = async (idFitArena: number) => {
  return await get(`${import.meta.env.VITE_API_URL}/api/fitarena/${idFitArena}/tarifs`)
}

// récupération d'un tarif
export const getTarif = async (idTarif: number) => {
  return await get(`${import.meta.env.VITE_API_URL}/api/tarif/${idTarif}`)
}

// récupération des niveaux d'un tarif
export const getTarifNiveaux = async () => {
  return await get(`${import.meta.env.VITE_API_URL}/api/tarif/niveaux`)
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

export const sortTarifs = async (idFitArena: number, tarifs: {idTarif, priorite}[]) => {
  const sortedTarifs = tarifs.map(({idTarif}, index) => ({idTarif, priorite: index + 1}))
  return await put(`/api/fitarena/${idFitArena}/tarifs/priorite`, {ordre: sortedTarifs})
}

export const getTarifsByActivity = async (idFitArena: number, idActivite: number) => {
  return (await get(`/api/tarif/liste/fitarena/${idFitArena}/activite/${idActivite}`))
}

export const getTarifByActivity = async (idFitArena: number, idActivite: number, date: string, heure: string) => {
  return (await get(`/api/tarif/fitarena/${idFitArena}/activite/${idActivite}/date/${date}/heure/${heure}`))
}