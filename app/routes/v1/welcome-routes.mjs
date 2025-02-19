import {
  acquireWelcomeItemAllById,
  acquireWelcomeItemAllBySlug,
  addWelcomeItem,
  readAllWelcomeItems,
  readPublishedWelcomeItems,
  updateWelcomeItem
} from '../../controllers/v1/welcome-controllers.mjs'

const routes = (app, opts, done) => {
  app.get('/items', readPublishedWelcomeItems)
  app.get('/items/all', { preHandler: app.auth([app.verifyJWT]) }, readAllWelcomeItems)
  app.get('/item/all/id/:id', { preHandler: app.auth([app.verifyJWT]) }, acquireWelcomeItemAllById)
  app.get('/item/all/slug/:slug', { preHandler: app.auth([app.verifyJWT]) }, acquireWelcomeItemAllBySlug)
  app.patch('/item/:id', { preHandler: app.auth([app.verifyJWT]) }, updateWelcomeItem)
  app.post('/item', { preHandler: app.auth([app.verifyJWT]) }, addWelcomeItem)
  done()
}

export { routes }
