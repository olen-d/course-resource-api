import * as mailControllers from '../../controllers/v1/mail-controllers.mjs'

const routes = (app, opts, done) => {
  app.get('/check-mx/:email', mailControllers.checkMx)
  done()
}

export { routes }
