import { getAllUsers, newUser } from '../../models/v1/user-models.mjs'

async function addUser (req, reply) {
  const { mongo: { db: _db } } = this // _ObjectID is also available

  const {
    emailAddress: emailAddressRaw,
    firstName: firstNameRaw,
    lastName: lastNameRaw,
    plainTextPassword: plainTextPasswordRaw,
    role: roleRaw,
    username: usernameRaw
  } = req.body

  const emailAddress = emailAddressRaw.trim()
  const firstName = firstNameRaw.trim()
  const lastName = lastNameRaw.trim()
  const plainTextPassword = plainTextPasswordRaw.trim()
  const role = roleRaw.trim()
  const username = usernameRaw.trim()

  const userInfo = {
    emailAddress,
    firstName,
    lastName,
    plainTextPassword,
    role,
    username
  }

  const result = await newUser(_db, userInfo)
  return result
}

async function readAllUsers (req, reply) {
  const { mongo: { db: _db } } = this

  const result = await getAllUsers(_db)
  return result
}

export { addUser, readAllUsers }
