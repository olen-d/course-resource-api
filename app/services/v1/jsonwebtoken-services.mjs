import * as fs from 'fs'
import jwt from 'jsonwebtoken'

const issueBearerToken = async (algorithm, audience, expiresIn, issuer, privateKeyFile, role, userId) => {
  const privateKey = fs.readFileSync(privateKeyFile)
  // jwtid - unique id

  try {
    const token = jwt.sign({ role }, privateKey, { algorithm, expiresIn, audience, issuer, subject: userId })
    return token
  } catch (error) {
    console.log(`\n\nJWT Error:\n${error}\n\n\n`)
    return error
  }
}

const issueRefreshToken = async (algorithm, refreshTokenAudience, clientId, refreshTokenExpiresIn, issuer, refreshTokenPrivateKeyFile, userId) => {
  const privateKey = fs.readFileSync(refreshTokenPrivateKeyFile)

  try {
    const refreshToken = jwt.sign({ clientId }, privateKey, { algorithm, expiresIn: refreshTokenExpiresIn, audience: refreshTokenAudience, issuer, subject: userId })
    return refreshToken
  } catch (error) {
    console.log(`\n\nRefresh Error:\n${error}\n\n\n`)
    return error
  }
}

const verifyToken = (accessToken, publicKeyFile, jwtAlgorithm, jwtIssuer) => {
  const publicKey = fs.readFileSync(publicKeyFile)
  return new Promise((resolve, reject) => {
    jwt.verify(accessToken, publicKey, { algorithms: [jwtAlgorithm], issuer: jwtIssuer }, (error, decoded) => {
      if (error) {
        reject(error)
      } else {
        resolve(decoded)
      }
    })
  })
}

export { issueBearerToken, issueRefreshToken, verifyToken }
