const createAdvisory = async (_db, _ObjectId, info) => {

  const { coursesAffected, creatorId: creatorIdValue } = info
  info.creatorId = _ObjectId(creatorIdValue)
  info.ownerId = _ObjectId(creatorIdValue)

  const coursesAffectedObjIds = coursesAffected.map(element => {
    return _ObjectId(element)
  })

  info.coursesAffected = coursesAffectedObjIds

  try {
    const result = await _db.collection('advisories').insertOne(info)
    return result
  } catch (error) {
    throw new Error(`Advisory Services Create Advisory ${error}`)
  }
}

const readAdvisoriesAll = async (_db, filters) => {
  // TODO: Sanitize filters
  // TODO: Make this a seperate helper function
  const mongoFilters = filters.reduce((obj, item) => {
    const [key] = Object.keys(item)
    const value = item[key]
    obj[key] = value
    return obj
  }, {})

  try {
    const cursor = await _db.collection('advisories').aggregate([{ $match: mongoFilters }, { $lookup: { from: 'courses', localField: 'coursesAffected', foreignField: '_id', as: 'coursesAffectedLeftJoin' } }, { $project: { facility: 1, from: 1, to: 1, condition: 1, startDate: 1, endDate: 1, isPublished: 1, creatorId: 1, updated: 1, ownerId: 1, coursesAffectedLeftJoin: { _id: 1, title: 1 } } }, { $sort: { 'facility': 1 } }])
    const data = await cursor.toArray()
    return data
  } catch (error) {
    throw new Error(`Advisory Services Read Advisories All ${error}`)
  }
}

const updateAdvisory = async (_db, _ObjectId, itemId, info, updateInfo) => {
  const itemObjId = _ObjectId(itemId)

  const { by: { userId, firstName, lastName }, at } = updateInfo
  const userObjId = _ObjectId(userId)

  const filter = { _id: itemObjId }
  const modifiers = { $push: { updated: { by: { userId: userObjId, firstName, lastName }, at } } }

  const updateDoc = { ...info, ...modifiers }

  try { 
    const result = await _db.collection('advisories').updateOne(filter, updateDoc)
    return result
  } catch (error) {
    throw new Error(`Advisory Services Update Advisory ${error}`)
  }
 }

export {
  createAdvisory,
  readAdvisoriesAll,
  updateAdvisory
}
