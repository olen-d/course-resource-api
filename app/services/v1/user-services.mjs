const createUser = async (_db, newUser) => {
  try {
    const result = await _db.collection('users').insertOne(newUser)
    return result
  } catch (error) {
    console.log('ERROR:', error)
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

export { createUser, readAllUsers, readUserPasswordHash, readUserRole}
