export const isValid = (list) => {
  let valid = true
  Object.values(list.value).forEach((el) => el || (valid = false))
  return valid
}

export const emailValidation = (val) => {
  const match = val.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  )
  if (match && match.length) {
    return true
  }
  throw "L'email n'est pas valide"
}

export const ipValidation = (val) => {
  const match = val.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/)
  if (match && match.length) {
    return true
  }
  throw "L'adresse IP n'est pas valide"
}

export const zipValidation = (val) => {
  const match = val.match(/^[0-9]{5}$/)
  if (match && match.length) {
    return true
  }
  throw "Le code postal n'est pas valide"
}

export const cityValidation = (val) => {
  const match = val.match(/^[A-Za-zÉéÈèËëÊêÀàÂâÄäÛûÙùÖöÔôÎîÏïÇç-\s*]{1,50}$/)
  // const match = val.match(/^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/) ne prend pas en compte les accents
  if (match && match.length) {
    return true
  }
  throw "La ville n'est pas valide"
}

export const phoneValidation = (val) => {
  const match = val.match(/^[0]{1}[0-9]{9}$/)
  if (match && match.length) {
    return true
  }
  throw "Le numéro de téléphone n'est pas valide"
}

export const latitudeAndLongitudeValidation = (val) => {
  const match = val.match(/^[0-9-]{1,3}\.[0-9]{1,10}$/)
  if (match && match.length) {
    return true
  }
  throw "Le format n'est pas valide"
}

export const requiredValidation = (val) => {
  if (!val) throw 'Un texte est requis'
}

export const maxLengthValidation = (max) => {
  return (val) => {
    if (val.length > max) throw 'Le nombre de caractères maximum est dépassé'
  }
}

export const lengthValidation = (min, max) => {
  return (val) => {
    if (val.length < min || val.length > max)
      throw `Le nombre de caractères doit être entre ${min} et ${max}`
  }
}
