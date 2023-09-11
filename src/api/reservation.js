import { get, getQuery, put } from './api.js'

export const getReservations = async (query = {page: 1}) => {

  if (!query.idFA) {
    throw 'Requête invalide car la fit arena est inconnue.'
  }

  return (await get(`${import.meta.env.VITE_API_URL}/api/reservation/liste${getQuery(query)}`)).reservationsListe
}

export const getReservation = async(id) => {
  return await get(`${import.meta.env.VITE_API_URL}/api/reservation/details/${id}`)
}

export const annulerReservation = async(id) => {
  return await put(`${import.meta.env.VITE_API_URL}/api/reservation/annulation/${id}`)
}

export const getTypes = async() => await get(`${import.meta.env.VITE_API_URL}/api/creneau_types`)
export const getStatuts = async() => await get(`${import.meta.env.VITE_API_URL}/api/reservation_statuts`)