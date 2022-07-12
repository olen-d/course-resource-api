import { createCourseFiles, createCourseImages } from '../../services/v1/course-services.mjs'
import { sanitizeAll, trimAll } from '../../services/v1/input-services.mjs'
import { changeCourse, getAllCourses, getCourseBySlug, newCourse, removeCourse } from '../../models/v1/course-models.mjs'

async function addCourse (req, reply) {
  const { mongo: { db: _db, ObjectId: _ObjectId } } = this

  const { body, verifiedAuthToken: { role, sub }, } = req
  // Array of roles authorized to create courses
  const rolesAuthorized = ['author', 'publisher', 'admin', 'superadmin']
  const canCreate = rolesAuthorized.indexOf(role) !== -1

  if (canCreate) {
    const trimmed = trimAll(body)
    const courseInfo = sanitizeAll(trimmed)
    // TODO: Check that the userId in the client submittal equals the userId from the token (i.e. sub)
    const result = await newCourse(_db, _ObjectId, courseInfo)
    return result
  } else {
    throw new Error('current role cannot create a course')
  }
}

async function addCourseFiles (req, reply) {
  const { config: { PATH_FILES_COURSES: pathFilesCourses } } = this

  const { verifiedAuthToken: { role, sub } } = req
  // Array of roles authorized to upload course files
  const rolesAuthorized = ['author', 'publisher', 'admin', 'superadmin']
  const canCreate = rolesAuthorized.indexOf(role) !== -1

  if (canCreate) {
    const result = await createCourseFiles(req, pathFilesCourses)
    const { status } = result

    if (status !== 'created') {
      reply.code(500).send(result)
    } else {
      reply.code(201).send(result)
    }
  }
}

async function addCourseImages (req, reply) {
  const {
    config: {
      PATH_FILES_IMAGES: pathFilesImages,
      PATH_FILES_ORIGINALS: pathFilesOriginals,
      PATH_FILES_THUMBNAILS: pathFilesThumbnails,
      PREFIX_FILES_IMAGES: prefixFilesImages,
      PREFIX_FILES_THUMBNAILS: prefixFilesThumbnails
    }
  } = this

  const { verifiedAuthToken: { role, sub } } = req
  // Array of roles authorized to upload course images
  const rolesAuthorized = ['author', 'publisher', 'admin', 'superadmin']
  const canCreate = rolesAuthorized.indexOf(role) !== -1

  if (canCreate) {
    const result = await createCourseImages(req, pathFilesImages, pathFilesOriginals, pathFilesThumbnails, prefixFilesImages, prefixFilesThumbnails)
    const { status } = result

    if (status !== 'created') {
      reply.code(500).send(result)
    } else {
      reply.code(201).send(result)
    }
  }
}

async function purgeCourse (req, reply) {
  const { mongo: { db: _db, ObjectId: _ObjectId} } = this
  const { body, params: { id: courseId }, verifiedAuthToken: { role, sub } } = req

  const rolesAuthorized = ['author', 'admin', 'superadmin']
  const canUpdate = rolesAuthorized.indexOf(role) !== -1

  if (canUpdate) {
    const trimmed = trimAll(body)
    const courseInfo = sanitizeAll(trimmed)
    // TODO: Check that the userId in the client submittal equals the userId from the token (i.e. sub)
    const result = await removeCourse(_db, _ObjectId, courseId)
    return result
  } else {
    throw new Error('current role cannot delete a course')
  }
}

async function updateCourse (req, reply) {
  const { mongo: { db: _db, ObjectId: _ObjectId} } = this
  const { body, params: { id: courseId }, verifiedAuthToken: { role, sub } } = req

  const rolesAuthorized = ['author', 'publisher', 'admin', 'superadmin']
  const canUpdate = rolesAuthorized.indexOf(role) !== -1

  if (canUpdate) {
    const trimmed = trimAll(body)
    const courseInfo = sanitizeAll(trimmed)
    // TODO: Check that the userId in the client submittal equals the userId from the token (i.e. sub)
    const result = await changeCourse(_db, _ObjectId, courseId, courseInfo)
    return result
  } else {
    throw new Error('current role cannot update a course')
  }
}

