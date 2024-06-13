import { hashPassword } from '../../services/v1/bcrypt-services.mjs'

import { createUser, readAllUsers, readUserById, updateUserById } from '../../services/v1/user-services.mjs'
import {
  processValidations,
  validateEmailAddress,
  validateFirstName,
  validateLastName,
  validatePassword,
  validateRole,
  validateUsername
} from '../../services/v1/validate-services.mjs'

const changeUserById = async (_db, _ObjectId, info, userId) => {
  // TODO: Validate the fields
  const infoProcessed = { $set: {} }

  if (info.plaintextPassword) {
    const { plaintextPassword } = info

    const passwordHash = await hashPassword(plaintextPassword)

    if (passwordHash) { info.passwordHash = passwordHash }

    delete info.plaintextPassword 
  }

  for (const key of Object.keys(info)) {
    infoProcessed.$set[key] = info[key]
  }
  try {
    const data = await updateUserById(_db, _ObjectId, infoProcessed, userId)
    // TODO: check for error and return to view level
    return { status: 'ok', data }
  } catch (error) {
    throw new Error(`User Models Change User By Id Error: ${error}`)
  }
}

const getAllUsers = async (_db) => {
  const data = await readAllUsers(_db)
  return { status: 'ok', data }
}

const getUserById = async (_db, _ObjectId, info) => {
  try {
    const data = await readUserById(_db, _ObjectId, info)
    if (data) {
      return { status: 'ok', data }
    } else {
      return { status: 'error', type: 'database', message: 'no data was returned' }
    }
  } catch (error) {
    throw new Error(`User Models Get User By Id Error: ${error}`)
  }
}

const newUser = async (_db, _ObjectId, userInfo) => {
  const {
    emailAddress,
    firstName,
    lastName,
    plaintextPassword,
    role,
    username,
    createdBy
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
  // TODO: Fix this, since it doesn't work. See course-models
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
        username,
        createdBy
      }

      const data = await createUser(_db, _ObjectId, userInfoValidated)
      return { status: 'ok', data }
    }
  } else {
    return { status: 'error', type: 'validation', message: 'unable to validate one or more values', validationResults }
  }
}

export { changeUserById, getAllUsers, getUserById, newUser }
