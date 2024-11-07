import {
  createAdvisory,
  readAdvisoriesAll
} from '../../services/v1/advisory-services.mjs'

import {
  readUserById
} from '../../services/v1/user-services.mjs'
import { validateFirstName } from '../../services/v1/validate-services.mjs'

const getAdvisoriesAll = async (_db, _ObjectId, filters) => {
  try {
    const data = await readAdvisoriesAll(_db, _ObjectId, filters)
    if (Array.isArray(data) && data.length > 0) {
      return { status: 'ok', data }
    } else {
      return { status: 'error' }
    }
  } catch (error) {
    throw new Error(`Advisory Models Get Advisories All ${error}`)
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

export {
  getAdvisoriesAll,
  newAdvisory
}