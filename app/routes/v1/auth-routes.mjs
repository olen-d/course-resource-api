import * as authControllers from '../../controllers/v1/auth-controllers.mjs'
import * as schemas from '../../schemas/v1/auth-schemas.mjs'

const routes = (app, opts, done) => {
  app.get('/token/public-key', { schema: schemas.tokenPublicKeySchema }, authControllers.tokenPublicKey)
  app.post('/token/grant-type/password', { schema: schemas.tokenGrantTypePasswordSchema }, authControllers.tokenGrantTypePassword)
  done()
}

export { routes }
