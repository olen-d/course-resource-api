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

export { createCourse, readAllCourses }
