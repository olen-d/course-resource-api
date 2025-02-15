import { sanitizeAll, trimAll } from '../../services/v1/input-services.mjs'
import { changeDifficulty, getAllDifficultyLevels, getDifficultyById, newDifficultyLevel } from '../../models/v1/difficulty-models.mjs'

async function acquireDifficultyLevelById (request, reply) {
  const { mongo: { db: _db, ObjectId: _ObjectId }, } = this
  const { params: { id }, } = request

  const filters = []
  const info = { id }

  try {
    const result = await getDifficultyById(_db, _ObjectId, filters, info)
    return result
  } catch (error) {
    throw new Error(`Difficulty Controllers Acquire Difficulty Level By Id ${error}`)
  }
}

async function addDifficultyLevel (req, reply) {
  const { mongo: { db: _db, ObjectId: _ObjectId } } = this
  const { body, verifiedAuthToken: { role, sub }, } = req
  // Array of roles authorized to create difficulty levels
  const rolesAuthorized = ['siteadmin', 'superadmin']
  const canCreate = rolesAuthorized.indexOf(role) !== -1

  try {
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
  const { mongo: { db: _db } } = this

  try {
    const result = await getAllDifficultyLevels(_db)
    return result
  } catch (error) {
    throw new Error(`Difficulty Controllers Read All Difficulty Levels ${error}`)
  }
}

async function reviseDifficulty (req, reply) {
  const { mongo: { db: _db, ObjectId: _ObjectId} } = this
  const { body, params: { id }, verifiedAuthToken: { role, sub } } = req

  const rolesAuthorized = ['siteadmin', 'superadmin']
  const canUpdate = rolesAuthorized.indexOf(role) !== -1

  try {
    if (canUpdate) {
      const trimmed = trimAll(body)
      const info = sanitizeAll(trimmed)
      // TODO: Check that the userId in the client submittal equals the userId from the token (i.e. sub)
      const result = await changeDifficulty(_db, _ObjectId, id, info)
      return result
    } else {
      throw new Error('current role cannot update difficulty')
    }
  } catch (error) {
    throw new Error(`Difficulty Controllers Revise Difficulty ${error}`)
  }
}

export { acquireDifficultyLevelById, addDifficultyLevel, readAllDifficultyLevels, reviseDifficulty }
