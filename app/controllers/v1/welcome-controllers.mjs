import { sanitizeAll, trimAll } from "../../services/v1/input-services.mjs";
import { changeWelcomeItem, getWelcomeItemBySlug, getAllWelcomeItems, newWelcomeItem } from "../../models/v1/welcome-models.mjs";

async function addWelcomeItem (req, reply) {
  const { mongo: { db: _db, ObjectId: _ObjectId } } = this

  const { body, verifiedAuthToken: { role, sub }, } = req
  // Array of roles authorized to create welcome items
  const rolesAuthorized = ['siteadmin', 'superadmin']
  const canCreate = rolesAuthorized.indexOf(role) !== -1

  if (canCreate) {
    const trimmed = trimAll(body)
    const welcomeItemInfo = sanitizeAll(trimmed)
    // TODO: Check that the userId in the client submittal equals the userId from the token (i.e. sub)
    const result = await newWelcomeItem(_db, _ObjectId, welcomeItemInfo)
    return result
  } else {
    throw new Error('current role cannot create a welcome item')
  }
}

async function readWelcomeItemBySlugAll (req, reply) {
  const { mongo: { db: _db } } = this

  const { verifiedAuthToken: { role, sub }, } = req

  const filters = []

  if (role === 'superadmin') {
    filters.push({})
  } else if (role === 'siteadmin') {
    filters.push({ ownerId: sub })
  }

  const { params: { slug } } = req
  const result = await getWelcomeItemBySlug(_db, filters, slug)
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

async function readAllWelcomeItems (req, reply) {
  const { mongo: { db: _db } } = this

  const { verifiedAuthToken: { role, sub }, } = req
  const filters = []

  if (role === 'superadmin') {
    filters.push({})
  } else if (role === 'siteadmin') {
    filters.push({ ownerId: sub })
  }

  const result = await getAllWelcomeItems(_db, filters)
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

async function readPublishedWelcomeItems (req, reply) {
  const { mongo: { db: _db } } = this

  const filters = [{ isPublished: true }]
  const result = await getAllWelcomeItems(_db, filters)
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

async function updateWelcomeItem (req, reply) {
  const { mongo: { db: _db, ObjectId: _ObjectId} } = this
  const { body, params: { id: welcomeItemId }, verifiedAuthToken: { role, sub } } = req

  const rolesAuthorized = ['siteadmin', 'superadmin']
  const canUpdate = rolesAuthorized.indexOf(role) !== -1

  if (canUpdate) {
    const trimmed = trimAll(body)
    const welcomeItemInfo = sanitizeAll(trimmed)
    // TODO: Check that the userId in the client submittal equals the userId from the token (i.e. sub)
    const result = await changeWelcomeItem(_db, _ObjectId, welcomeItemId, welcomeItemInfo)
    return result
  } else {
    throw new Error('current role cannot update a welcome item')
  }
}

export { addWelcomeItem, readWelcomeItemBySlugAll, readAllWelcomeItems, readPublishedWelcomeItems, updateWelcomeItem }
