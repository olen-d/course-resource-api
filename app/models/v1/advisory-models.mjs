import {
  createAdvisory,
  deleteAdvisory,
  readAdvisoriesAll,
  readAdvisoriesCoursesIds,
  updateAdvisory
} from '../../services/v1/advisory-services.mjs'

import {
  readUserById
} from '../../services/v1/user-services.mjs'

const changeAdvisory = async (_db, _ObjectId, info) => {
  const { advisoryId: itemId, authorId, coursesAffected, ...rest } = info

  const coursesAffectedObjIds = coursesAffected.map(element => {
    return _ObjectId(element)
  })
  rest.coursesAffected = coursesAffectedObjIds

  const infoProcessed = { $set: {} }

  for (const key of Object.keys(rest)) {
    infoProcessed.$set[key] = rest[key]
  }

  try {
    const userInfo = {}
    const updatedInfo = {}

    userInfo.userId = authorId
    const userData = await readUserById(_db, _ObjectId, userInfo)
    const updateTimestamp = Date.now()

    if (userData?.firstName && userData?.lastName) {
      const { firstName, lastName } = userData
      updatedInfo.by = { userId: authorId, firstName, lastName }
      updatedInfo.at = updateTimestamp
    } else {
      updatedInfo.by = { userId: authorId, firstName: null, lastName: null }
      updatedInfo.at = updateTimestamp
    }
    const data = await updateAdvisory(_db, _ObjectId, itemId, infoProcessed, updatedInfo)
    return { status: 'ok', data }
  } catch (error) {
    throw new Error(`Advisory Models Change Advisory ${error}`)
  }
}

const getAdvisoriesAll = async (_db, filters) => {
  try {
    const data = await readAdvisoriesAll(_db, filters)
    if (Array.isArray(data) && data.length > 0) {
      return { status: 'ok', data }
    } else {
      return { status: 'error' }
    }
  } catch (error) {
    throw new Error(`Advisory Models Get Advisories All ${error}`)
  }
}

const getAdvisoriesCoursesIds = async (_db, filters) => {
  try {
    const data = await readAdvisoriesCoursesIds(_db, filters)
    if (Array.isArray(data) && data.length > 0) {
      return { status: 'ok', data }
    } else {
      return { status: 'error' }
    }
  } catch (error) {
    throw new Error(`Advisory Models Get Advisories Courses Ids ${error}`)
  }
}

const newAdvisory = async (_db, _ObjectId, info) => {
  const foundValidationError = - 1 // Delete this when the validations are completed
  if (foundValidationError === -1) {

    const { creatorId: creatorIdValue } = info
    const creatorId = _ObjectId(creatorIdValue)

    const updateTimestamp = Date.now()

    try{
      const userInfo = {}
      userInfo.userId = creatorIdValue
      const userData = await readUserById(_db, _ObjectId, userInfo)
      if (userData?.firstName && userData?.lastName) {
       const { firstName, lastName } = userData
       info.updated = [{ by: { userId: creatorId, firstName, lastName }, at: updateTimestamp }]
      } else {
        info.updated = [{ by: { userId: creatorId, firstName: null, lastName: null }, at: updateTimestamp }]
      }

      const data = await createAdvisory(_db, _ObjectId, info)
      // TODO: check for error and return to view level
      return { status: 'ok', data }
    } catch (error) {
      throw new Error(`Advisory Models New Advisory ${error}`)
    }
  } else {
    return { status: 'error', type: 'validation', message: 'unable to validate one or more values', validationResults }
  }
}

const removeAdvisory = async (_db, _ObjectId, advisoryId) => {
  const advisoryObjId = _ObjectId(advisoryId)

  try {
    const data = await deleteAdvisory(_db, advisoryObjId)
    // TODO: check for error and return to view level
    return { status: 'ok', data }
  } catch (error) {
    throw new Error(`Advisory Models Remove Advisory ${error}`)
  }
}

export {
  changeAdvisory,
  getAdvisoriesAll,
  getAdvisoriesCoursesIds,
  newAdvisory,
  removeAdvisory
}