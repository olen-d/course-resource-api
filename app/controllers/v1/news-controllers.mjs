import { sanitizeAll, trimAll } from '../../services/v1/input-services.mjs'
import {
  changeStory,
  getAllStories,
  getStoryById,
  newStory,
  removeStory
} from '../../models/v1/news-models.mjs'

async function addStory (req, reply) {
  try {
    const { mongo: { db: _db, ObjectId: _ObjectId } } = this
    const { body, verifiedAuthToken: { role, sub }, } = req
    // Array of roles authorized to create courses
    const rolesAuthorized = ['siteadmin', 'superadmin']
    const canCreate = rolesAuthorized.indexOf(role) !== -1
  
    if (canCreate) {
      const trimmed = trimAll(body)
      const info = sanitizeAll(trimmed)
      info.creatorId = sub
      info.ownerId = sub
      // TODO: Check that the userId in the client submittal equals the userId from the token (i.e. sub)

      const result = await newStory(_db, _ObjectId, info)
      reply.code(201).send(result)
    } else {
      reply.code(403).send({ status: 'error', messsage: 'current role cannot create a story' })
    }
  } catch (error) {
    throw new Error(`News Controllers Add Story ${error}`)
  }
}

async function purgeStory (req, reply) {
  try {
    const { mongo: { db: _db, ObjectId: _ObjectId} } = this
    const { body, params: { id }, verifiedAuthToken: { role, sub } } = req
  
    const rolesAuthorized = ['author', 'admin', 'superadmin']
    const canDelete = rolesAuthorized.indexOf(role) !== -1
  
    if (canDelete) {
      // TODO: Check that the userId in the client submittal equals the userId from the token (i.e. sub)
      const result = await removeStory(_db, _ObjectId, id)
      reply
      .code(200)
      .send(result)
    } else {
      reply
      .code(403)
      .send('Current role cannot delete a story')
    }
  } catch (error) {
    throw new Error(`News Controllers Purge Story ${error}`)
  }
}

async function readStoriesActive (req, reply) {
  try {
    const { mongo: { db: _db } } = this

    const currentTimestamp = Date.now()

    const filters = [{ isPublished: true }, { publishOn: { $lt: currentTimestamp} }, { expiresOn: { $gt: currentTimestamp } }]
    const result = await getAllStories(_db, filters)
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
    throw new Error(`News Controllers Read Stories Active ${error}`)
  }
}

async function readStoriesAll (req, reply) {
  try {
    const { mongo: { db: _db } } = this

    const filters = []
    const result = await getAllStories(_db, filters)
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
    throw new Error(`News Controllers Read Stories All ${error}`)
  }
}

async function readStoryById (req, reply) {
  try {
    const { mongo: { db: _db, ObjectId: _ObjectId } } = this
    const { body, params: { id }, verifiedAuthToken: { role, sub } } = req
    const objId = _ObjectId(id)

    const rolesAuthorized = ['siteadmin', 'superadmin']
    const canRead = rolesAuthorized.indexOf(role) !== -1

    if (canRead) {
      const filters = [{ _id: objId }]
      const result = await getAllStories(_db, filters)
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
        .send('Current role cannot retrieve story')
    }
  } catch (error) {
    throw new Error(`News Controllers Read Stories All ${error}`)
  }
}

async function readStoriesPublished (req, reply) {
  try {
    const { mongo: { db: _db } } = this

    const filters = [{ isPublished: true }]
    const result = await getAllStories(_db, filters)
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
    throw new Error(`News Controllers Read Stories Published ${error}`)
  }
}

async function reviseStory (req, reply) {
  try {
    const { mongo: { db: _db, ObjectId: _ObjectId } } = this
    const { body, params: { id }, verifiedAuthToken: { role, sub } } = req
    const objId = _ObjectId(id)
  
    const rolesAuthorized = ['siteadmin', 'superadmin']
    const canUpdate = rolesAuthorized.indexOf(role) !== -1
  
    if (canUpdate) {
      const trimmed = trimAll(body)
      const info = sanitizeAll(trimmed)
      // TODO: Check that the userId in the client submittal equals the userId from the token (i.e. sub)

      const result = await changeStory(_db, objId, info, sub)
      reply
        .code(200)
        .send(result)
    } else {
      reply
        .code(403)
        .send('Current role cannot update a story')
    }
  } catch (error) {
    throw new Error(`News Controllers Revise Story ${error}`)
  }
}

export {
  addStory,
  purgeStory,
  readStoriesActive,
  readStoriesAll,
  readStoriesPublished,
  readStoryById,
  reviseStory
}
