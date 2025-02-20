import { micromark } from 'micromark'
import { gfm, gfmHtml } from 'micromark-extension-gfm'
import {
  createAboutItem,
  readAboutItemById,
  readAboutItemBySlug,
  readAllAboutItems,
  updateAboutItem
} from '../../services/v1/about-services.mjs'
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
const getAboutItemById = async (_db, _ObjectId, filters, info) => {
  const { id } = info

  filters.push({ _id: _ObjectId(id) })

  try {
    const data = await readAboutItemById(_db, filters)
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
    throw new Error(`About Models Get About Item By Id ${error}`)
  }
}

const getAboutItemBySlug = async (_db, filters, slug) => {
  // TODO: Santize the slug
  filters.push({ slug })

  const data = await readAboutItemBySlug(_db, filters)
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
}

const getAllAboutItems = async (_db, filters) => {
  const data = await readAllAboutItems(_db, filters)
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

const newAboutItem = async (_db, _ObjectId, info) => {

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
    const data = await createAboutItem(_db, _ObjectId, info)
    // TODO: check for error and return to view level
    return { status: 'ok', data }
  } else {
    return { status: 'error', type: 'validation', message: 'unable to validate one or more values', validationResults }
  }
}

export {
  changeAboutItem,
  getAboutItemById,
  getAboutItemBySlug,
  getAllAboutItems,
  newAboutItem
}
