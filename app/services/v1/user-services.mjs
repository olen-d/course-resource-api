const createUser = async (_db, _ObjectId, newUser) => {
  try {
    const { createdBy: createdByValue } = newUser
    newUser.createdBy = _ObjectId(createdByValue) // Store creatoror as an ObjectId, useful for doing $lookup
    const result = await _db.collection('users').insertOne(newUser)
    return result
  } catch (error) {
    console.log('ERROR:', error)
  }
}

const readUserById = async (_db, _ObjectId, info) => {
  try {
    const { userId } = info
    const options = {
      projection: {
        emailAddress: 1,
        firstName: 1,
        lastName: 1,
        role: 1,
        username: 1
      }
    }
    const query = _ObjectId(userId)

    const data = await _db.collection('users').findOne(query, options)
    return data
  } catch (error) {
    throw new Error(`User Services Read User By Id Error: ${error}`)
  } 
}

const readUserPasswordHash = async (_db, info) => {
  const { username } = info
  const options = { projection: { passwordHash: 1 } }
  const query = { username }

  try {
    const data = await _db.collection('users').findOne(query, options)
    return data
  } catch (error) {
    console.log('ERROR:', error)
  }
}

const readUserRole = async (_db, info) => {
  const { username } = info
  const options = { projection: { role: 1 } }
  const query = { username }

  try {
    const data = await _db.collection('users').findOne(query, options)
    return data
  } catch (error) {
    console.log('ERROR:', error)
  }
}

const readAllUsers = async (_db) => {
  const cursor = _db.collection('users').find().project({ _id: 1, firstName: 1, lastName: 1, role: 1, username: 1 })

  try {
    const data = await cursor.toArray()
    return data
  } catch (error) {
    console.log('ERROR:', error)
  }
}

const updateUserById = async(_db, _ObjectId, infoProcessed, userId) => {
  const userObjId = _ObjectId(userId)

  const filter = { _id: userObjId}
  const updateDoc = infoProcessed

  try {
    const result = await _db.collection('users').updateOne(filter, updateDoc)
    return result
  } catch (error) {
    throw new Error(`User Services Update User By Id Error: ${error}`)
  }
}

export {
  createUser,
  readAllUsers,
  readUserById,
  readUserPasswordHash,
  readUserRole,
  updateUserById
}
