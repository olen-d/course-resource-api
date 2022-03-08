import { authSchema } from './header-auth-schema.mjs'
import { readAllSubSchema } from './course-sub-schemas.mjs'

const addSchema = {
  headers: authSchema,
  body: {
    type: 'object',
    required: [ 
      'title',
      'slug',
      'creatorId',
      'ownerId',
      'isPublished',
      'publishOn',
      'length',
      'ascent',
      'latitude',
      'longitude',
      'address',
      'street',
      'city',
      'state',
      'country',
      'postCode',
      'difficulty',
      'summary',
      'terrain',
      'setting',
      'happiness',
      'facts',
      'parking',
      'creation',
      'courseFiles',
      'mapLink'
    ],
    properties: {
      title: { type: 'string'},
      slug: { type: 'string' },
      creatorId: { type: 'string' },
      ownerId: { type: 'string' },
      isPublished: { type: 'boolean' },
      publishOn: { type: 'number' },
      length: { type: 'number' },
      ascent: { type: 'number' },
      latitude: { type: 'number' },
      longitude: { type: 'number' },
      address: { type: 'number' },
      street: { type: 'string' },
      city: { type: 'string' },
      state: { type: 'string' },
      country: { type: 'string' },
      postCode: { type: 'string'},
      difficulty: { 
        enum: ['easiest', 'easy', 'more difficult', 'very difficult', 'extremely difficult']
      },
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
      photographs: {
        type: 'array',
        items: {
          type: 'string'
        }
      },
      courseFiles: {
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
