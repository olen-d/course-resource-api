import * as welcomeControllers from '../../controllers/v1/welcome-controllers.mjs'

const routes = (app, opts, done) => {
  app.get('/items', welcomeControllers.readPublishedWelcomeItems)
  app.get('/items/all', { preHandler: app.auth([app.verifyJWT]) }, welcomeControllers.readAllWelcomeItems)
  app.get('/item/all/:slug', { preHandler: app.auth([app.verifyJWT]) }, welcomeControllers.readWelcomeItemBySlugAll)
  app.patch('/item/:id', { preHandler: app.auth([app.verifyJWT]) }, welcomeControllers.updateWelcomeItem)
  app.post('/item', { preHandler: app.auth([app.verifyJWT]) }, welcomeControllers.addWelcomeItem)
  done()
}

export { routes }
