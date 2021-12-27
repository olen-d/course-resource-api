import { sanitizeAll, trimAll } from '../../services/v1/input-services.mjs'
import { getAllUsers, newUser } from '../../models/v1/user-models.mjs'

async function addUser (req, reply) {
  const { mongo: { db: _db } } = this // _ObjectID is also available

  const { body } = req
  const trimmed = trimAll(body)
  const userInfo = sanitizeAll(trimmed)

  const result = await newUser(_db, userInfo)
  return result
}

async function readAllUsers (req, reply) {
  const { mongo: { db: _db } } = this

  const result = await getAllUsers(_db)
  return result
}

export { addUser, readAllUsers }
