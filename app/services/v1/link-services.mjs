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

const readLinkById = async (_db, filters) => { // The id is included in filters
  // TODO: Sanitize filters
  // TODO: Make this a seperate helper function
  const mongoFilters = filters.reduce((obj, item) => {
    const [key] = Object.keys(item)
    const value = item[key]
    obj[key] = value
    return obj
  }, {})
  try {
    const cursor = await _db.collection('links').aggregate([{ $match: mongoFilters }, { $lookup: { from: 'users', localField: 'creatorId', foreignField: '_id', as: 'userFullname' } }, { $project: { userFullname: { _id: 0, emailAddress: 0, passwordHash: 0, role: 0, username: 0, createdBy: 0 } } }])
    const data = await cursor.limit(1).toArray()
    return data
  } catch (error) {
    throw new Error(error)
  }
}

const updateLink = async (_db, linkInfo, objId) => {
  try {
    const filter = { _id: objId }
    const updateDoc = linkInfo
 
    const result = await _db.collection('links').updateOne(filter, updateDoc)
    return result
  } catch (error) {
    throw new Error(error)
  }
 }

export { createLink, readAllLinks, readLinkById, updateLink }
