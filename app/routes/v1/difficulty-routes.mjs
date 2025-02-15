import { acquireDifficultyLevelById, addDifficultyLevel, readAllDifficultyLevels, reviseDifficulty } from '../../controllers/v1/difficulty-controllers.mjs'

const routes = (app, opts, done) => {
  // app.delete('/story/:id', { preHandler: app.auth([app.verifyJWT]) }, newsControllers.purgeStory)
  app.get('/', readAllDifficultyLevels)
  app.get('/id/:id', acquireDifficultyLevelById)
  // app.get('/active', newsControllers.readStoriesActive)
  // app.get('/all', { preHandler: app.auth([app.verifyJWT]) }, newsControllers.readStoriesAll)
  // app.get('/story/:id', { preHandler: app.auth([app.verifyJWT]) }, newsControllers.readStoryById)
  app.patch('/:id', { preHandler: app.auth([app.verifyJWT]) }, reviseDifficulty)
  app.post('/', { preHandler: app.auth([app.verifyJWT]) }, addDifficultyLevel)
  done()
}

export { routes }
