import { authenticateUser } from '../../models/v1/auth-models.mjs'
import { readPublicKey } from '../../services/v1/auth-services.mjs'
import { sanitizeAll, trimAll } from '../../services/v1/input-services.mjs'

const tokenGrantTypePassword = async function (req, reply) {
  const { ip: clientIp } = req
  const { config: { JWT_ALGORITHM: algorithm, JWT_AUDIENCE: audience, CLIENT_ID: clientId, JWT_ISSUER: issuer, JWT_PRIVATE_KEY_PEM_FILE: privateKeyFile, RT_AUDIENCE: refreshtokenAudience, RT_PRIVATE_KEY_PEM_FILE: refreshTokenPrivateKeyFile }, mongo: { db: _db, ObjectId: _ObjectId } } = this

  const { body } = req

  const {
    body: {
      plaintextPassword: plaintextPasswordRaw,
      username: usernameRaw
    }
  } = req

  const trimmed = trimAll(body)
  const sanitized = sanitizeAll(trimmed)

  const { plaintextPassword, username } = sanitized

  const info = {
    plaintextPassword,
    username
  }

  const result = await authenticateUser(_db, _ObjectId, algorithm, audience, clientId, clientIp, info, issuer, privateKeyFile, refreshtokenAudience, refreshTokenPrivateKeyFile)
  const { status } = result

  if (status === 'created') {
    reply.code(201).send(result)
  } else if (status === 'error') {
    const { type } = result
    switch (type) {
      case 'database':
        reply.code(503).send(result)
        break
      case 'jsonwebtoken':
        reply.code(503).send(result)
        break
      case 'not found':
        reply.code(404).send(result)
        break
      case 'validation':
        reply.code(400).send(result)
        break
      default:
        reply.code(503).send(result)
    }
  }
}

const tokenPublicKey = async function (req, reply) {
  const { config: { JWT_PUBLIC_KEY_PEM_FILE: publicKeyFile } } = this
  const publicKey = readPublicKey(publicKeyFile)

  if (publicKey) {
    reply.code(200).send({ status: 'ok', data: { publicKey } })
  }
}

export { tokenGrantTypePassword, tokenPublicKey }
