import {defaultHeaders} from "./api.js";
import $fetch from "./refreshToken.js";

export const postZoneActiviteEquipement = async (zoneId, activiteId, data) => {
    const response = await $fetch( `${import.meta.env.VITE_API_URL}/api/equipements/zone/${zoneId}/activite/${activiteId}`, {
        method:'post',
        headers: {
            ...defaultHeaders,
            'Content-Type': 'application/ld+json',
            'Authorization': 'Bearer '+ localStorage.getItem('token')
        },
        body: JSON.stringify(data)
    })
    if (response.status !== 201)
        throw response
    return response.json()
}