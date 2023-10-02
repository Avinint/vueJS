import { get } from './api.js'

export const getModes = async (query = {}) => await get('/api/modes', { ...{page: 1}, ...query })
