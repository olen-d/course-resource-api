const createWelcomeItem = async (_db, _ObjectId, info) => {
  try {
    const { creatorId: creatorIdValue, ownerId: ownerIdValue } = info
    info.creatorId = _ObjectId(creatorIdValue) // Store creatorId as an ObjectId, useful for doing $lookup
    info.ownerId = _ObjectId(ownerIdValue)
    const result = await _db.collection('welcome').insertOne(info)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const readWelcomeItem = async (_db, filters) => { // The slug is included in filters
  // TODO: Sanitize filters
  // TODO: Make this a seperate helper function
  const mongoFilters = filters.reduce((obj, item) => {
    const [key] = Object.keys(item)
    const value = item[key]
    obj[key] = value
    return obj
  }, {})

  try {
    const cursor = await _db.collection('welcome').aggregate([{ $match: mongoFilters }, { $lookup: { from: 'users', localField: 'creatorId', foreignField: '_id', as: 'userFullname' } }, { $project: { userFullname: { _id: 0, emailAddress: 0, passwordHash: 0, role: 0, username: 0, createdBy: 0 } } }])
    const data = await cursor.limit(1).toArray()
    return data
  } catch (error) {
    throw new Error(error)
  }
}

const readAllWelcomeItems = async (_db, filters) => {
  // TODO: Sanitize filters
  // TODO: Make this a seperate helper function
  const mongoFilters = filters.reduce((obj, item) => {
    const [key] = Object.keys(item)
    const value = item[key]
    obj[key] = value
    return obj
  }, {})

  const cursor = await _db.collection('welcome').find(mongoFilters).sort({ 'order': 1 })

  try {
    const data = await cursor.toArray()
    return data
  } catch (error) {
    throw new Error(error)
  }
}

const updateWelcomeItem = async (_db, welcomeItemId, welcomeItemInfo) => {
  try {
    const filter = { _id: welcomeItemId }
    const updateDoc = welcomeItemInfo
 
    const result = await _db.collection('welcome').updateOne(filter, updateDoc)
    return result
  } catch (error) {
    throw new Error(error)
  }
 }

export {
  createWelcomeItem,
  readWelcomeItem,
  readAllWelcomeItems,
  updateWelcomeItem
}
