import {defaultHeaders} from "./api.js";

export const getActivitesByZones = async (page = 1, query = '') => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/zone_activites?page=${page}${query}`, {
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

export const postActivitesByZones = async (activite) => {
    const response = await fetch( `${import.meta.env.VITE_API_URL}/api/zone_activites`, {
        method:'post',
        headers: {
            ...defaultHeaders,
            'Content-Type': 'application/ld+json',
            'Authorization': 'Bearer '+ localStorage.getItem('token')
        },
        body: JSON.stringify(activite)
    })
    if (response.status !== 201)
        throw response
    return response.json()
}


export const updateActivitesByZones = async (activite, id) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/zone_activites/${id}`, {
        method:'put',
        headers: {
            ...defaultHeaders,
            // 'Content-Type': 'application/merge-patch+json',
            'Content-Type': 'application/ld+json',
            'Authorization': 'Bearer '+ localStorage.getItem('token')
        },
        body: JSON.stringify(activite)
    })
    if (response.status !== 200)
        throw response
    return response.json()
}

export const deleteActivitesByZones = async (id) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/zone_activites/${id}`, {
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

export const getActiviteByZone = async (id = 1) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/zone_activites/${id}`, {
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

