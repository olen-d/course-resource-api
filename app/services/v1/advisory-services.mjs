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

const readAdvisoriesAll = async (_db, _ObjectId, filters) => {
  // TODO: Sanitize filters
  // TODO: Make this a seperate helper function
  const mongoFilters = filters.reduce((obj, item) => {
    const [key] = Object.keys(item)
    const value = item[key]
    obj[key] = value
    return obj
  }, {})

  try {
    const cursor = await _db.collection('advisories').aggregate([{ $match: mongoFilters }, { $lookup: { from: 'courses', localField: 'coursesAffected', foreignField: '_id', as: 'coursesAffectedLeftJoin' } }, { $project: { facility: 1, from: 1, to: 1, condition: 1, startDate: 1, endDate: 1, isPublixhed: 1, creatorId: 1, updated: 1, ownerId: 1, coursesAffectedLeftJoin: { _id: 1, title: 1 } } }, { $sort: { 'facility': 1 } }])
    const data = await cursor.toArray()
    return data
  } catch (error) {
    throw new Error(`Advisory Services Read Advisories All ${error}`)
  }
}

export {
  createAdvisory,
  readAdvisoriesAll
}
