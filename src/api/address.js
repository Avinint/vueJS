const api_gouv = 'https://api-adresse.data.gouv.fr'

const extractAddress = (result) => {
  result = result.features
  return result.map(({ properties, geometry }) => {
    return {
      latitude: geometry.coordinates[0],
      longitude: geometry.coordinates[1],
      ...properties,
    }
  })
}

export const getAdresses = async (address) => {
  const response = await fetch(`${api_gouv}/search/?q=${address}&limit=15"`)
  // console.log(await response.json())
  return extractAddress(await response.json())
}
