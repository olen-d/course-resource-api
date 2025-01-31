import {
  addLink,
  purgeLink,
  readAllLinks,
  readLinkByIdAll,
  readPublishedLinks,
  updateLink
} from '../../controllers/v1/link-controllers.mjs'

const routes = (app, opts, done) => {
  app.delete('/link/:id', { preHandler: app.auth([app.verifyJWT]) }, purgeLink)
  app.get('/', readPublishedLinks)
  app.get('/all', { preHandler: app.auth([app.verifyJWT]) }, readAllLinks)
  app.get('/all/:id', { preHandler: app.auth([app.verifyJWT]) }, readLinkByIdAll)
  app.patch('/link/:id', { preHandler: app.auth([app.verifyJWT]) }, updateLink)
  app.post('/link', { preHandler: app.auth([app.verifyJWT]) }, addLink)
  done()
}

export { routes }
