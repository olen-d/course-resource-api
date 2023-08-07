const createDifficultyLevel = async (_db, _ObjectId, info) => {
  try {
    const { creatorId: creatorIdValue, ownerId: ownerIdValue } = info
    info.creatorId = _ObjectId(creatorIdValue)
    info.ownerId = _ObjectId(ownerIdValue)

    const result = await _db.collection('difficulty').insertOne(info)
    return result
  } catch (error) {
    throw new Error(`Difficulty Services Create Difficulty Level ${error}`)
  }
}

const readAllDifficultyLevels = async _db => {
  try {
    const cursor = _db.collection('difficulty').find().sort({ 'rating': 1 })
    const data = await cursor.toArray()
    return data
  } catch (error) {
    throw new Error(`Difficulty Services Read All Difficulty Levels ${error}`)
  }
}

export { createDifficultyLevel, readAllDifficultyLevels }
