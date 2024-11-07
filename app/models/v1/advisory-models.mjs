import {
  createAdvisory
} from '../../services/v1/advisory-services.mjs'

const newAdvisory = async (_db, _ObjectId, info) => {
  const foundValidationError = - 1 // Delete this when the validations are completed
  if (foundValidationError === -1) {

    const { creatorId: creatorIdValue } = info
    const creatorId = _ObjectId(creatorIdValue)

    const updateTimestamp = Date.now()
    info.updated = [{ by: creatorId, at: updateTimestamp }]

    try{
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
  newAdvisory
}