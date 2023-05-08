const createStory = async (_db, _ObjectId, info) => {
  try {
    const { creatorId: creatorIdValue, ownerId: ownerIdValue } = info
    info.creatorId = _ObjectId(creatorIdValue)
    info.ownerId = _ObjectId(ownerIdValue)

    const result = await _db.collection('news').insertOne(info)
    return result
  } catch (error) {
    throw new Error(`News Services Create Story ${error}`)
  }
}

const deleteStory = async (_db, id) => {
  try {
    const filter = { _id: id }

    const data = await _db.collection('news').findOneAndDelete(filter)
    return data
  } catch (error) {
    throw new Error(`News Services Delete Story ${error}`)
  }
}

const readAllStories = async (_db, filters) => {
  // TODO: Sanitize filters
  // TODO: Make this a seperate helper function
  const mongoFilters = filters.reduce((obj, item) => {
    const [key] = Object.keys(item)
    const value = item[key]
    obj[key] = value
    return obj
  }, {})

  try {
    const cursor = await _db.collection('news').find(mongoFilters).sort({ 'publishOn': -1 })
    const data = await cursor.toArray()
    return data
  } catch (error) {
    throw new Error(`News Services Read All Stories ${error}`)
  }
}

const updateStory = async (_db, objId, info) => {
  try {
    const filter = { _id: objId }
    const updateDoc = info
 
    const result = await _db.collection('news').updateOne(filter, updateDoc)
    return result
  } catch (error) {
    throw new Error(`News Services Update Story ${error}`)
  }
 }

export { createStory, deleteStory, readAllStories, updateStory }
