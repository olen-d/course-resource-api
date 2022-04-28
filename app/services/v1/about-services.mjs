const createAboutItem = async (_db, _ObjectId, aboutItemInfo) => {
  try {
    const { creatorId: creatorIdValue, ownerId: ownerIdValue } = aboutItemInfo
    aboutItemInfo.creatorId = _ObjectId(creatorIdValue) // Store creatorId as an ObjectId, useful for doing $lookup
    aboutItemInfo.ownerId = _ObjectId(ownerIdValue)
    const result = await _db.collection('about').insertOne(aboutItemInfo)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const readAboutItemBySlug = async (_db, filters) => { // The slug is included in filters
  // TODO: Sanitize filters
  // TODO: Make this a seperate helper function
  const mongoFilters = filters.reduce((obj, item) => {
    const [key] = Object.keys(item)
    const value = item[key]
    obj[key] = value
    return obj
  }, {})

  try {
    const cursor = await _db.collection('about').aggregate([{ $match: mongoFilters }, { $lookup: { from: 'users', localField: 'creatorId', foreignField: '_id', as: 'userFullname' } }, { $project: { userFullname: { _id:0, emailAddress: 0, passwordHash: 0, role: 0, username: 0, createdBy: 0 } } }])
    const data = await cursor.limit(1).toArray()
    return data
  } catch (error) {
    throw new Error(error)
  }
}

const readAllAboutItems = async (_db, filters) => {
  // TODO: Sanitize filters
  // TODO: Make this a seperate helper function
  const mongoFilters = filters.reduce((obj, item) => {
    const [key] = Object.keys(item)
    const value = item[key]
    obj[key] = value
    return obj
  }, {})

  const cursor = await _db.collection('about').find(mongoFilters).sort({ 'order': 1 })

  try {
    const data = await cursor.toArray()
    return data
  } catch (error) {
    throw new Error(error)
  }
}

const updateAboutItem = async (_db, aboutItemId, aboutItemInfo) => {
  try {
    const filter = { _id: aboutItemId }
    const updateDoc = aboutItemInfo
 
    const result = await _db.collection('about').updateOne(filter, updateDoc)
    return result
  } catch (error) {
    throw new Error(error)
  }
 }

export { createAboutItem, readAboutItemBySlug, readAllAboutItems, updateAboutItem }
