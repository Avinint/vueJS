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
  throw 'Vérifier votre email'
}

export const ipValidation = (val) => {
  const match = val.match(
    /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/
  )
  if (match && match.length) {
    return true
  }
  throw 'Vérifier votre email'
}

export const requiredValidation = (val) => {
  if (!val) throw 'Un texte est requis'
}

export const maxLengthValidation = (max) => {
  return (val) => {
    if (val.length > max) throw 'Maximum de caractères dépassés'
  }
}

export const lengthValidation = (min, max) => {
  return (val) => {
    if (val.length < min || val.length > max)
      throw `Le nombre de caractères doit être entre ${min} et ${max}`
  }
}
