import { get } from './api.js'

export const fetchGroupes = async (organismeId) =>
await get(`${import.meta.env.VITE_API_URL}/api/organismes/${organismeId}/groupes`)


