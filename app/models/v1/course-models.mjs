import { createCourse, readAllCourses } from '../../services/v1/course-services.mjs'
import { processValidations, validateTimestamp } from '../../services/v1/validate-services.mjs'

const getAllCourses = async (_db, filters) => {
  // TODO: Sanitize filters
  const [ filter ] = filters
  
  const data = await readAllCourses(_db, filter)
  return Array.isArray(data) && data.length > 0 ? { status: 'ok', data } : { status: 'error' }
}

const newCourse = async (_db, courseInfo) => {

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
    location: {
      latitude,
      longitude,
      address,
      street,
      city,
      state,
      country,
      postCode
    },
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
    courseFiles
  } = courseInfo

  const isValidPublishOn = validateTimestamp(publishOn)

  const validations = await Promise.allSettled([isValidPublishOn])
  const fields = ['publishOn'] // These need to be in the same order as Promise.allSettled above

  // Loop through validations
  const validationResults = await processValidations(fields, validations)
  const foundValidationError = validationResults.findIndex((field) => {
    if (field.isValid === false) { return true }
  })

  if (foundValidationError === -1) {
    const data = await createCourse(_db, courseInfo)
    // TODO: check for error and return to view level
    return { status: 'ok', data }
  } else {
    return { status: 'error', type: 'validation', message: 'unable to validate one or more values', validationResults }
  }
}

export { getAllCourses, newCourse}
