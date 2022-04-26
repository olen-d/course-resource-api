import { micromark } from 'micromark'
import { gfm, gfmHtml } from 'micromark-extension-gfm'
import { createAboutItem, readAllAboutItems, updateAboutItem } from '../../services/v1/about-services.mjs'
import { validateContent, validateTitle } from '../../services/v1/validate-about-services.mjs'
import { processValidations } from '../../services/v1/validate-services.mjs'

const changeAboutItem = async (_db, _ObjectId, aboutItemId, aboutItemInfo) => {
  const aboutItemInfoProcessed = { $set: {} }
  const aboutItemObjId = _ObjectId(aboutItemId)

  for (const key of Object.keys(aboutItemInfo)) {
    aboutItemInfoProcessed.$set[key] = aboutItemInfo[key]
  }

  try {
    const data = await updateAboutItem(_db, aboutItemObjId, aboutItemInfoProcessed)
    // TODO: check for error and return to view level
    return { status: 'ok', data }
  } catch (error) {
    const { message } = error
    return { status: 'error', message }
  }
}

const getAllAboutItems = async _db => {
  const data = await readAllAboutItems(_db)
  if (Array.isArray(data) && data.length > 0) {
    const dataProcessed = data.map(element => {
      const contentHtml = micromark(element.content, {
        extensions: [gfm()],
        htmlExtensions: [gfmHtml()]
      })
      element.contentHtml = contentHtml
      return element
    })
    return { status: 'ok', data: dataProcessed } 
  } else {
    return { status: 'error' }
  }
}

const newAboutItem = async (_db, _ObjectId, aboutItemInfo) => {

  const { content, title } = aboutItemInfo

  const isValidContent = validateContent(content)
  const isValidTitle = validateTitle(title)

  const validations = await Promise.allSettled([isValidContent, isValidTitle])
  const fields = ['content', 'title'] // These need to be in the same order as Promise.allSettled above

  // Loop through validations
  const validationResults = await processValidations(fields, validations)
  const foundValidationError = validationResults.findIndex((field) => {
    if (field.isValid === false) { return true }
  })

  if (foundValidationError === -1) {
    const data = await createAboutItem(_db, _ObjectId, aboutItemInfo)
    // TODO: check for error and return to view level
    return { status: 'ok', data }
  } else {
    return { status: 'error', type: 'validation', message: 'unable to validate one or more values', validationResults }
  }
}

export { changeAboutItem, getAllAboutItems, newAboutItem }
