import * as aboutControllers from '../../controllers/v1/about-controllers.mjs'

const routes = (app, opts, done) => {
  app.post('/item', { preHandler: app.auth([app.verifyJWT]) }, aboutControllers.addAboutItem)
  done()
}

export { routes }
