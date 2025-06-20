import { createCourseFiles, createCourseImages } from '../../services/v1/course-services.mjs'
import { sanitizeAll, trimAll } from '../../services/v1/input-services.mjs'
import {
  changeCourse,
  getAllCourses,
  getAllCourseTitlesAndSlugss,
  getCourse,
  newCourse,
  removeCourse
} from '../../models/v1/course-models.mjs'

// Helper functions
const getOwnerFilter = verifiedAuthToken => {
  const { role, sub } = verifiedAuthToken

  if (role === 'superadmin') {
    return {}
  } else if (role === 'author') {
    return { ownerId: sub }
  }
}

function getPaths (config) {
  const {
    PATH_FILES_IMAGES: pathFilesImages,
    PATH_FILES_ORIGINALS: pathFilesOriginals,
    PATH_FILES_THUMBNAILS: pathFilesThumbnails,
  } = config
  const paths = { pathFilesImages, pathFilesOriginals, pathFilesThumbnails }
  return paths
}

function getPrefixes (config) {
  const {
    PREFIX_FILES_IMAGES: prefixFilesImages,
    PREFIX_FILES_THUMBNAILS: prefixFilesThumbnails
  } = config
  const prefixes = { prefixFilesImages, prefixFilesThumbnails }
  return prefixes
}

// End Helper Functions

async function addCourse (req, reply) {
  const { mongo: { db: _db, ObjectId: _ObjectId } } = this

  const { body, verifiedAuthToken: { role, sub }, } = req
  // Array of roles authorized to create courses
  const rolesAuthorized = ['author', 'publisher', 'admin', 'superadmin']
  const canCreate = rolesAuthorized.indexOf(role) !== -1

  if (canCreate) {
    const trimmed = trimAll(body)
    const info = sanitizeAll(trimmed)
    info.creatorId = sub
    info.ownerId = sub
    // TODO: Check that the userId in the client submittal equals the userId from the token (i.e. sub)
    try {
      const result = await newCourse(_db, _ObjectId, info)
      return result
    } catch (error) {
      throw new Error(`Course Controllers Add Course ${error}`)
    }
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

async function readAllCourses (request, reply) {
  const { config, mongo: { db: _db }, } = this

  const { verifiedAuthToken } = request

  const info = {}
  if (Object.keys(request?.query).length === 0) {
    info.all = true
  } else {
    const { query: { limit }, } = request
    info.type = 'limit'
    info.limit = limit
  }

  const filters = []
  filters.push(getOwnerFilter(verifiedAuthToken))

  // const filters = [{ isPublished: true }, { publishOn: { $lte: new Date() } }]
  // const filters = [{}]
  try{
    const result = await getAllCourses(_db, filters, info)
    const { status } = result
  
    if ( status === 'error' ) {
      // TODO: Figure out what the error is and send an appropriate code
      reply
        .code(404)
        .send(result)
    } else if ( status === 'ok') {
      const paths = getPaths(config)
      const prefixes = getPrefixes(config)
      result.paths = { ...paths }
      result.prefixes = { ...prefixes }
      reply
        .code(200)
        .send(result)
    }
  } catch (error) {
    throw new Error (`Course Controllers Read All Courses ${error}`)
  }
}

async function readAllCourseTitlesAndSlugs (req, reply) {
  const { mongo: { db: _db } } = this

  const { verifiedAuthToken } = req

  const filters = []
  filters.push(getOwnerFilter(verifiedAuthToken))

  const result = await getAllCourseTitlesAndSlugss(_db, filters)
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

async function acquireCourseByIdAll (req, reply) {
  const { config, mongo: { db: _db, ObjectId: _ObjectId }, } = this
  const { params: { id }, verifiedAuthToken } = req

  const filters = []
  filters.push(getOwnerFilter(verifiedAuthToken))

  const objId = _ObjectId(id)
  filters.push({ _id: objId })

  try {
    const result = await getCourse(_db, filters)
    const { status } = result
    if (status === 'error') {
      // TODO: Figure out what the error is and send an appropriate code
      reply
        .code(404)
        .send(result)
    } else if ( status === 'ok') {
      const paths = getPaths(config)
      const prefixes = getPrefixes(config)
      result.paths = { ...paths }
      result.prefixes = { ...prefixes }
      reply
        .code(200)
        .send(result)
    }
  } catch (error) {
    throw new Error(`Course Controllers Acquire Course By Id All ${error}`)
  }
}

async function readCourseBySlugAll (req, reply) {
  const { config, mongo: { db: _db }, } = this
  const { params: { slug }, verifiedAuthToken } = req

  const filters = []

  filters.push(getOwnerFilter(verifiedAuthToken))
  filters.push({ slug })

  const result = await getCourse(_db, filters)
  const { status } = result

  if ( status === 'error' ) {
    // TODO: Figure out what the error is and send an appropriate code
    reply
      .code(404)
      .send(result)
  } else if ( status === 'ok') {
    const paths = getPaths(config)
    const prefixes = getPrefixes(config)
    result.paths = { ...paths }
    result.prefixes = { ...prefixes }
    reply
      .code(200)
      .send(result)
  }
}

async function readCourseBySlugPublished (req, reply) {
  const { config, mongo: { db: _db }, } = this

  const { params: { slug } } = req
  const filters = [{ isPublished: true }, { publishOn: { $lte: new Date() } }, { slug }]

  try {
    const result = await getCourse(_db, filters)
    const { status } = result
  
    if ( status === 'error' ) {
      // TODO: Figure out what the error is and send an appropriate code
      reply
        .code(404)
        .send(result)
    } else if ( status === 'ok') {
      const paths = getPaths(config)
      const prefixes = getPrefixes(config)
      result.paths = { ...paths }
      result.prefixes = { ...prefixes }
      reply
        .code(200)
        .send(result)
    }
  } catch (error) {
    throw new Error(`Course Controllers Read Course By Slug Published ${error}`)
  }
}

async function readPublishedCourses (req, reply) {
  const { config, mongo: { db: _db }, } = this
  const filters = [{ isPublished: true }, { publishOn: { $lte: new Date() } }]
  const result = await getAllCourses(_db, filters)
  const { status } = result

  if ( status === 'error' ) {
    // TODO: Figure out what the error is and send an appropriate code
    reply
      .code(404)
      .send(result)
  } else if ( status === 'ok') {
    const paths = getPaths(config)
    const prefixes = getPrefixes(config)
    result.paths = { ...paths }
    result.prefixes = { ...prefixes }
    reply
      .code(200)
      .send(result)
  }
}

export {
  acquireCourseByIdAll,
  addCourse,
  addCourseFiles,
  addCourseImages,
  purgeCourse,
  readAllCourses,
  readAllCourseTitlesAndSlugs,
  readCourseBySlugAll,
  readCourseBySlugPublished,
  readPublishedCourses,
  updateCourse
}
