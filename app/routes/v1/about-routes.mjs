import * as aboutControllers from '../../controllers/v1/about-controllers.mjs'

const routes = (app, opts, done) => {
  app.get('/items', aboutControllers.readPublishedAboutItems)
  app.get('/items/all', { preHandler: app.auth([app.verifyJWT]) }, aboutControllers.readAllAboutItems)
  app.get('/item/all/id/:id', {preHandler: app.auth([app.verifyJWT]) }, aboutControllers.acquireAboutItemAllById)
  app.get('/item/all/slug/:slug', { preHandler: app.auth([app.verifyJWT]) }, aboutControllers.readAboutItemBySlugAll)
  app.patch('/item/:id', { preHandler: app.auth([app.verifyJWT]) }, aboutControllers.updateAboutItem)
  app.post('/item', { preHandler: app.auth([app.verifyJWT]) }, aboutControllers.addAboutItem)
  done()
}

export { routes }
