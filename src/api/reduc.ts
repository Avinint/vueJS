import { get, put, post } from './api.js'

// récupération de la liste des réductions
export const getReducs = async (idFitArena: number) => {
  return await get(`${import.meta.env.VITE_API_URL}/api/fitarena/${idFitArena}/reductions_statut`)
}