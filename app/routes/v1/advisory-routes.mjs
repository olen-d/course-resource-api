import {
  addAdvisory
} from '../../controllers/v1/advisory-controllers.mjs'

const routes = (app, opts, done) => {
  app.post('/advisory', { preHandler: app.auth([app.verifyJWT]) }, addAdvisory)
  done()
}

export { routes }
