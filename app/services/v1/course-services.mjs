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
  const cursor = _db.collection('courses').find(filters)

  try {
    const data = await cursor.toArray()
    return data
  } catch (error) {
    console.log('ERROR:', error)
  }
}

export { createCourse, readAllCourses }
