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
