import { micromark } from 'micromark'
import { gfm, gfmHtml } from 'micromark-extension-gfm'
import {
  createCourse,
  deleteCourse,
  readAllCourses,
  readAllCourseTitlesAndSlugs,
  readCourseBySlug,
  updateCourse
} from '../../services/v1/course-services.mjs'
import { processValidations, validateTimestamp } from '../../services/v1/validate-services.mjs'

const changeCourse = async (_db, _ObjectId, courseId, courseInfo) => {
  const dogStatisticsFields = [
    'totalChases',
    'totalDogs',
    'totalLegs'
  ]

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

  if (courseInfo.difficulty) {courseInfo.difficulty = _ObjectId(courseInfo.difficulty)}
  if (courseInfo.publishOn) {courseInfo.publishOn = new Date(courseInfo.publishOn)} // MongoDB store in native date format

  for (const key of Object.keys(courseInfo)) {
    const indexDog = dogStatisticsFields.findIndex(dogStatistic => dogStatistic === key)
    const indexLoc = locationFields.findIndex(location => location === key)
    if (indexDog !== -1) {
      courseInfoProcessed.$set[`dogStatistics.${[key]}`] = courseInfo[key]
    } else if (indexLoc !== -1 ) {
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

const getAllCourseTitlesAndSlugss = async (_db, filters) => {
  const data = await readAllCourseTitlesAndSlugs(_db, filters)
  return Array.isArray(data) && data.length > 0 ? { status: 'ok', data } : { status: 'error' }
}

const getCourseBySlug = async (_db, filters, slug) => {
  // TODO: Santize the slug
  filters.push({ slug })

  const data = await readCourseBySlug(_db, filters)
  if(Array.isArray(data) && data.length > 0) {
    const [{ summary, userFullname: [{ firstName, lastName }] }] = data
    const summaryHtml = micromark(summary, {
      extensions: [gfm()],
      htmlExtensions: [gfmHtml()]
    })
    data[0].summaryHtml = summaryHtml
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
    mapLink,
    totalChases,
    totalDogs,
    totalLegs
  } = courseInfo

  const dogStatisticsFields = [
    'totalChases',
    'totalDogs',
    'totalLegs'
  ]

  const locationFields = [
    'latitude',
    'longitude',
    'address',
    'city',
    'state',
    'country',
    'postcode'
  ]

  const courseInfoProcessed = {}
  const dogStatistics = {}
  const location = {}

  for (const key of Object.keys(courseInfo)) {
    const indexDog = dogStatisticsFields.findIndex(dogStatistic => dogStatistic === key)
    const indexLoc = locationFields.findIndex(location => location === key)
    if (indexDog !== -1) {
      dogStatistics[key] = courseInfo[key]
    } else if (indexLoc !== -1 ) {
      location[key] = courseInfo[key]
    } else {
      courseInfoProcessed[key] = courseInfo[key]
    }
  }

  courseInfoProcessed.location = location
  courseInfoProcessed.dogStatistics = dogStatistics

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

const removeCourse = async (_db, _ObjectId, courseId) => {
  const courseObjId = _ObjectId(courseId)

  try {
    const data = await deleteCourse(_db, courseObjId)
    // TODO: check for error and return to view level
    return { status: 'ok', data }
  } catch (error) {
    return { status: 'error', message }
  }
}

export {
  changeCourse,
  getAllCourses,
  getAllCourseTitlesAndSlugss,
  getCourseBySlug,
  newCourse,
  removeCourse
}
