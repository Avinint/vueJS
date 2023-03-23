import {defaultHeaders} from "./api.js";
import $fetch from "./refreshToken.js";

export const getZoneActivites = async (page = 1, query = '') => {
    const response = await $fetch(`${import.meta.env.VITE_API_URL}/api/zone_activites?page=${page}${query}`, {
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

// export const getZoneActivite = async (zone, activite) => {
//     const response = await $fetch(`${import.meta.env.VITE_API_URL}/api/zone_activites?zone=${zone}&activite=${activite}`, {
//         method:'get',
//         headers: {
//             ...defaultHeaders,
//             'Content-Type': 'application/ld+json',
//             'Authorization': 'Bearer '+ localStorage.getItem('token')
//         }
//     })
//     if (response.status !== 200)
//         throw response
//     return response.json();
// };