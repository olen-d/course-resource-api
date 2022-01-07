import * as fs from 'fs'

const createRefreshToken = async (_db, newRefreshToken) => {
  try {
    const result = await _db.collection('refreshTokens').insertOne(newRefreshToken)
    return result
  } catch (error) {
    console.log('ERROR:', error)
  }
}

const readPublicKey = publicKeyFile => {
  const publicKey = fs.readFileSync(publicKeyFile)
  return publicKey
}

export { createRefreshToken, readPublicKey }
