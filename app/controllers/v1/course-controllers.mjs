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

  const { verifiedAuthToken: { role, sub }, } = req

  const filters = []

  if (role === 'superadmin') {
    filters.push({})
  } else if (role === 'author') {
    filters.push({ ownerId: sub })
  }

  // const filters = [{ isPublished: true }, { publishOn: { $lte: new Date() } }]
  // const filters = [{}]
  const result = await getAllCourses(_db, filters)
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

async function readPublishedCourses (req, reply) {
  const { mongo: { db: _db } } = this
  const filters = [{ isPublished: true }, { publishOn: { $lte: new Date() } }]
  const result = await getAllCourses(_db, filters)
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
// async function readAllCourses (req, reply) {
//   const { mongo: { db: _db } } = this

//   // Check for authorization
//   // If no authorization, return published true only
//   // If role is user, return user courses only
//   // If role is publisher, return publisher & user courses assigned to that publisher
//   // If role is admin, return admin & user/publisher courses assigned to that admin
//   // If role is superadmin, return all courses

//   const result = await getAllCourses(_db)
//   const { status } = result

//   if ( status === 'error' ) {
//     // TODO: Figure out what the error is and send an appropriate code
//     reply
//       .code(404)
//       .send(result)
//   } else if ( status === 'ok') {
//     reply
//       .code(200)
//       .send(result)
//   }
// }

export { addCourse, readAllCourses, readPublishedCourses }
