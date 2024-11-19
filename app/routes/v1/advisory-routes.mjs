import {
  acquireAdvisoriesAll,
  acquireAdvisoriesCoursesIds,
  acquireAdvisoryById,
  acquireAdvisoryPublishedById,
  acquireAdvisoryPublishedByRouteId,
  addAdvisory,
  reviseAdvisory
} from '../../controllers/v1/advisory-controllers.mjs'

const routes = (app, opts, done) => {
  app.get('/all', { preHandler: app.auth([app.verifyJWT]) }, acquireAdvisoriesAll)
  app.get('/advisory/:id', { preHandler: app.auth([app.verifyJWT]) }, acquireAdvisoryById)
  app.get('/advisory/published/:id', acquireAdvisoryPublishedById)
  app.get('/advisory/published/course/:id', acquireAdvisoryPublishedByRouteId)
  app.get('/courses/ids', acquireAdvisoriesCoursesIds)
  app.patch('/advisory/:id', { preHandler: app.auth([app.verifyJWT]) }, reviseAdvisory)
  app.post('/advisory', { preHandler: app.auth([app.verifyJWT]) }, addAdvisory)
  done()
}

export { routes }
