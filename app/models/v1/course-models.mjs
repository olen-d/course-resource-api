import { createCourse, readAllCourses } from '../../services/v1/course-services.mjs'

const getAllCourses = async (_db) => {
  const data = await readAllCourses(_db)
  return Array.isArray(data) && data.length > 0 ? { status: 'ok', data } : { status: 'error' }
}

const newCourse = async (_db, courseInfo) => {
  const {
    title,
    slug,
    userId,
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

  // !TODO: check the errors array for "true" and send the errors up to the controller
  const foundValidationError = -1
  if (foundValidationError === -1) {
    const data = await createCourse(_db, courseInfo)
    return { status: 'ok', data }
  } else {
    return { status: 'error', type: 'validation', message: 'unable to validate one or more values', validationResults }
  }
}

export { getAllCourses, newCourse}
