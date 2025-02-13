import * as fsPromises from 'fs/promises'
import sharp from 'sharp'
import { pipeline } from 'stream'
import * as util from 'util'

const createCourse = async (_db, _ObjectId, newCourse) => {
  try {
    const { creatorId: creatorIdValue, difficulty: difficultyValue, publishOn: publishOnValue, ownerId: ownerIdValue } = newCourse
    newCourse.creatorId = _ObjectId(creatorIdValue) // Store creatorId as an ObjectId, useful for doing $lookup
    newCourse.difficulty = _ObjectId(difficultyValue) // Store difficulty as an ObjectId for doing $lookup
    newCourse.publishOn = new Date(publishOnValue) // MongoDB store in native date format
    newCourse.ownerId = _ObjectId(ownerIdValue)
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

const createCourseImage = async (fileName, longestSideDimension, pathFilesImages, pathFilesOriginals, prefixFilesImages) => {
  try {
    const metadata = await sharp(`${pathFilesOriginals}/${fileName}`).metadata()
    const { height, width, orientation } = metadata
    const newSize = width > height && orientation <= 4 ? { width: longestSideDimension } : { height: longestSideDimension }
    newSize.withoutEnlargement = true
    await sharp(`${pathFilesOriginals}/${fileName}`).resize(newSize).rotate().toFile(`${pathFilesImages}/${prefixFilesImages}${fileName}`)
  } catch (error) {
    console.log('ERROR:', error)
  }
}

const createCourseImageThumbnail = async (fileName, pathFilesOriginals, pathFilesThumbnails, prefixFilesThumbnails, thumbWidth, thumbHeight ) => {
  try {
    const newSize = { width: thumbWidth, height: thumbHeight }
    newSize.fit = 'cover'
    await sharp(`${pathFilesOriginals}/${fileName}`).resize(newSize).rotate().toFile(`${pathFilesThumbnails}/${prefixFilesThumbnails}${fileName}`)
  } catch (error) {
    console.log('ERROR:', error)
  }
}
const createCourseImages = async (req, pathFilesImages, pathFilesOriginals, pathFilesThumbnails, prefixFilesImages, prefixFilesThumbnails) => {
  const pump = util.promisify(pipeline)
  try {
    const parts = req.files()
    for await (const part of parts) {
      const filehandle = await fsPromises.open(`${pathFilesOriginals}/${part.filename}`, 'w')
      await pump(part.file, filehandle.createWriteStream())
      await createCourseImage(part.filename, 1920, pathFilesImages, pathFilesOriginals, prefixFilesImages) // TODO: Get image size from settings
      await createCourseImageThumbnail(part.filename, pathFilesOriginals, pathFilesThumbnails, prefixFilesThumbnails, 600, 400) // TODO: Get thumbnail size from settings
    }
    return { status: 'created' }
  } catch (error) {
    return { status: 'error', type: 'upload', message: 'unable to upload one or more files' }
  }
}

const deleteCourse = async (_db, courseId) => {
  const filter = { _id: courseId }

  try {
    const result = await _db.collection('courses').findOneAndDelete(filter)
    return result
  } catch (error) {
    console.log(`\n\ncourse-services ERROR:\n${error}\n\n\n`)
    throw new Error(error)
  }
}

const readAllCourses = async (_db, filters, info) => {
  // TODO: Sanitize filters
  // TODO: Make this a seperate helper function
  const mongoFilters = filters.reduce((obj, item) => {
    const [key] = Object.keys(item)
    const value = item[key]
    obj[key] = value
    return obj
  }, {})

  const aggregation = [
    { $match: mongoFilters },
    {
      $lookup: {
        from: 'difficulty',
        localField: 'difficulty',
        foreignField: '_id',
        as: 'difficultyLevel' 
      }
    },
    {
      $project: {
        difficultyLevel: {
          _id: 0,
          creatorId: 0,
          ownerId: 0
        }
      }
    },
    { $sort: { 'publishOn': -1 } }
  ]

  if (info?.type === 'limit') {
    const { limit } = info
    const limitAsNumber = Number(limit)

    aggregation.push({ $limit: limitAsNumber })
  }

  const cursor = await _db.collection('courses').aggregate(aggregation)
  try {
    const data = await cursor.toArray()
    return data
  } catch (error) {
    throw new Error(`Course Services Read All Courses ${error}`)
  }
}

const readAllCourseTitlesAndSlugs = async (_db, filters) => {
  const mongoFilters = filters.reduce((obj, item) => {
    const [key] = Object.keys(item)
    const value = item[key]
    obj[key] = value
    return obj
  }, {})

  try {
    const cursor = await _db.collection('courses').aggregate([{ $match: mongoFilters}, { $project: { _id: 1, title: 1, slug: 1 } }, { $sort: { 'title': 1 } }])
    const data = await cursor.toArray()
    return data
  } catch (error) {
    throw new Error(`Course Services Read All Course Titles And Slugs ${error}`)
  }
} 

const readCourse = async (_db, filters) => { // The id or slug is included in filters
  // TODO: Sanitize filters
  // TODO: Make this a seperate helper function
  const mongoFilters = filters.reduce((obj, item) => {
    const [key] = Object.keys(item)
    const value = item[key]
    obj[key] = value
    return obj
  }, {})

  try {
    const cursor = await _db.collection('courses').aggregate([{ $match: mongoFilters }, { $lookup: { from: 'users', localField: 'creatorId', foreignField: '_id', as: 'userFullname' } }, { $lookup: { from: 'difficulty', localField: 'difficulty', foreignField: '_id', as: 'difficultyLevel' } }, { $project: { userFullname: { _id:0, emailAddress: 0, passwordHash: 0, role: 0, username: 0, createdBy: 0 } } }])
    const data = await cursor.limit(1).toArray()
    return data
  } catch (error) {
    console.log('ERROR', error)
  }
}

const updateCourse = async (_db, courseId, courseInfo) => {
 try {
   const filter = { _id: courseId }
   const updateDoc = courseInfo

   const result = await _db.collection('courses').updateOne(filter, updateDoc)
   return result
 } catch (error) {
   throw new Error(error)
 }
}

export {
  createCourse,
  createCourseFiles,
  createCourseImages,
  deleteCourse,
  readAllCourses,
  readAllCourseTitlesAndSlugs,
  readCourse,
  updateCourse
}
