import { sanitizeAll, trimAll } from '../../services/v1/input-services.mjs'
import { changeUserById, getAllUsers, getUserById, newUser } from '../../models/v1/user-models.mjs'

async function addUser (req, reply) {
  const { mongo: { db: _db, ObjectId: _ObjectId } } = this

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
      const result = await newUser(_db, _ObjectId, userInfo)
      return result
    }
    if (canCreateAdmin && newUserRole === 'admin') {
      const result = await newUser(_db, userInfo)
      return result
    } else {
      throw new Error('current role cannot create an administrator')
    }
  } else {
    reply.code(403).send({ message: 'current role cannot create a user' })
  }
}

async function readAllUsers (req, reply) {
  const { mongo: { db: _db } } = this

  const result = await getAllUsers(_db)
  return result
}

async function readUserById (req, reply) {
  const { mongo: { db: _db, ObjectId: _ObjectId } } = this
  const { body, params: { userId } } = req

  const result = await getUserById(_db, _ObjectId, { userId })
  return result
}

async function updateUserById(req, reply) {
  const { mongo: { db: _db, ObjectId: _ObjectId } } = this
  const { body, params: { userId }, verifiedAuthToken: { role, sub } } = req

  const rolesAuthorized = ['superadmin']
  const canUpdate = rolesAuthorized.indexOf(role) !== -1

  if (canUpdate) {
    const trimmed = trimAll(body)
    const info = sanitizeAll(trimmed)
    // TODO: Check that the userId in the client submittal equals the userId from the token (i.e. sub)
    try {
      const result = await changeUserById(_db, _ObjectId, info, userId)
      return result
    } catch (error) {
      throw new Error(`User Controllers Update User By Id: ${error}`)
    }
  } else {
    throw new Error('current role cannot update a user')
  }
}

export { addUser, readAllUsers, readUserById, updateUserById }
