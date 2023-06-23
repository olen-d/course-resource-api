import * as newsControllers from '../../controllers/v1/news-controllers.mjs'

const routes = (app, opts, done) => {
  app.delete('/story/:id', { preHandler: app.auth([app.verifyJWT]) }, newsControllers.purgeStory)
  app.get('/', newsControllers.readStoriesPublished)
  app.get('/active', newsControllers.readStoriesActive)
  app.get('/all', { preHandler: app.auth([app.verifyJWT]) }, newsControllers.readStoriesAll)
  app.get('/story/:id', { preHandler: app.auth([app.verifyJWT]) }, newsControllers.readStoryById)
  app.patch('/story/:id', { preHandler: app.auth([app.verifyJWT]) }, newsControllers.reviseStory)
  app.post('/story', { preHandler: app.auth([app.verifyJWT]) }, newsControllers.addStory)
  done()
}

export { routes }
