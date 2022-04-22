const validateContent = content => {
  return new Promise((resolve, reject) => {
    try {
      const isValidLength = content.length >= 1
      const isValid = isValidLength
      resolve(isValid)
    } catch (error) {
      reject(error)
    }
  })
}

const validateTitle = title => {
  return new Promise((resolve, reject) => {
    try {
      const alphaNumericPunctuation = /^[a-zA-Z0-9-]+[!?.]*(,? [a-zA-Z0-9-]+[!?.]*)*$/
      const isValid = alphaNumericPunctuation.test(title)
      resolve(isValid)
    } catch (error) {
      reject(error)
    }
  })
}

export { validateContent, validateTitle }
