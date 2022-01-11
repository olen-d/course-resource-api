import { authSchema } from './header-auth-schema.mjs'

const addSchema = {
  headers: authSchema,
  body: {
    type: 'object',
    required: [ 'userId' ],
    properties: {
      title: { type: 'string'},
      slug: { type: 'string' },
      userId: { type: 'string' },
      length: { type: 'number' },
      ascent: { type: 'number' },
      location: {
        type: 'object',
        required: [],
        properties: {
          latitude: { type: 'number' },
          longitude: { type: 'number' },
          address: { type: 'number' },
          street: { type: 'string' },
          city: { type: 'string' },
          state: { type: 'string' },
          country: { type: 'string' },
          postCode: { type: 'string'}
        }
      },
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
      }
    }
  }
}

const readAllSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        data: { 
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string'},
              slug: { type: 'string' },
              userId: { type: 'string' },
              length: { type: 'number' },
              ascent: { type: 'number' },
              location: {
                type: 'object',
                required: [],
                properties: {
                  latitude: { type: 'number' },
                  longitude: { type: 'number' },
                  address: { type: 'number' },
                  street: { type: 'string' },
                  city: { type: 'string' },
                  state: { type: 'string' },
                  country: { type: 'string' },
                  postCode: { type: 'string'}
                }
              },
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
                itesms: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    }
  }
}

export { addSchema, readAllSchema }
