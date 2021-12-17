import{ compare, hash } from 'bcrypt'

const saltRounds = 10

const checkPassword = async (plainTextPassword, passwordHash) => {
  try {
    const result = await compare(plainTextPassword, passwordHash)
    return result
  } catch (error) {
    console.log(error)
    // TODO: Send the error to the Pino logger
    return false
  }
}

// Hash a password, on error, set login to false
const hashPassword = async plainTextPassword => {
  try {
    const result = await hash(plainTextPassword, saltRounds)
    return result
  } catch (error) {
    console.log(error)
    // TODO: Send the error to the Pino logger
    return false
  }
}

export { checkPassword, hashPassword}
