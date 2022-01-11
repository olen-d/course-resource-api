import { sanitizeAll, trimAll } from '../../services/v1/input-services.mjs'
import { getAllCourses, newCourse } from '../../models/v1/course-models.mjs'

async function addCourse (req, reply) {
  const { mongo: { db: _db } } = this // _ObjectID is also available

  const { body, verifiedAuthToken: { role, sub }, } = req
  // Array of roles authorized to create courses
  const rolesAuthorized = ['author', 'publisher', 'admin', 'superadmin']
  const canCreateCourse = rolesAuthorized.indexOf(role) !== -1

  if (canCreateCourse) {
    const trimmed = trimAll(body)
    const courseInfo = sanitizeAll(trimmed)
    // TODO: Check that the userId in the client submittal equals the userId from the token (i.e. sub)
    const result = await newCourse(_db, courseInfo)
    return result
  } else {
    throw new Error('current role cannot create a course')
  }
}

async function readAllCourses (req, reply) {
  const { mongo: { db: _db } } = this

  const result = await getAllCourses(_db)
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

export { addCourse, readAllCourses }
