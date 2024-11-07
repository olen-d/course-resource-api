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

export {
  createAdvisory
}
