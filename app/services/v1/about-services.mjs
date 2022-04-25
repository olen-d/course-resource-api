const createAboutItem = async (_db, aboutItem) => {
  try {
    const result = await _db.collection('about').insertOne(aboutItem)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const readAllAboutItems = async _db => {
  const cursor = await _db.collection('about').find()

  try {
    const data = await cursor.toArray()
    return data
  } catch (error) {
    throw new Error(error)
  }
}

export { createAboutItem, readAllAboutItems }
