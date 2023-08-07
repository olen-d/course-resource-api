import * as difficultyControllers from '../../controllers/v1/difficulty-controllers.mjs'

const routes = (app, opts, done) => {
  // app.delete('/story/:id', { preHandler: app.auth([app.verifyJWT]) }, newsControllers.purgeStory)
  app.get('/', difficultyControllers.readAllDifficultyLevels)
  // app.get('/active', newsControllers.readStoriesActive)
  // app.get('/all', { preHandler: app.auth([app.verifyJWT]) }, newsControllers.readStoriesAll)
  // app.get('/story/:id', { preHandler: app.auth([app.verifyJWT]) }, newsControllers.readStoryById)
  // app.patch('/story/:id', { preHandler: app.auth([app.verifyJWT]) }, newsControllers.reviseStory)
  app.post('/', { preHandler: app.auth([app.verifyJWT]) }, difficultyControllers.addDifficultyLevel)
  done()
}

export { routes }
