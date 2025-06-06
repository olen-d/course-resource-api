import { authSchema } from './header-auth-schema.mjs'
import { readAllSubSchema } from './course-sub-schemas.mjs'

const addSchema = {
  headers: authSchema,
  body: {
    type: 'object',
    required: [ 
      'title',
      'slug',
      'isPublished',
      'publishOn',
      'length',
      'ascent',
      'latitude',
      'longitude',
      'address',
      'city',
      'state',
      'country',
      'postcode',
      'difficulty',
      'summary',
      'terrain',
      'setting',
      'happiness',
      'facts',
      'parking',
      'creation',
      'uploadFilesCourse',
      'mapLink'
    ],
    properties: {
      title: { type: 'string'},
      slug: { type: 'string' },
      isPublished: { type: 'boolean' },
      publishOn: { type: 'number' },
      length: { type: 'number' },
      ascent: { type: 'number' },
      latitude: { type: 'number' },
      longitude: { type: 'number' },
      address: { type: 'string' },
      city: { type: 'string' },
      state: { type: 'string' },
      country: { type: 'string' },
      postcode: { type: 'string'},
      difficulty: { type: 'string' },
      summary: { type: 'string' },
      terrain: {
        enum: ['flat', 'rolling hills', 'hills', 'mountains']
      },
      setting: {
        enum: ['urban', 'suburban', 'rural', 'forest']
      },
      happiness: { type: 'number' },
      facts: { type: 'string' },
      parking: { type: 'string' },
      creation: { type: 'string' },
      uploadFilesImage: {
        type: 'array',
        items: {
          type: 'string'
        }
      },
      uploadFilesCourse: {
        type: 'array',
        items: {
          type: 'string'
        }
      },
      mapLink: { type: 'string' }
    }
  }
}

const addCourseFilesSchema = {
  headers: authSchema
}

const addCourseImagesSchema = {
  headers: authSchema
}

const readAllSchema = {
  headers: authSchema,
  readAllSubSchema
}

const readPublishedSchema = {
  readAllSubSchema
}

export { addSchema, addCourseFilesSchema, addCourseImagesSchema, readAllSchema, readPublishedSchema }
