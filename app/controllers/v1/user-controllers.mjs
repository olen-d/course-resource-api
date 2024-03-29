import { sanitizeAll, trimAll } from '../../services/v1/input-services.mjs'
import { getAllUsers, newUser } from '../../models/v1/user-models.mjs'

async function addUser (req, reply) {
  const { mongo: { db: _db } } = this // _ObjectID is also available

  const { body, verifiedAuthToken: { role, sub }, } = req
  // Only admin or superadmin can create a new user
  const canCreateUser = role === 'admin' || role === 'superadmin'
  const canCreateAdmin = role === 'superadmin'

  if (canCreateUser) {
    const trimmed = trimAll(body)
    const userInfo = sanitizeAll(trimmed)
    const { role: newUserRole } = userInfo

    userInfo.createdBy = sub

    if (newUserRole !== 'admin' && newUserRole !== 'superadmin') {
      const result = await newUser(_db, userInfo)
      return result
    }
    if (canCreateAdmin && newUserRole === 'admin') {
      const result = await newUser(_db, userInfo)
      return result
    } else {
      throw new Error('current role cannot create an administrator')
    }
  } else {
    throw new Error('current role cannot create a user')
  }
}

async function readAllUsers (req, reply) {
  const { mongo: { db: _db } } = this

  const result = await getAllUsers(_db)
  return result
}

export { addUser, readAllUsers }
