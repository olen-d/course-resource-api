const createAboutItem = async (_db, _ObjectId, aboutItemInfo) => {
  try {
    const { creatorId: creatorIdValue, ownerId: ownerIdValue } = aboutItem
    aboutItemInfo.creatorId = _ObjectId(creatorIdValue) // Store creatorId as an ObjectId, useful for doing $lookup
    aboutItemInfo.ownerId = _ObjectId(ownerIdValue)
    const result = await _db.collection('about').insertOne(aboutItemInfo)
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

export { createAboutItem, readAllAboutItems, updateAboutItem }
