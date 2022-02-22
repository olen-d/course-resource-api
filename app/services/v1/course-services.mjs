import * as fsPromises from 'fs/promises'
import { pipeline } from 'stream'
import * as util from 'util'

const createCourse = async (_db, newCourse) => {
  try {
    const { publishOn: publishOnValue } = newCourse
    newCourse.publishOn = new Date(publishOnValue) // MongoDB store in native date format
    const result = await _db.collection('courses').insertOne(newCourse)
    return result
  } catch (error) {
    console.log('ERROR:', error)
  }
}
const createCourseFiles = async (req, pathFilesCourses) => {
  const pump = util.promisify(pipeline)
  try {
    const parts = req.files()
    for await (const part of parts) {
      const filehandle = await fsPromises.open(`${pathFilesCourses}/${part.filename}`, 'w')
      await pump(part.file, filehandle.createWriteStream())
    }
    return { status: 'created' }
  } catch (error) {
    return { status: 'error', type: 'upload', message: 'unable to upload one or more files' }
  }
}

const createCourseImages = async (req, pathFilesImages) => {
  const pump = util.promisify(pipeline)
  try {
    const parts = req.files()
    for await (const part of parts) {
      const filehandle = await fsPromises.open(`${pathFilesImages}/${part.filename}`, 'w')
      await pump(part.file, filehandle.createWriteStream())
    }
    return { status: 'created' }
  } catch (error) {
    console.log(`\n\n${JSON.stringify(error, null, 2)}\n\n\n`)
    return { status: 'error', type: 'upload', message: 'unable to upload one or more files' }
  }
}

const readAllCourses = async (_db, filters) => {
  // TODO: Sanitize filters
  const mongoFilters = filters.reduce((obj, item) => {
    const [key] = Object.keys(item)
    const value = item[key]
    obj[key] = value
    return obj
  }, {})

  const cursor = await _db.collection('courses').find(mongoFilters).sort({ 'publishOn': -1 })

  try {
    const data = await cursor.toArray()
    return data
  } catch (error) {
    console.log('ERROR:', error)
  }
}

export { createCourse, createCourseFiles, createCourseImages, readAllCourses }
