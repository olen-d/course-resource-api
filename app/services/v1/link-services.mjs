const createLink = async (_db, _ObjectId, linkInfo) => {
  const { creatorId: creatorIdValue, ownerId: ownerIdValue } = linkInfo
  linkInfo.creatorId = _ObjectId(creatorIdValue) // Store creatorId as an ObjectId, useful for doing $lookup
  linkInfo.ownerId = _ObjectId(ownerIdValue)

  try {
    const result = await _db.collection('links').insertOne(linkInfo)
    return result
  } catch (error) {
  throw new Error(error)
  }
}

const readAllLinks = async (_db, filters) => {
  // TODO: Sanitize filters
  // TODO: Make this a seperate helper function
  const mongoFilters = filters.reduce((obj, item) => {
    const [key] = Object.keys(item)
    const value = item[key]
    obj[key] = value
    return obj
  }, {})

  try {
    const cursor = await _db.collection('links').find(mongoFilters).sort({ 'order': 1 })
    const data = await cursor.toArray()
    return data
  } catch (error) {
    throw new Error(error)
  }
}

export { createLink, readAllLinks }
