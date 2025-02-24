import { sanitizeAll, trimAll } from "../../services/v1/input-services.mjs";
import {
  changeAboutItem,
  getAboutItemById,
  getAboutItemBySlug,
  getAllAboutItems,
  newAboutItem,
  removeAboutItem
} from "../../models/v1/about-models.mjs";

async function acquireAboutItemAllById (req, reply) {
  const { mongo: { db: _db, ObjectId: _ObjectId } } = this

  const { verifiedAuthToken: { role, sub }, } = req

  const filters = []

  if (role === 'superadmin') {
    filters.push({})
  } else if (role === 'siteadmin') {
    filters.push({ ownerId: sub })
  }

  const { params: { id } } = req
  const info = { id }

  try {
    const result = await getAboutItemById(_db, _ObjectId, filters, info)
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
    throw new Error (`About Controllers Acquire About Item All By Id ${error}`)
  }
}

async function addAboutItem (req, reply) {
  const { mongo: { db: _db, ObjectId: _ObjectId } } = this

  const { body, verifiedAuthToken: { role, sub }, } = req
  // Array of roles authorized to create about items
  const rolesAuthorized = ['siteadmin', 'superadmin']
  const canCreate = rolesAuthorized.indexOf(role) !== -1

  if (canCreate) {
    const trimmed = trimAll(body)
    const info = sanitizeAll(trimmed)
    info.creatorId = sub
    info.ownerId = sub
    // TODO: Check that the userId in the client submittal equals the userId from the token (i.e. sub)
    const result = await newAboutItem(_db, _ObjectId, info)
    return result
  } else {
    throw new Error('current role cannot create a course')
  }
}

async function purgeAboutItem(req, reply) {
  const { mongo: { db: _db, ObjectId: _ObjectId} } = this
  const { params: { id: itemId }, verifiedAuthToken: { role, sub } } = req

  const rolesAuthorized = ['author', 'admin', 'superadmin']
  const canPurge = rolesAuthorized.indexOf(role) !== -1

  try {
    if (canPurge) {
      const result = await removeAboutItem(_db, _ObjectId, { itemId })
      return result
    } else {
      throw new Error('current role cannot delete an an about item')
    }
  } catch (error) {
    throw new Error(`About Items Controllers Purge About Item ${error}`)
  }
}

async function readAboutItemBySlugAll (req, reply) {
  const { mongo: { db: _db } } = this

  const { verifiedAuthToken: { role, sub }, } = req

  const filters = []

  if (role === 'superadmin') {
    filters.push({})
  } else if (role === 'siteadmin') {
    filters.push({ ownerId: sub })
  }

  const { params: { slug } } = req
  const result = await getAboutItemBySlug(_db, filters, slug)
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

async function readAllAboutItems (req, reply) {
  const { mongo: { db: _db } } = this

  const { verifiedAuthToken: { role, sub }, } = req
  const filters = []

  if (role === 'superadmin') {
    filters.push({})
  } else if (role === 'siteadmin') {
    filters.push({ ownerId: sub })
  }

  const result = await getAllAboutItems(_db, filters)
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

async function readPublishedAboutItems (req, reply) {
  const { mongo: { db: _db } } = this

  const filters = [{ isPublished: true }]
  const result = await getAllAboutItems(_db, filters)
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

async function updateAboutItem (req, reply) {
  const { mongo: { db: _db, ObjectId: _ObjectId} } = this
  const { body, params: { id: aboutItemId }, verifiedAuthToken: { role, sub } } = req

  const rolesAuthorized = ['siteadmin', 'superadmin']
  const canUpdate = rolesAuthorized.indexOf(role) !== -1

  if (canUpdate) {
    const trimmed = trimAll(body)
    const aboutItemInfo = sanitizeAll(trimmed)
    // TODO: Check that the userId in the client submittal equals the userId from the token (i.e. sub)
    const result = await changeAboutItem(_db, _ObjectId, aboutItemId, aboutItemInfo)
    return result
  } else {
    throw new Error('current role cannot update an about item')
  }
}

export {
  acquireAboutItemAllById,
  addAboutItem,
  purgeAboutItem,
  readAboutItemBySlugAll,
  readAllAboutItems,
  readPublishedAboutItems,
  updateAboutItem
}
