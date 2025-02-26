const createDifficultyLevel = async (_db, _ObjectId, info) => {
  const { creatorId: creatorIdValue, ownerId: ownerIdValue } = info

  info.creatorId = _ObjectId(creatorIdValue)
  info.ownerId = _ObjectId(ownerIdValue)

  try {
    const result = await _db.collection('difficulty').insertOne(info)
    return result
  } catch (error) {
    throw new Error(`Difficulty Services Create Difficulty Level ${error}`)
  }
}

const deleteDifficultyLevel = async (_db, info) => {
  const { levelObjId } = info
  const filter = { _id: levelObjId }

  try {
    const result = await _db.collection('difficulty').findOneAndDelete(filter)
    return result
  } catch (error) {
    throw new Error(`Difficulty Services Delete Difficulty Level ${error}`)
  }
}

const readAllDifficultyLevels = async _db => {
  const cursor = _db.collection('difficulty').find().sort({ 'rating': 1 })

  try {
    const data = await cursor.toArray()
    return data
  } catch (error) {
    throw new Error(`Difficulty Services Read All Difficulty Levels ${error}`)
  }
}

const readDifficultyById = async (_db, filters) => { //id is in the filters
  // TODO: Sanitize filters
  // TODO: Make this a seperate helper function
  const mongoFilters = filters.reduce((obj, item) => {
    const [key] = Object.keys(item)
    const value = item[key]
    obj[key] = value
    return obj
  }, {})

  try {
    const cursor = await _db.collection('difficulty').aggregate([{ $match: mongoFilters }])
    const data = await cursor.limit(1).toArray()
    return data
  } catch (error) {
    throw new Error(`Difficulty Services Read Difficulty By Id ${error}`)
  }
}

const updateDifficulty = async (_db, objId, info) => {
  const filter = { _id: objId }
  const updateDoc = info

  try { 
    const result = await _db.collection('difficulty').updateOne(filter, updateDoc)
    return result
  } catch (error) {
    throw new Error(`Difficulty Services Update Difficulty ${error}`)
  }
}

export {
  createDifficultyLevel,
  deleteDifficultyLevel,
  readAllDifficultyLevels,
  readDifficultyById,
  updateDifficulty
}
