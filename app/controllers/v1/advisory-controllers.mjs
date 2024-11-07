import { sanitizeAll, trimAll } from '../../services/v1/input-services.mjs'
import {
  newAdvisory
} from '../../models/v1/advisory-models.mjs'

async function addAdvisory (req, reply) {
  const { mongo: { db: _db, ObjectId: _ObjectId } } = this
  const { body, verifiedAuthToken: { role, sub: creatorId}, } = req

  // Array of roles authorized to create courses
  const rolesAuthorized = ['siteadmin', 'superadmin']
  const canCreate = rolesAuthorized.indexOf(role) !== -1

  try{
    if (canCreate) {
      const trimmed = trimAll(body)
      const info = sanitizeAll(trimmed)
      info.creatorId = creatorId

      const result = await newAdvisory(_db, _ObjectId, info)
      reply.code(201).send(result)
    } else {
      reply.code(403).send({ status: 'error', messsage: 'current role cannot create a story' })
    }
  } catch (error) {
    throw new Error(`Advisory Controllers Add Advisory ${error}`)
  }
}

export {
  addAdvisory
}
