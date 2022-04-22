import { sanitizeAll, trimAll } from "../../services/v1/input-services.mjs";
import { newAboutItem } from "../../models/v1/about-models.mjs";

async function addAboutItem (req, reply) {
  const { mongo: { db: _db } } = this

  const { body, verifiedAuthToken: { role, sub }, } = req
  // Array of roles authorized to create about items
  const rolesAuthorized = ['siteadmin', 'superadmin']
  const canCreate = rolesAuthorized.indexOf(role) !== -1

  if (canCreate) {
    const trimmed = trimAll(body)
    const aboutItemInfo = sanitizeAll(trimmed)
    // TODO: Check that the userId in the client submittal equals the userId from the token (i.e. sub)
    const result = await newAboutItem(_db, aboutItemInfo)
    return result
  } else {
    throw new Error('current role cannot create a course')
  }
}

export { addAboutItem }
