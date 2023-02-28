import {defaultHeaders} from "./api.js";

export const getActivites = async (fitArenaId, page = 1, query = '') => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/fit_arena/${fitArenaId}/activites?page=${page}${query}`, {
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

export const postActivites = async (fa) => {
    const response = await fetch( `${import.meta.env.VITE_API_URL}/api/activites`, {
        method:'post',
        headers: {
            ...defaultHeaders,
            'Content-Type': 'application/ld+json',
            'Authorization': 'Bearer '+ localStorage.getItem('token')
        },
        body: JSON.stringify(fa)
    })
    if (response.status !== 201)
        throw response
    return response.json()
}

export const updateActivites = async (activite, id) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/activites/${id}`, {
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

export const deleteActivites = async (id) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/activites/${id}`, {
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
