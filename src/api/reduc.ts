import { get, put, post } from './api.js'

// récupération de la liste des réductions
export const getReducs = async (idFitArena: number) => {
  return await get(`${import.meta.env.VITE_API_URL}/api/fitarena/${idFitArena}/reductions_statut`)
}

// récupération d'une réduction
export const getReduc = async (id: number) => {
  return await get(`${import.meta.env.VITE_API_URL}/api/reductions_statut/${id}`)
}

// création d'une réduction
export const postReduc = async (idFitArena: number, reduc: object) => {
  return await post(`${import.meta.env.VITE_API_URL}/api/fitarena/${idFitArena}/reduction`, reduc)
}

// modification d'une réduction existante
export const putReduc = async (idReduc: number, reduc: object) => {
  return await put(`${import.meta.env.VITE_API_URL}/api/reduction/${idReduc}`, reduc)
}