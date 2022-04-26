import { sanitizeAll, trimAll } from "../../services/v1/input-services.mjs";
import { newAboutItem, getAllAboutItems } from "../../models/v1/about-models.mjs";

async function addAboutItem (req, reply) {
  const { mongo: { db: _db, ObjectId: _ObjectId } } = this

  const { body, verifiedAuthToken: { role, sub }, } = req
  // Array of roles authorized to create about items
  const rolesAuthorized = ['siteadmin', 'superadmin']
  const canCreate = rolesAuthorized.indexOf(role) !== -1

  if (canCreate) {
    const trimmed = trimAll(body)
    const aboutItemInfo = sanitizeAll(trimmed)
    // TODO: Check that the userId in the client submittal equals the userId from the token (i.e. sub)
    const result = await newAboutItem(_db, _ObjectId, aboutItemInfo)
    return result
  } else {
    throw new Error('current role cannot create a course')
  }
}

async function readAllAboutItems( req, reply) {
  const { mongo: { db: _db } } = this

  const result = await getAllAboutItems(_db)
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

export { addAboutItem, readAllAboutItems }
