import * as aboutControllers from '../../controllers/v1/about-controllers.mjs'

const routes = (app, opts, done) => {
  app.get('/items', aboutControllers.readAllAboutItems)
  app.patch('/item/:id', { preHandler: app.auth([app.verifyJWT]) }, aboutControllers.updateAboutItem)
  app.post('/item', { preHandler: app.auth([app.verifyJWT]) }, aboutControllers.addAboutItem)
  done()
}

export { routes }
