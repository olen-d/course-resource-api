import * as userControllers from '../../controllers/v1/user-controllers.mjs'
import * as schemas from '../../schemas/v1/user-schemas.mjs'

const routes = (app, opts, done) => {
  app.delete('/id/:userId', { preHandler: app.auth([app.verifyJWT]) }, userControllers.purgeUserById)
  app.get('/', { schema: schemas.readAllSchema }, userControllers.readAllUsers)
  app.get('/id/:userId', { preHandler: app.auth([app.verifyJWT]) }, userControllers.readUserById)
  app.patch(
    '/id/:userId', 
    { preHandler: app.auth([
        app.verifyJWT,
        app.verifyUseridAndPassword
      ], {
        relation: 'and'
      }) 
    }, userControllers.updateUserById
  )
  app.post(
    '/user',
    { schema: schemas.addSchema,
      preHandler: app.auth([
        app.verifyJWT,
        app.verifyUseridAndPassword
      ], {
        relation: 'and'
      })
    }, 
    userControllers.addUser
  )
  done()
}

export { routes }