async function readAllCourses (req, reply) {
  const {
    mongo: {
      db: _db
    },
    config: {
      PATH_FILES_IMAGES: pathFilesImages,
      PATH_FILES_ORIGINALS: pathFilesOriginals,
      PATH_FILES_THUMBNAILS: pathFilesThumbnails,
      PREFIX_FILES_IMAGES: prefixFilesImages,
      PREFIX_FILES_THUMBNAILS: prefixFilesThumbnails
    }
  } = this

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
    const paths = { pathFilesImages, pathFilesOriginals, pathFilesThumbnails}
    const prefixes = { prefixFilesImages, prefixFilesThumbnails}
    result.paths = { ...paths }
    result.prefixes = { ...prefixes }
    reply
      .code(200)
      .send(result)
  }
}

async function readCourseBySlugAll (req, reply) {
  const {
    mongo: {
      db: _db
    },
    config: {
      PATH_FILES_IMAGES: pathFilesImages,
      PATH_FILES_ORIGINALS: pathFilesOriginals,
      PATH_FILES_THUMBNAILS: pathFilesThumbnails,
      PREFIX_FILES_IMAGES: prefixFilesImages,
      PREFIX_FILES_THUMBNAILS: prefixFilesThumbnails
    }
  } = this

  const { verifiedAuthToken: { role, sub }, } = req

  const filters = []

  if (role === 'superadmin') {
    filters.push({})
  } else if (role === 'author') {
    filters.push({ ownerId: sub })
  }

  const { params: { slug } } = req
  const result = await getCourseBySlug(_db, filters, slug)
  const { status } = result

  if ( status === 'error' ) {
    // TODO: Figure out what the error is and send an appropriate code
    reply
      .code(404)
      .send(result)
  } else if ( status === 'ok') {
    const paths = { pathFilesImages, pathFilesOriginals, pathFilesThumbnails}
    const prefixes = { prefixFilesImages, prefixFilesThumbnails}
    result.paths = { ...paths }
    result.prefixes = { ...prefixes }
    reply
      .code(200)
      .send(result)
  }
}

async function readCourseBySlugPublished (req, reply) {
  const {
    mongo: {
      db: _db
    },
    config: {
      PATH_FILES_IMAGES: pathFilesImages,
      PATH_FILES_ORIGINALS: pathFilesOriginals,
      PATH_FILES_THUMBNAILS: pathFilesThumbnails,
      PREFIX_FILES_IMAGES: prefixFilesImages,
      PREFIX_FILES_THUMBNAILS: prefixFilesThumbnails
    }
  } = this

  const { params: { slug } } = req
  const filters = [{ isPublished: true }, { publishOn: { $lte: new Date() } }]
  const result = await getCourseBySlug(_db, filters, slug)
  const { status } = result

  if ( status === 'error' ) {
    // TODO: Figure out what the error is and send an appropriate code
    reply
      .code(404)
      .send(result)
  } else if ( status === 'ok') {
    const paths = { pathFilesImages, pathFilesOriginals, pathFilesThumbnails}
    const prefixes = { prefixFilesImages, prefixFilesThumbnails}
    result.paths = { ...paths }
    result.prefixes = { ...prefixes }
    reply
      .code(200)
      .send(result)
  }
}

async function readPublishedCourses (req, reply) {
  const {
    mongo: {
      db: _db
    },
    config: {
      PATH_FILES_COURSES: pathFilesCourses,
      PATH_FILES_IMAGES: pathFilesImages,
      PATH_FILES_ORIGINALS: pathFilesOriginals,
      PATH_FILES_THUMBNAILS: pathFilesThumbnails,
      PREFIX_FILES_IMAGES: prefixFilesImages,
      PREFIX_FILES_THUMBNAILS: prefixFilesThumbnails
    }
  } = this
  const filters = [{ isPublished: true }, { publishOn: { $lte: new Date() } }]
  const result = await getAllCourses(_db, filters)
  const { status } = result

  if ( status === 'error' ) {
    // TODO: Figure out what the error is and send an appropriate code
    reply
      .code(404)
      .send(result)
  } else if ( status === 'ok') {
    const paths = { pathFilesCourses, pathFilesImages, pathFilesOriginals, pathFilesThumbnails}
    const prefixes = { prefixFilesImages, prefixFilesThumbnails}
    result.paths = { ...paths }
    result.prefixes = { ...prefixes }
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

export {
  addCourse,
  addCourseFiles,
  addCourseImages,
  purgeCourse,
  readAllCourses,
  readCourseBySlugAll,
  readCourseBySlugPublished,
  readPublishedCourses,
  updateCourse
}
