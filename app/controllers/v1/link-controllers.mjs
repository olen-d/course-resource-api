import { sanitizeAll, trimAll } from '../../services/v1/input-services.mjs'
import { changeLink, getAllLinks, getLinkById, newLink } from '../../models/v1/link-models.mjs'

async function addLink (req, reply) {
  const { mongo: { db: _db, ObjectId: _ObjectId } } = this

  const { body, verifiedAuthToken: { role, sub }, } = req
  // Array of roles authorized to create courses
  const rolesAuthorized = ['siteadmin', 'superadmin']
  const canCreate = rolesAuthorized.indexOf(role) !== -1

  if (canCreate) {
    const trimmed = trimAll(body)
    const linkInfo = sanitizeAll(trimmed)
    // TODO: Check that the userId in the client submittal equals the userId from the token (i.e. sub)
    try {
      const result = await newLink(_db, _ObjectId, linkInfo)
      reply.code(201).send(result)
    } catch (error) {
      throw new Error(error)
    }
  } else {
    reply.code(403).send({ status: 'error', messsage: 'current role cannot create a link' })
  }
}

async function readAllLinks (req, reply) {
  const { mongo: { db: _db } } = this

  const { verifiedAuthToken: { role, sub }, } = req
  const filters = []

  if (role === 'superadmin') {
    filters.push({})
  } else if (role === 'siteadmin') {
    filters.push({ ownerId: sub })
  }

  const result = await getAllLinks(_db, filters)
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
}

async function readLinkByIdAll (req, reply) {
  const { mongo: { db: _db, ObjectId: _ObjectId } } = this

  const { verifiedAuthToken: { role, sub }, } = req

  const filters = []

  if (role === 'superadmin') {
    filters.push({})
  } else if (role === 'siteadmin') {
    filters.push({ ownerId: sub })
  }

  const { params: { id } } = req
  const objId = _ObjectId(id)
  filters.push({ _id: objId })

  try {
    const result = await getLinkById(_db, filters)
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
  } catch(error) {
    reply
      .code(500)
      .send(error)
  }
}

async function readPublishedLinks (req, reply) {
  const { mongo: { db: _db } } = this

  const filters = [{ isPublished: true }]
  const result = await getAllLinks(_db, filters)
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
}

async function updateLink (req, reply) {
  const { mongo: { db: _db, ObjectId: _ObjectId} } = this
  const { body, params: { id }, verifiedAuthToken: { role, sub } } = req
  const objId = _ObjectId(id)

  const rolesAuthorized = ['siteadmin', 'superadmin']
  const canUpdate = rolesAuthorized.indexOf(role) !== -1

  if (canUpdate) {
    const trimmed = trimAll(body)
    const linkInfo = sanitizeAll(trimmed)
    // TODO: Check that the userId in the client submittal equals the userId from the token (i.e. sub)
    try {
      const result = await changeLink(_db, linkInfo, objId)
      reply
        .code(200)
        .send(result)
    } catch (error) {
      reply
        .code(500)
        .send(error)
    }
  } else {
    reply
      .code(403)
      .send('Current role cannot update a link')
  }
}

export { addLink, readAllLinks, readLinkByIdAll, readPublishedLinks, updateLink }
