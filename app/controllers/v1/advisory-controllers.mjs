import { sanitizeAll, trimAll } from '../../services/v1/input-services.mjs'
import {
  changeAdvisory,
  getAdvisoriesAll,
  getAdvisoriesCoursesIds,
  newAdvisory,
  removeAdvisory
} from '../../models/v1/advisory-models.mjs'

async function acquireAdvisoriesAll (req, reply) {
  const { mongo: { db: _db, ObjectId: _ObjectId } } = this

  const filters = {}

  try {
    const result = await getAdvisoriesAll(_db, filters)
    const { status } = result
  
    if ( status === 'error' ) {
      // TODO: Figure out what the error is and send an appropriate code
      reply
        .code(404)
        .send(result)
    } else if ( status === 'ok') {
      reply
        .code(200)
        .send(result)
    }
  } catch (error) {
    throw new Error(`Advisory Controllers Acquire Advisories All ${error}`)
  }
}

async function acquireAdvisoriesCoursesIds (req, reply) {
  const { mongo: { db: _db } } = this

  const filters = [{ isPublished: true }]
  try {
    const result = await getAdvisoriesCoursesIds(_db, filters)
    const { status } = result

    if ( status === 'error' ) {
      // TODO: Figure out what the error is and send an appropriate code
      reply
        .code(404)
        .send(result)
    } else if ( status === 'ok') {
      reply
        .code(200)
        .send(result)
    }
  } catch (error) {
    throw new Error(`Advisory Controllers Acquire Advisories Courses Ids ${error}`)
  }
}

async function acquireAdvisoryById (req, reply) {
  try {
    const { mongo: { db: _db, ObjectId: _ObjectId } } = this
    const { body, params: { id }, verifiedAuthToken: { role, sub } } = req
    const objId = _ObjectId(id)

    const rolesAuthorized = ['siteadmin', 'superadmin']
    const canRead = rolesAuthorized.indexOf(role) !== -1

    if (canRead) {
      const filters = { _id: objId }

      const result = await getAdvisoriesAll(_db, filters)
      const { status } = result

      if ( status === 'error' ) {
        // TODO: Figure out what the error is and send an appropriate code
        reply
          .code(404)
          .send(result)
      } else if ( status === 'ok') {
        reply
          .code(200)
          .send(result)
      }
    } else {
      reply
        .code(403)
        .send('Current role cannot retrieve advisory')
    }
  } catch (error) {
    throw new Error(`Advisory Controllers Read Advisories All ${error}`)
  }
}

async function acquireAdvisoryPublishedById (req, reply) {
  const { mongo: { db: _db, ObjectId: _ObjectId } } = this
  const { body, params: { id }, } = req
  const objId = _ObjectId(id)

  const filters = [{ _id: objId, isPublished: true }]
  try {
    const result = await getAdvisoriesAll(_db, filters)
    const { status } = result

    if ( status === 'error' ) {
      // TODO: Figure out what the error is and send an appropriate code
      reply
        .code(404)
        .send(result)
    } else if ( status === 'ok') {
      reply
        .code(200)
        .send(result)
    }
  } catch (error) {
    throw new Error(`Advisory Controllers Read Advisories All ${error}`)
  }
}

async function acquireAdvisoryPublishedByRouteId (req, reply) {
  const { mongo: { db: _db, ObjectId: _ObjectId } } = this
  const { body, params: { id }, } = req
  const objId = _ObjectId(id)

  const filters = { '$and': [{ coursesAffected: objId, isPublished: true }] }
  try {
    const result = await getAdvisoriesAll(_db, filters)
    const { status } = result

    if ( status === 'error' ) {
      // TODO: Figure out what the error is and send an appropriate code
      reply
        .code(404)
        .send(result)
    } else if ( status === 'ok') {
      reply
        .code(200)
        .send(result)
    }
  } catch (error) {
    throw new Error(`Advisory Controllers Read Advisories All ${error}`)
  }
}

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

async function purgeAdvisory (req, reply) {
  const { mongo: { db: _db, ObjectId: _ObjectId} } = this
  const { params: { id: advisoryId }, verifiedAuthToken: { role, sub } } = req

  const rolesAuthorized = ['author', 'admin', 'superadmin']
  const canUpdate = rolesAuthorized.indexOf(role) !== -1

  try {
    if (canUpdate) {
      const result = await removeAdvisory(_db, _ObjectId, advisoryId)
      return result
    } else {
      throw new Error('current role cannot delete an advisory')
    }
  } catch (error) {
    throw new Error(`Advisory Controllers Purge Advisory ${error}`)
  }
}

async function reviseAdvisory (req, reply) {
  try {
    const { mongo: { db: _db, ObjectId: _ObjectId } } = this
    const { body, params: { id }, verifiedAuthToken: { role, sub } } = req
  
    const rolesAuthorized = ['siteadmin', 'superadmin']
    const canUpdate = rolesAuthorized.indexOf(role) !== -1
  
    if (canUpdate) {
      const trimmed = trimAll(body)
      const info = sanitizeAll(trimmed)
      info.advisoryId = id
      info.authorId = sub
      // TODO: Check that the userId in the client submittal equals the userId from the token (i.e. sub)

      const result = await changeAdvisory(_db, _ObjectId, info)
      reply
        .code(200)
        .send(result)
    } else {
      reply
        .code(403)
        .send('Current role cannot update an advisory')
    }
  } catch (error) {
    throw new Error(`Advisory Controllers Revise Advisory ${error}`)
  }
}

export {
  acquireAdvisoriesAll,
  acquireAdvisoriesCoursesIds,
  acquireAdvisoryById,
  acquireAdvisoryPublishedById,
  acquireAdvisoryPublishedByRouteId,
  addAdvisory,
  purgeAdvisory,
  reviseAdvisory
}
