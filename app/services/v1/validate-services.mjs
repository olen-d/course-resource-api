// const dnsPromises = require('dns').promises
import { promises as dnsPromises } from 'dns'
// TODO: Add in logging...

const processValidations = (fields, validations) => {
  return new Promise((resolve, reject) => {
    try {
      const validationResults = validations.map((element, index) => {
        if (element.status === 'rejected') {
          const { reason } = element
          return { inputName: fields[index], isValid: false, reason }
        } else {
          return { inputName: fields[index], isValid: element.value }
        }
      })
      resolve(validationResults)
    } catch (error) {
      reject(error)
    }
  })
}

const validateEmailAddress = async emailAddress => {
  const expression = /.+@.+\..+/i

  if (expression.test(String(emailAddress).toLowerCase())) {
    try {
      const hostname = emailAddress.split('@')[1]

      const addresses = await dnsPromises.resolveMx(hostname)

      return !!(addresses && addresses.length > 0 && addresses[0].exchange)
    } catch (error) {
      // TODO: Deal with the error
      console.log('validateServices validateEmailAddress ERROR:\n' + error)
      return false
    }
  } else {
    return false
  }
}

const validateFirstName = firstName => {
  return new Promise((resolve, reject) => {
    try {
      const isValidLength = firstName.length >= 1

      const isValid = isValidLength
      resolve(isValid)
    } catch (error) {
      reject(error)
    }
  })
}

const validateLastName = lastName => {
  return new Promise((resolve, reject) => {
    try {
      const isValidLength = lastName.length >= 1

      const isValid = isValidLength
      resolve(isValid)
    } catch (error) {
      reject(error)
    }
  })
}

const validatePassword = password => {
  return new Promise((resolve, reject) => {
    try {
      const oneUpper = /[A-Z]/
      const oneLower = /[a-z]/
      const oneDigit = /\d/
      const oneSpecial = /[!@#$%^&*()-+=]/

      const isOneUpper = oneUpper.test(password)
      const isOneLower = oneLower.test(password)
      const isOneDigit = oneDigit.test(password)
      const isOneSpecial = oneSpecial.test(password)
      const isLength = password.length >= 8

      const isValid = isOneUpper && isOneLower && (isOneDigit || isOneSpecial) && isLength
      resolve(isValid)
    } catch (error) {
      reject(error)
    }
  })
}

const validateRole = role => {
  return new Promise((resolve, reject) => {
    const roles = ['administrator', 'editor', 'user']
    try {
      const index = roles.indexOf(role)

      const isValid = index !== -1
      resolve(isValid)
    } catch (error) {
      reject(error)
    }
  })
}

const validateTimestamp = timestamp => {
  return new Promise((resolve, reject) => {
    try {
      const isValid = Number.isInteger(timestamp)
      resolve(isValid)
    } catch (error) {
      reject(error)
    }
  })
}

const validateUsername = username => {
  return new Promise((resolve, reject) => {
    try {
      const alphaNumeric = /^[a-zA-Z0-9\-_]+$/

      const isValid = alphaNumeric.test(username)
      resolve(isValid)
    } catch (error) {
      reject(error)
    }
  })
}

export { processValidations, validateEmailAddress, validateFirstName, validateLastName, validatePassword, validateRole, validateTimestamp, validateUsername}
