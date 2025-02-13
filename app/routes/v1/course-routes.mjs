import * as courseControllers from '../../controllers/v1/course-controllers.mjs'
import * as schemas from '../../schemas/v1/course-schemas.mjs'

const routes = (app, opts, done) => {
  app.delete('/course/:id', { preHandler: app.auth([app.verifyJWT]) }, courseControllers.purgeCourse)
  app.get('/', { schema: schemas.readPublishedSchema }, courseControllers.readPublishedCourses)
  app.get('/all', { schema: schemas.readAllSchema, preHandler: app.auth([app.verifyJWT]) }, courseControllers.readAllCourses)
  app.get('/all/id/:id', { preHandler: app.auth([app.verifyJWT]) }, courseControllers.acquireCourseByIdAll)
  app.get('/all/slug/:slug', { preHandler: app.auth([app.verifyJWT]) }, courseControllers.readCourseBySlugAll)
  app.get('/all/titles-slugs', { preHandler: app.auth([app.verifyJWT]) }, courseControllers.readAllCourseTitlesAndSlugs)
  app.get('/:slug', {}, courseControllers.readCourseBySlugPublished)
  app.patch('/course/:id', { preHandler: app.auth([app.verifyJWT]) }, courseControllers.updateCourse)
  app.post('/course', { schema: schemas.addSchema, preHandler: app.auth([app.verifyJWT]) }, courseControllers.addCourse)
  app.post('/files', { schema: schemas.addCourseFilesSchema, preHandler: app.auth([app.verifyJWT]) }, courseControllers.addCourseFiles)
  app.post('/images', { schema: schemas.addCourseImagesSchema, preHandler: app.auth([app.verifyJWT]) }, courseControllers.addCourseImages)
  done()
}

export { routes }
