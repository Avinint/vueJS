export const isValid = list => {
  let valid = true
  Object.values(list.value).forEach(el => el || (valid = false))
  return valid
}

export const emailValidation = (val) => {
  const match = val.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  if(match && match.length) {
    return true
  }
  throw "Verifier votre email"
}

export const requiredValidation = (val) => {
  if (!val)
    throw "Un texte est requis"
}

export const maxLenghtValidation = (max) => {
  return (val) => {
    if (val.length > max)
      throw "Maximum de caracteres depassés"
  }
}

export const lenghtValidation = (min, max) => {
  return (val) => {
    if (val.length < min || val.length > max)
      throw `Le nombre de caracteres doit etre entre ${min} et ${max}`
  }
}