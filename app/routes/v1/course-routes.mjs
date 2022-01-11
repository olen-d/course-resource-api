import * as courseControllers from '../../controllers/v1/course-controllers.mjs'
import * as schemas from '../../schemas/v1/course-schemas.mjs'


const routes = (app, opts, done) => {
  app.get('/', { schema: schemas.readAllSchema }, courseControllers.readAllCourses)
  app.post('/course', { schema: schemas.addSchema, preHandler: app.auth([app.verifyJWT]) }, courseControllers.addCourse)
  done()
}

export { routes }
