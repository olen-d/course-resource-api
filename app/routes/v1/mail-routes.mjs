import * as mailControllers from '../../controllers/v1/mail-controllers.mjs'

const routes = (app, opts, done) => {
  app.get('/check-mx/:email', mailControllers.checkMx)
  app.post('/send/contact-form', mailControllers.sendContactFormMessage);
  done()
}

export { routes }
