import { sanitizeAll, trimAll } from '../../services/v1/input-services.mjs'
import { getAllCourses, newCourse } from '../../models/v1/course-models.mjs'

async function addCourse (req, reply) {
  const { mongo: { db: _db } } = this // _ObjectID is also available

  const { body } = req
  const trimmed = trimAll(body)
  const courseInfo = sanitizeAll(trimmed)

  const result = await newCourse(_db, courseInfo)
  return result
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
