import { createDifficultyLevel, readAllDifficultyLevels } from '../../services/v1/difficulty-services.mjs'

const getAllDifficultyLevels = async _db => {
  try {
    const data = await readAllDifficultyLevels(_db)
    if (Array.isArray(data) && data.length > 0) {
      return { status: 'ok', data }
    } else {
      return { status: 'error' }
    }
  } catch (error) {
    throw new Error(`Difficulty Models Get All Difficulty Levels ${error}`)
  }
}

const newDifficultyLevel = async (_db, _ObjectId, info) => {

  // const { anchor, category, description, uri } = linkInfo

  // const isValidAnchor = validateAnchor(anchor)
  // const isValidCategory = validateCategory(category)
  // const isValidDescription = validateDescription(description)
  // const isValidUri = validateUri(uri)

  // const validations = await Promise.allSettled([isValidAnchor, isValidCategory, isValidDescription, isValidUri])
  // const fields = ['anchor', 'category', 'description', 'uri'] // These need to be in the same order as Promise.allSettled above

  // // Loop through validations
  // const validationResults = await processValidations(fields, validations)
  // const foundValidationError = validationResults.findIndex((field) => {
  //   if (field.isValid === false) { return true }
  // })

  const foundValidationError = - 1 // Delete this when the validations are completed
  if (foundValidationError === -1) {
    const data = await createDifficultyLevel(_db, _ObjectId, info)
    // TODO: check for error and return to view level
    return { status: 'ok', data }
  } else {
    return { status: 'error', type: 'validation', message: 'unable to validate one or more values', validationResults }
  }
}

export { getAllDifficultyLevels, newDifficultyLevel }
