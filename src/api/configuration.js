import {defaultHeaders} from "./api.js";
import $fetch from "./refreshToken.js";

export const getConfigActiviteById = async (activite_id) => {
    const response = await $fetch(`${import.meta.env.VITE_API_URL}/api/configuration/activite/${activite_id}`, {
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

export const getConfigFitArenaById = async (fitArena_id) => {
    const response = await $fetch(`${import.meta.env.VITE_API_URL}/api/configuration/fit_arena/${fitArena_id}`, {
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

export const getConfigZoneById = async (zone_id) => {
    const response = await $fetch(`${import.meta.env.VITE_API_URL}/api/configuration/zone/${zone_id}`, {
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

export const updateConfig = async (config) => {
    const response = await $fetch(`${import.meta.env.VITE_API_URL}/api/configuration`, {
        method:'put',
        headers: {
            ...defaultHeaders,
            'Content-Type': 'application/ld+json',
            'Authorization': 'Bearer '+ localStorage.getItem('token')
        },
        body: JSON.stringify(config)
    })
    if (response.status !== 200)
        throw response
    return response.json()
}

export const postConfig = async (config) => {
    const response = await $fetch(`${import.meta.env.VITE_API_URL}/api/configuration`, {
        method:'post',
        headers: {
            ...defaultHeaders,
            'Content-Type': 'application/ld+json',
            'Authorization': 'Bearer '+ localStorage.getItem('token')
        },
        body: JSON.stringify(config)
    })
    if (response.status !== 201)
        throw response
    return response.json()
}

// data = { equipements, parametres }
export const postConfigurationZoneActivite = async (zoneId, activiteId, data) => {
    const response = await $fetch(`${import.meta.env.VITE_API_URL}/api/configuration/zone/${zoneId}/activite/${activiteId}`, {
        method: 'post',
        headers: {
            ...defaultHeaders,
            'Content-Type': 'application/ld+json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(data)
    })
    if (response.status !== 201)
        throw response
    return response.json()
}