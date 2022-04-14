import { createCourse, readAllCourses, readCourseBySlug, updateCourse } from '../../services/v1/course-services.mjs'
import { processValidations, validateTimestamp } from '../../services/v1/validate-services.mjs'

const changeCourse = async (_db, _ObjectId, courseId, courseInfo) => {
  const locationFields = [
    'latitude',
    'longitude',
    'address',
    'city',
    'state',
    'country',
    'postcode'
  ]

  const courseInfoProcessed = { $set: {} }
  const courseObjId = _ObjectId(courseId)

  if (courseInfo.publishOn) {courseInfo.publishOn = new Date(courseInfo.publishOn)} // MongoDB store in native date format

  for (const key of Object.keys(courseInfo)) {
    const index = locationFields.findIndex(location => location === key)
    if (index !== -1) {
      courseInfoProcessed.$set[`location.${[key]}`] = courseInfo[key]
    } else {
      courseInfoProcessed.$set[key] = courseInfo[key]
    }
  }

  try {
    const data = await updateCourse(_db, courseObjId, courseInfoProcessed)
    // TODO: check for error and return to view level
    return { status: 'ok', data }
  } catch (error) {
    const { message } = error
    return { status: 'error', message }
  }
}

const getAllCourses = async (_db, filters) => {
  const data = await readAllCourses(_db, filters)
  return Array.isArray(data) && data.length > 0 ? { status: 'ok', data } : { status: 'error' }
}

const getCourseBySlug = async (_db, filters, slug) => {
  // TODO: Santize the slug
  filters.push({ slug })

  const data = await readCourseBySlug(_db, filters)
  if(Array.isArray(data) && data.length > 0) {
    const [{userFullname: [{ firstName, lastName }] }] = data
    data[0].userFullname = `${firstName} ${lastName}`
    return { status: 'ok', data }
  } else {
    return { status: 'error' }
  }
}

const newCourse = async (_db, _ObjectId, courseInfo) => {

  // new Date()
  const {
    title,
    slug,
    creatorId,
    ownerId,
    isPublished,
    publishOn,
    length,
    ascent,
    latitude,
    longitude,
    address,
    street,
    city,
    state,
    country,
    postCode,
    difficulty,
    summary,
    type,
    terrain,
    setting,
    happiness,
    facts,
    parking,
    creation,
    photographs,
    courseFiles,
    mapLink
  } = courseInfo

  const locationFields = [
    'latitude',
    'longitude',
    'address',
    'city',
    'state',
    'country',
    'postcode'
  ]

  const location = {}
  const courseInfoProcessed = {}

  for (const key of Object.keys(courseInfo)) {
    const index = locationFields.findIndex(location => location === key)
    if (index !== -1) {
      location[key] = courseInfo[key]
    } else {
      courseInfoProcessed[key] = courseInfo[key]
    }
  }

  courseInfoProcessed.location = location

  const isValidPublishOn = validateTimestamp(publishOn)

  const validations = await Promise.allSettled([isValidPublishOn])
  const fields = ['publishOn'] // These need to be in the same order as Promise.allSettled above

  // Loop through validations
  const validationResults = await processValidations(fields, validations)
  const foundValidationError = validationResults.findIndex((field) => {
    if (field.isValid === false) { return true }
  })

  if (foundValidationError === -1) {
    const data = await createCourse(_db, _ObjectId, courseInfoProcessed)
    // TODO: check for error and return to view level
    return { status: 'ok', data }
  } else {
    return { status: 'error', type: 'validation', message: 'unable to validate one or more values', validationResults }
  }
}

export { changeCourse, getAllCourses, getCourseBySlug, newCourse}
