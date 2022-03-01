import * as fsPromises from 'fs/promises'
import sharp from 'sharp'
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

const createCourseImage = async (fileName, longestSideDimension, pathFilesImages, pathFilesOriginals) => {
  try {
    const metadata = await sharp(`${pathFilesOriginals}/${fileName}`).metadata()
    const { height, width, orientation } = metadata
    const newSize = width > height && orientation <= 4 ? { width: longestSideDimension } : { height: longestSideDimension }
    newSize.withoutEnlargement = true
    await sharp(`${pathFilesOriginals}/${fileName}`).resize(newSize).rotate().toFile(`${pathFilesImages}/img_${fileName}`)
  } catch (error) {
    console.log('ERROR:', error)
  }
}

const createCourseImageThumbnail = async (fileName, pathFilesOriginals, pathFilesThumbnails, thumbWidth, thumbHeight ) => {
  try {
    const newSize = { width: thumbWidth, height: thumbHeight }
    newSize.fit = 'cover'
    await sharp(`${pathFilesOriginals}/${fileName}`).resize(newSize).rotate().toFile(`${pathFilesThumbnails}/thumb_${fileName}`)
  } catch (error) {
    console.log('ERROR:', error)
  }
}

const createCourseImages = async (req, pathFilesImages, pathFilesOriginals, pathFilesThumbnails) => {
  const pump = util.promisify(pipeline)
  try {
    const parts = req.files()
    for await (const part of parts) {
      const filehandle = await fsPromises.open(`${pathFilesOriginals}/${part.filename}`, 'w')
      await pump(part.file, filehandle.createWriteStream())
      await createCourseImage(part.filename, 1920, pathFilesImages, pathFilesOriginals) // TODO: Get image size from settings
      await createCourseImageThumbnail(part.filename, pathFilesOriginals, pathFilesThumbnails, 300, 200) // TODO: Get thumbnail size from settings
    }
    return { status: 'created' }
  } catch (error) {
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
