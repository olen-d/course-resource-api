const createAboutItem = async (_db, aboutItem) => {
  try {
    const result = await _db.collection('about').insertOne(aboutItem)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export { createAboutItem }
