import {defaultHeaders} from "./api.js";
import $fetch from "./refreshToken.js";

export const getEquipements = async (fitArenaId, page = 1, query = '') => {
    const response = await $fetch(`${import.meta.env.VITE_API_URL}/api/fit_arena/${fitArenaId}/equipements?page=${page}${query}`, {
        method:'get',
        headers: {
            ...defaultHeaders,
            'Content-Type': 'application/ld+json',
            'Authorization': 'Bearer '+ localStorage.getItem('token')
        }
    })
    if (response.status !== 200)
        throw response
    return response.json()
}

export const getEquipement = async (id = 1) => {
    const response = await $fetch(`${import.meta.env.VITE_API_URL}/api/equipements/${id}`, {
        method:'get',
        headers: {
            ...defaultHeaders,
            'Content-Type': 'application/ld+json',
            'Authorization': 'Bearer '+ localStorage.getItem('token')
        }
    })
    if (response.status !== 200)
        throw response
    return response.json()
}

export const postEquipements = async (equipement) => {
    const response = await $fetch( `${import.meta.env.VITE_API_URL}/api/equipements`, {
        method:'post',
        headers: {
            ...defaultHeaders,
            'Content-Type': 'application/ld+json',
            'Authorization': 'Bearer '+ localStorage.getItem('token')
        },
        body: JSON.stringify(equipement)
    })
    if (response.status !== 201)
        throw response
    return response.json()
}

export const updateEquipements = async (equipement, id) => {
    const response = await $fetch(`${import.meta.env.VITE_API_URL}/api/equipements/${id}`, {
        method:'put',
        headers: {
            ...defaultHeaders,
            // 'Content-Type': 'application/merge-patch+json',
            'Content-Type': 'application/ld+json',
            'Authorization': 'Bearer '+ localStorage.getItem('token')
        },
        body: JSON.stringify(equipement)
    })
    if (response.status !== 200)
        throw response
    return response.json()
}


export const patchEquipements = async (equipement, id) => {
    const response = await $fetch(`${import.meta.env.VITE_API_URL}/api/equipements/${id}`, {
        method:'patch',
        headers: {
            ...defaultHeaders,
            'Content-Type':'application/merge-patch+json',
            //'Content-Type': 'application/ld+json',
            'Authorization': 'Bearer '+ localStorage.getItem('token')
        },
        body: JSON.stringify(equipement)
    })
    if (response.status !== 200)
        throw response
    return response.json()
}

export const deleteEquipements = async (id) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/equipements/${id}`, {
        method:'delete',
        headers: {
            ...defaultHeaders,
            'Content-Type': 'application/merge-patch+json',
            'Authorization': 'Bearer '+ localStorage.getItem('token')
        }
    })
    if (response.status !== 204)
        throw response
    return {}
}

export const getEquipementsByZone = async (page, zoneId, query = '') => {
    const response = await $fetch(`${import.meta.env.VITE_API_URL}/api/zone/${zoneId}/equipements?page=${page}${query}`, {
        method:'get',
        headers: {
            ...defaultHeaders,
            'Content-Type': 'application/ld+json',
            'Authorization': 'Bearer '+ localStorage.getItem('token')
        }
    })
    if (response.status !== 200)
        throw response
    return response.json()
};
