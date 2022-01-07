import * as userControllers from '../../controllers/v1/user-controllers.mjs'
import * as schemas from '../../schemas/v1/user-schemas.mjs'

const routes = (app, opts, done) => {
  app.get('/', { schema: schemas.readAllSchema }, userControllers.readAllUsers)
  app.post('/user', { schema: schemas.addSchema, preHandler: app.auth([app.verifyJWT]) }, userControllers.addUser)
  done()
}

export { routes }
