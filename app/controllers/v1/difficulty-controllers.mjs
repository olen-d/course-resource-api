import { sanitizeAll, trimAll } from '../../services/v1/input-services.mjs'
import { getAllDifficultyLevels, newDifficultyLevel } from '../../models/v1/difficulty-models.mjs'


async function addDifficultyLevel (req, reply) {
  try {
    const { mongo: { db: _db, ObjectId: _ObjectId } } = this
    const { body, verifiedAuthToken: { role, sub }, } = req
    // Array of roles authorized to create courses
    const rolesAuthorized = ['siteadmin', 'superadmin']
    const canCreate = rolesAuthorized.indexOf(role) !== -1
  
    if (canCreate) {
      const trimmed = trimAll(body)
      const info = sanitizeAll(trimmed)
      // TODO: Check that the userId in the client submittal equals the userId from the token (i.e. sub)

      const result = await newDifficultyLevel(_db, _ObjectId, info)
      reply.code(201).send(result)
    } else {
      reply.code(403).send({ status: 'error', messsage: 'current role cannot create a difficulty level' })
    }
  } catch (error) {
    throw new Error(`Difficulty Controllers Add Difficulty Level ${error}`)
  }
}

async function readAllDifficultyLevels (req, reply) {
  try {
    const { mongo: { db: _db } } = this

    const result = await getAllDifficultyLevels(_db)
    return result
  } catch (error) {
    throw new Error(`Difficulty Controllers Read All Difficulty Levels ${error}`)
  }
}

export { addDifficultyLevel, readAllDifficultyLevels }
