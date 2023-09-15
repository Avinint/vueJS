import { get, put } from './api.js'

export const getReservations = async (query = {page: 1}) => {

  if (!query.idFA) {
    throw 'Requête invalide car la fit arena est inconnue.'
  }

  return (await get('/api/reservation/liste', query)).reservationsListe
}

export const getReservation = async(id) => {
  return await get(`/api/reservation/details/${id}`)
}

export const annulerReservation = async(id) => {
  return await put(`/api/reservation/annulation/${id}`)
}

export const getTypes = async() => await get(`/api/creneau_types`)
export const getStatuts = async() => await get(`/api/reservation_statuts`)