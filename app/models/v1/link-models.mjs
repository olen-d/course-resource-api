import { createLink, readAllLinks, readLinkById } from '../../services/v1/link-services.mjs'

const newLink = async (_db, _ObjectId, linkInfo) => {

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
    const data = await createLink(_db, _ObjectId, linkInfo)
    // TODO: check for error and return to view level
    return { status: 'ok', data }
  } else {
    return { status: 'error', type: 'validation', message: 'unable to validate one or more values', validationResults }
  }
}

const getAllLinks = async (_db, filters) => {
  const data = await readAllLinks(_db, filters)
  if (Array.isArray(data) && data.length > 0) {
    return { status: 'ok', data } 
  } else {
    return { status: 'error' }
  }
}

const getLinkById = async (_db, filters, objId) => {
  // TODO: Santize the id
  filters.push({ _id: objId })

  try{
    const data = await readLinkById(_db, filters)
    if(Array.isArray(data) && data.length > 0) {
      const [{ userFullname: [{ firstName, lastName }] }] = data
      data[0].userFullname = `${firstName} ${lastName}`
      return { status: 'ok', data }
    } else {
      return { status: 'error' }
    }
  } catch(error) {
    const { message } = error
    return { status: 'error', message }
  }
}

export { newLink, getAllLinks, getLinkById }
