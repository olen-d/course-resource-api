import {
  acquireAboutItemAllById,
  addAboutItem,
  purgeAboutItem,
  readAboutItemBySlugAll,
  readAllAboutItems,
  readPublishedAboutItems,
  updateAboutItem
} from '../../controllers/v1/about-controllers.mjs'

const routes = (app, opts, done) => {
  app.delete('/item/:id', { preHandler: app.auth([app.verifyJWT]) }, purgeAboutItem)
  app.get('/items', readPublishedAboutItems)
  app.get('/items/all', { preHandler: app.auth([app.verifyJWT]) }, readAllAboutItems)
  app.get('/item/all/id/:id', {preHandler: app.auth([app.verifyJWT]) }, acquireAboutItemAllById)
  app.get('/item/all/slug/:slug', { preHandler: app.auth([app.verifyJWT]) }, readAboutItemBySlugAll)
  app.patch('/item/:id', { preHandler: app.auth([app.verifyJWT]) }, updateAboutItem)
  app.post('/item', { preHandler: app.auth([app.verifyJWT]) }, addAboutItem)
  done()
}

export { routes }
