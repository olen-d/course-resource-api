import { hashPassword } from '../../services/v1/bcrypt-services.mjs'

import { createUser, readAllUsers } from '../../services/v1/user-services.mjs'
import { processValidations, validateEmailAddress, validateFirstName, validateLastName, validatePassword, validateRole, validateUsername } from '../../services/v1/validate-services.mjs'

const getAllUsers = async (_db) => {
  const data = await readAllUsers(_db)
  return { status: 'ok', data }
}

const newUser = async (_db, userInfo) => {
  const {
    emailAddress,
    firstName,
    lastName,
    plaintextPassword,
    role,
    username
  } = userInfo

  const isValidEmailAddress = validateEmailAddress(emailAddress)
  const isValidFirstName = validateFirstName(firstName)
  const isValidLastName = validateLastName(lastName)
  const isValidPassword = validatePassword(plaintextPassword)
  const isValidRole = validateRole(role)
  const isValidUsername = validateUsername(username)

  const validations = await Promise.allSettled([isValidEmailAddress, isValidFirstName, isValidLastName, isValidPassword, isValidRole, isValidUsername])
  const fields = ['emailAddress', 'firstName', 'lastName', 'password', 'role', 'username'] // These need to be in the same order as Promise.allSettled above

  // Loop through validations
  const validationResults = await processValidations(fields, validations)
  const foundValidationError = validationResults.findIndex((field) => {
    const [fieldName] = (Object.keys(field))
    if (field[fieldName] === false) { return true }
  })

  // !TODO: check the errors array for "true" and send the errors up to the controller
  if (foundValidationError === -1) {
    const passwordHash = await hashPassword(plaintextPassword)

    if (passwordHash) {
      const userInfoValidated = {
        emailAddress,
        firstName,
        lastName,
        passwordHash,
        role,
        username
      }

      const data = await createUser(_db, userInfoValidated)
      return { status: 'ok', data }
    }
  } else {
    return { status: 'error', type: 'validation', message: 'unable to validate one or more values', validationResults }
  }
}

export { getAllUsers, newUser }
