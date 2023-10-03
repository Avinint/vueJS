import { defaultHeaders, get, post } from './api.js'
import $fetch from './refreshToken.js'
import { useStorage } from '@vueuse/core'


const dtoRecherche = (criteres) => {
  let params = {}, reste;
  ({ categorie: params['typeEquipement.categoryTypeEquipement.code'], fit: params['fitArena.id'], ...reste } = criteres)
  return {...reste, ...params}
}

const dtoTri = (tri) => {
  let params = {}, reste;
  ({ type: params['order[typeEquipement.id]'], ...reste } = tri)

  return {...reste, ...params}
}
export const getEquipements = async (fitArenaId, query = {}, tri = {}) =>
  await get(`/api/fit_arena/${fitArenaId}/equipements`, { page: 1, ...dtoRecherche(query), ...dtoTri(tri) })

export const getEquipement = async (id = 1) => await get('/api/equipements/' + id)

export const postEquipements = async (equipement) => {
  if (equipement.hasOwnProperty('equipementModes')) {
    equipement.equipementModes = equipement.equipementModes.map(config => ({ ...config, mode: config.mode.iri }))
  }

  return await post('/api/equipements', equipement)
}

export const updateEquipements = async (equipement, id) => {
  for (let configuration of equipement.equipementModes) {
    configuration.mode = configuration.mode.iri
  }

  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/equipements/${id}`,
    {
      method: 'put',
      headers: {
        ...defaultHeaders,
        // 'Content-Type': 'application/merge-patch+json',
        'Content-Type': 'application/ld+json',
        Authorization: 'Bearer ' + useStorage('token', '').value,
      },
      body: JSON.stringify(equipement),
    }
  )
  if (response.status !== 200) throw response
  return response.json()
}

export const patchEquipements = async (equipement, id) => {
  const response = await $fetch(
    `${import.meta.env.VITE_API_URL}/api/equipements/${id}`,
    {
      method: 'patch',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/merge-patch+json',
        //'Content-Type': 'application/ld+json',
        Authorization: 'Bearer ' + useStorage('token', '').value,
      },
      body: JSON.stringify(equipement),
    }
  )
  if (response.status !== 200) throw response
  return response.json()
}

export const deleteEquipements = async (id) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/equipements/${id}`,
    {
      method: 'delete',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/merge-patch+json',
        Authorization: 'Bearer ' + useStorage('token', '').value,
      },
    }
  )
  if (response.status !== 204) throw response
  return {}
}

export const getEquipementsByZone = async (page, zoneId, query = '') => {
  const response = await $fetch(
    `${
      import.meta.env.VITE_API_URL
    }/api/zone/${zoneId}/equipements?page=${page}${query}`,
    {
      method: 'get',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/ld+json',
        Authorization: 'Bearer ' + useStorage('token', '').value,
      },
    }
  )
  if (response.status !== 200) throw response
  return response.json()
}
