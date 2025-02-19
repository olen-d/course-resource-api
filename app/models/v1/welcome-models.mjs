import { micromark } from 'micromark'
import { gfm, gfmHtml } from 'micromark-extension-gfm'
import { createWelcomeItem, readWelcomeItem, readAllWelcomeItems, updateWelcomeItem } from '../../services/v1/welcome-services.mjs'
import { validateContent, validateTitle } from '../../services/v1/validate-welcome-services.mjs'
import { processValidations } from '../../services/v1/validate-services.mjs'

const changeWelcomeItem = async (_db, _ObjectId, welcomeItemId, welcomeItemInfo) => {
  const welcomeItemInfoProcessed = { $set: {} }
  const welcomeItemObjId = _ObjectId(welcomeItemId)

  for (const key of Object.keys(welcomeItemInfo)) {
    welcomeItemInfoProcessed.$set[key] = welcomeItemInfo[key]
  }

  try {
    const data = await updateWelcomeItem(_db, welcomeItemObjId, welcomeItemInfoProcessed)
    // TODO: check for error and return to view level
    return { status: 'ok', data }
  } catch (error) {
    const { message } = error
    return { status: 'error', message }
  }
}

const getWelcomeItem = async (_db, filters) => {
  try {
    const data = await readWelcomeItem(_db, filters)
    if(Array.isArray(data) && data.length > 0) {
      const [{ content, userFullname: [{ firstName, lastName }] }] = data
      const contentHtml = micromark(content, {
        extensions: [gfm()],
        htmlExtensions: [gfmHtml()]
      })
      data[0].contentHtml = contentHtml
      data[0].userFullname = `${firstName} ${lastName}`
      return { status: 'ok', data }
    } else {
      return { status: 'error' }
    }
  } catch (error) {
    throw new Error(`Welcome Models Get Welcome Item ${error}`)
  }
}

const getAllWelcomeItems = async (_db, filters) => {
  const data = await readAllWelcomeItems(_db, filters)
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

const newWelcomeItem = async (_db, _ObjectId, info) => {

  const { content, title } = info

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
    const data = await createWelcomeItem(_db, _ObjectId, info)
    // TODO: check for error and return to view level
    return { status: 'ok', data }
  } else {
    return { status: 'error', type: 'validation', message: 'unable to validate one or more values', validationResults }
  }
}

export { changeWelcomeItem, getWelcomeItem, getAllWelcomeItems, newWelcomeItem }
