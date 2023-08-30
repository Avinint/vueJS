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
  const match = val.match(/^[a-zA-ZÀ-ÿœ\- ]{1,50}$/)
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

export const codePinValidation = (code) => {

    if (code.length !== 6) {
      throw 'Le code pin doit faire 6 caractères'
    }

    if (estNumerique(code)) {
      throw 'Le code pin ne peut pas comporter de lettres'
    }
    if (estSuiteCroissante(code)) {
      throw 'Le code pin ne peut pas être une suite croissante'
    }
    if (estSuiteDecroissante(code)) {
      throw 'Le code pin ne peut pas être une suite décroissante'
    }

  return true
}

const estNumerique = (nombre ) => Array.prototype.some.call(nombre, (chiffre) => isNaN(chiffre))
const estSuite = (nombre, dec = false) => Array.prototype.every.call(nombre,(chiffre, index) => index === nombre.length - 1 || parseInt(chiffre) === parseInt(nombre[index + 1]) + (dec ? 1 : - 1))
const estSuiteCroissante = (code) => estSuite(code)
const estSuiteDecroissante = (code) => estSuite(code, true)