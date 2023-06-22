import {
  createStory,
  deleteStory,
  readAllStories,
  readStoryById,
  updateStory 
} from '../../services/v1/news-services.mjs'

const changeStory= async (_db, objId, info, sub) => {
  try {
    const infoProcessed = { $set: {} }

    for (const key of Object.keys(info)) {
      infoProcessed.$set[key] = info[key]
    }

    const data = await updateStory(_db, objId, infoProcessed, sub)
    return { status: 'ok', data }
  } catch (error) {
    throw new Error(`News Models Change Story ${error}`)
  }
}

const getAllStories = async (_db, filters) => {
  try {
    const data = await readAllStories(_db, filters)
    if (Array.isArray(data) && data.length > 0) {
      return { status: 'ok', data }
    } else {
      return { status: 'error' }
    }
  } catch (error) {
    throw new Error(`News Models Get All Stories ${error}`)
  }
}

const getStoryById = async (_db, filters) => {
  try {
    const data = await readStoryById(_db, filters)
    if (Array.isArray(data) && data.length > 0) {
      return { status: 'ok', data } 
    } else {
      return { status: 'error' }
    }
  } catch (error) {
    throw new Error(`News Models Get Story By Id ${error}`)
  }
}

const newStory = async (_db, _ObjectId, info) => {
  try {
    const {
      article,
      brief,
      creatorId,
      expiresOn,
      headline,
      isPublished,
      ownerId,
      publishOn,
      slug,
      updated: currentUpdate
    } = info

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
      info.updated = [ currentUpdate ] // TODO: Make this more elegent in the future
      const data = await createStory(_db, _ObjectId, info)
      // TODO: check for error and return to view level
      return { status: 'ok', data }
    } else {
      return { status: 'error', type: 'validation', message: 'unable to validate one or more values', validationResults }
    }
  } catch (error) {
    throw new Error(`News Models New Story ${error}`)
  }
}

const removeStory = async (_db, _ObjectId, id) => {
  try {
    const objId = _ObjectId(id)

    const data = await deleteStory(_db, objId)
    // TODO: check for error and return to view level
    return { status: 'ok', data }
  } catch (error) {
    throw new Error(`News Models Remove Story ${error}`)
  }
}

export {
  changeStory,
  getAllStories,
  getStoryById,
  newStory,
  removeStory
}
